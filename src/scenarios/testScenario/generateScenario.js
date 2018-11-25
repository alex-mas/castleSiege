const fs = require('fs');
const map = require('./map.json');

const generatePlayer1 = ()=>{
    let data = {
        id: 'player1',
        allies: [],
        enemies: ['player2'],
        units: []
    }
    for(let i = 0; i < 20; i++){
        for(let j = 0; j <10; j++){
            data.units.push({
                type: 'soldier',
                x: 32+32*j,
                y: 400+32*i
            });
        }
    }
    fs.writeFileSync('./player_1.json',JSON.stringify(data),'utf8');
}


const generatePlayer2 = ()=>{
    let data = {
        id: 'player2',
        allies: [],
        enemies: ['player1'],
        units: []
    }
    for(let i = 0; i < 20; i++){
        for(let j = 0; j <10; j++){
            data.units.push({
                type: 'soldier',
                x: 2500-32*j,
                y: 400+32*i
            });
        }
    }
    fs.writeFileSync('./player_2.json',JSON.stringify(data),'utf8');
}

