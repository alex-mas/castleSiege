const fs = require('fs');
const map = require('./map.json');

const generatePlayer1 = ()=>{
    console.log('executing player 1 generation')
    let data = {
        id: 'player1',
        allies: [],
        enemies: ['player2'],
        units: []
    }
    for(let i = 0; i < 10; i++){
        for(let j = 0; j <5; j++){
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
    console.log('executing player 2 generation')
    let data = {
        id: 'player2',
        allies: [],
        enemies: ['player1'],
        units: []
    }
    for(let i = 0; i < 10; i++){
        for(let j = 0; j <5; j++){
            data.units.push({
                type: 'soldier',
                x: 1500-32*j,
                y: 400+32*i
            });
        }
    }
    fs.writeFileSync('./player_2.json',JSON.stringify(data),'utf8');
}


generatePlayer1();
generatePlayer2();
