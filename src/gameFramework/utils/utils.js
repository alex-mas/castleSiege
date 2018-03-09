const pointToGrid = (x) =>{
    if(typeof x === 'number'){
        return (x / 64) | 0;
    }else{
        return undefined;
    }
    
};
const gridToPoint = (x,atMiddle) =>{
    if(atMiddle){
        return 32 + x*64;
    }else{
        return x*64;
    }
    
};

const findById = (id,game)=>{
    if(game._unitIds[id]){
        return game._unitIds[id];
    }else{
        return false;
    }
};

const getDistance = (origin, destination)=>{
    return Math.sqrt(((origin[0] - destination[0]) ** 2) + ((origin[1] - destination[1]) ** 2));
}

module.exports ={
    pointToGrid,
    gridToPoint,
    findById,
    getDistance
};