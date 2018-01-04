//TODO: implement an AI object that will be the responsable for determining what do the brains of the units owned by him do


const AI = function(game,id,initialitzationLogic, updateLogic){
    this.id = id;
    this.game = game;
    this.atStart = initialitzationLogic;
    this.update = updateLogic;
    
}
