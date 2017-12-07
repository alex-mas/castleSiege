pointToGrid = (x) =>{
    if(typeof x === 'number'){
        return (x / 64) | 0;
    }else{
        return undefined;
    }
    
}
gridToPoint = (x,atMiddle) =>{
    if(atMiddle){
        return 32 + x*64;
    }else{
        return x*64;
    }
    
}


module.exports ={
    pointToGrid,
    gridToPoint
}