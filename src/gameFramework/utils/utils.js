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

module.exports ={
    pointToGrid,
    gridToPoint,
    findById
};