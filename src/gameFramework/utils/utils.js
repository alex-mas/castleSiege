const pointToGrid = (x) =>{
    if(typeof x === 'number'){
        return (x / 64) | 0;
    }else{
        return undefined;
    }
    
}
const gridToPoint = (x,atMiddle) =>{
    if(atMiddle){
        return 32 + x*64;
    }else{
        return x*64;
    }
    
}

const findById = (id,game)=>{
    for(let i = 0; i<game._units.length; i++){
        const unit = game._units[i];
        if(unit._id === id){
            return unit;
        }
    }
    return false;
}

module.exports ={
    pointToGrid,
    gridToPoint,
    findById
}