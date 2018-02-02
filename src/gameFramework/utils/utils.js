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
    for(var i = 0; i<game._units.length; i++){
        if(game._units[i]._id === id){
            return game._units[i];
        }
    }
    return false;
};

module.exports ={
    pointToGrid,
    gridToPoint,
    findById
};