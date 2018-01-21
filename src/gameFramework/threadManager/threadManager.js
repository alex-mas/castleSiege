


/**
 * @description - implements methods of delegating work to workers and acts as intermediary between the requesting objects and the workers
 * 
 * @param {String} callerPath 
 * @param {String} relFilePath - relative file path from the current directory towards the file that implements the desired worker
 * @param {Object} config - (OPTIONAL) defaults to an empty object
 * @param {function} eHandler - function that takes one argument, the event, which will hold the data passed back by the workers on message broadcasting
 * 
 * 
 * @property {Object} config - Holds the configuration provided by the user
 * @property {String} callerPath - Holds the path provided by __dirname on the context of the caller
 * @property {String} relFilePath - Holds the relative path from callerPath to the file the user wants to execute the worker
 * @property {Number} amountOfWorkers - Determines how many workers will the thread manage
 * @property {Worker[]} workers - Holds references to all the workers being managed
 * @property {Number} lastAssignedWorker - Matches the index of the worker inside workers array that was assigned work more recently
 * 
 */
const ThreadManager = function (callerPath, relFilePath, config = {},eHandler) {
    //static property initalization
    if (!callerPath || !relFilePath) {
        throw new Error(`File paths must be provided in order for the thread manager to work, expected two string arguments as paths and instead got ${callerPath} and ${relFilePath}`)
    }
    //configuration initialization
    this.config = config;
    //distribution
    if (!this.config.distributionMethod)
        this.config.distributionMethod = "round_robin";
    //initialization
    if (!this.config.initialization)
        this.config.initialization = "at_start";
    //sending method
    if(!this.config.sendingMethod)
        this.config.sendingMethod = "default";

    //filepaths
    this.callerPath = callerPath;
    this.filePath = relFilePath;

    //worker config
    this.amountOfWorkers = config.amountOfWorkers || 4;
    this.workers = [];
    this.lastAssignedWorker = undefined;

    //define provided handler
    if (!eHandler || typeof eHandler !== "function") {
        this.isCallbackDefined = false;
    } else {
        this.onMessage = eHandler;
        this.isCallbackDefined = true;
    }

    //worker startup
    if (this.config.initialization === "at_start") {
        for (let i = 0; i < this.amountOfWorkers; i++) {
            this.workers.push(new Worker(this.callerPath + this.filePath));
            this.workers[i].onmessage = this.onMessage;
        }
    }

}


ThreadManager.prototype.setEventHandler = function(handler){
    if(!handler || typeof handler !== 'function')
        throw new Error(`Expected a function as argument and got a ${typeof handler}`);
    this.onMessage = handler;
    this.isCallbackDefined = true;
}


ThreadManager.prototype.distributeWork = function (event, context, callback) {

    let workHandler = callback || this.onMessage;
    if (workHandler === undefined || typeof workHandler !== "function") {
        throw new Error('Cant distribute work without a function to handle its return value');
    }
    //if workers are not initialized we initialize one of them
    if (this.workers.length < this.amountOfWorkers && this.config.initialization === "delayed") {

        //with delayed method while there are worker slots available 
        //we directly stream work into the one we just initialized
        this.workers.push(new Worker(this.callerPath + this.filePath));

        this.workers[this.workers.length - 1].onmessage = workHandler;
        this.workers[this.workers.length - 1].postMessage({ event, context });

        //return to prevent duplicating the requests on the worker
        return;
    }

    let assignedWorker;
    /*
    Round robin method, it keeps destributing the work sequentialy regardless of execution status on the workers
    */
    if (this.config.distributionMethod === "round_robin") {

        //If its the first time or we finished a round we distribute it to the first
        if (this.lastAssignedWorker === undefined || this.lastAssignedWorker < 0) {
            assignedWorker = this.workers[0];
            this.lastAssignedWorker = 0;
        } else {
            if (this.lastAssignedWorker < this.workers.length - 2) {
                //increase the index and use it to determine the actual worker to assign
                this.lastAssignedWorker++;
                assignedWorker = this.workers[this.lastAssignedWorker];
            } else {
                //reset index and assing work to last element in the array
                assignedWorker = this.workers[this.workers.length - 1];
                this.lastAssignedWorker = -1;
            }
        }
    } else if (this.config.distributionMethod === "not_implemented_yet") {
        //TODO: IMPLEMENT MORE SMART WAYS, such as a smart_round_robin that takes into account if they are finished or not
    }


    //once we have chosen the worker that will take the job: 
    //  we assign its callback and then give it the work
    assignedWorker.onmessage = workHandler;
    if(this.config.sendingMethod === "transferList"){
        let data = { event, context };
        assignedWorker.postMessage(data, [data]);
    }else{
        assignedWorker.postMessage({ event, context });
    }
    
}



module.exports = ThreadManager;