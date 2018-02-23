const pathfinder = require('../customPathfinding/index.js');
const utils = require('../utils/utils.js');

let gridData = {};


let defaultFinder = new pathfinder.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

onmessage = function (e) {
    const data = e.data.context;
    const event = e.data.event;
    switch (event) {
        case 'findPath':
            const level = data.level || 0;
            
            const id = data.id;
            const targetX = utils.pointToGrid(data.to[0]),
                targetY = utils.pointToGrid(data.to[1]);
            if(gridData[level][targetY][targetX] != 0){
                postMessage({path:[],id});
                return;
            }
            const localGrid = new pathfinder.Grid(gridData[level]);
            if(targetX != undefined && targetY != undefined){
                postMessage({
                    path: defaultFinder.findPath(data.from[0], data.from[1], targetX, targetY, localGrid),
                    id
                });
                return;
            }else{
                postMessage({
                    path: [],
                    id
                });
                return;
            }

            break;
        case 'setGrid':
            gridData = data.grid;
            break;
        case 'configureFinder':
            defaultFinder = new pathfinder[data.finder]({
                allowDiagonal: data.allowDiagonal,
                dontCrossCorners: data.dontCrossCorners
            })
        default:
            postMessage('Unable to parse the provided event, supported events are \'findPath\' and \'setGrid\' ');
    }
}