//TODO: CHANGE FROM WEB WORKERS(THAT DON'T SUPPORT REQUIRE) to NODE CLUSTER


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
 * @property {Number} ammountOfWorkers - Determines how many workers will the thread manage
 * @property {Worker[]} workers - Holds references to all the workers being managed
 * @property {Number} lastAssignedWorker - Matches the index of the worker inside workers array that was assigned work more recently
 * 
 */
const ThreadManager = function (callerPath, relFilePath, config = {}, eHandler) {
    //static property initalization
    if (!callerPath || !relFilePath) {
        throw new Error(`File paths must be provided in order for the thread manager to work, expected two string arguments as paths and instead got ${callerPath} and ${relFilePath}`)
    }
    //configuration initialization
    this.config = config;
    if (!this.config.distributionMethod)
        this.config.distributionMethod = "round_robin";
    if (!this.config.initialization)
        this.config.initialization = "at_start";

    //filepaths
    this.callerPath = callerPath;
    this.filePath = relFilePath;

    //worker config
    this.ammountOfWorkers = config.ammountOfWorkers || 4;
    this.workers = [];
    this.lastAssignedWorker = undefined;

    //define provided handler
    if (!eHandler || typeof eHandler !== "function")
        throw new Error(`Event handler must be provided, expected a function and got a ${typeof eHandler}`);
    this.onMessage = eHandler;

    //worker startup
    if (this.config.initialization === "at_start") {
        for (let i = 0; i < this.ammountOfWorkers; i++) {
            this.workers.push(new Worker(this.callerPath + this.filePath));
            this.workers[i].onmessage = this.onMessage;
        }
    }

}




ThreadManager.prototype.distributeWork = function (event, context) {

    //if workers are not initialized we initialize one of them
    if (this.workers.length < this.ammountOfWorkers && this.config.initialization === "delayed") {

        //with delayed method while there are worker slots available 
        //we directly stream work into the one we just initialized
        this.workers.push(new Worker(this.callerPath + this.filePath));
        this.workers[this.workers.length - 1].onmessage = this.onMessage;
        this.workers[this.workers.length - 1].postMessage({ event, context });

        //return to prevent duplicating the requests on the worker
        return;
    }

    /*
    Round robin method, it keeps destributing the work sequentialy regardless of execution status on the workers
    */
    if (this.config.distributionMethod === "round_robin") {

        //If its the first time or we finished a round we distribute it to the first
        if (this.lastAssignedWorker === undefined || this.lastAssignedWorker < 0) {
            this.workers[0].postMessage({ event, context });
            this.lastAssignedWorker = 0;
        } else {
            if (this.lastAssignedWorker < this.workers.length-2) {
                //increase the index and use it to determine the actual worker to assign
                this.lastAssignedWorker++;
                this.workers[this.lastAssignedWorker].postMessage({ event, context });
            } else {
                //reset index and assing work to last element in the array
                this.workers[this.workers.length - 1].postMessage({ event, context });
                this.lastAssignedWorker = -1;
            }
        }
    } else if (this.config.distributionMethod === "not_implemented_yet") {
        //TODO: IMPLEMENT MORE SMART WAYS, such as a smart_round_robin that takes into account if they are finished or not
    }
}



module.exports = ThreadManager;