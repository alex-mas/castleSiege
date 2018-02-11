const pathfinder = require('../customPathfinding/index.js');
const utils = require('../utils/utils.js');

let gridData = [];

let grid = {};

let defaultFinder = new pathfinder.AStarFinder({
    allowDiagonal: true,
    dontCrossCorners: true
});

onmessage = function (e) {
    const data = e.data.context;
    const event = e.data.event;
    switch (event) {
        case 'findPath':
            const localGrid = new pathfinder.Grid(gridData);
            const id = data.id;
            const targetX = utils.pointToGrid(data.to[0]),
                targetY = utils.pointToGrid(data.to[1]);
            if(targetX != undefined && targetY != undefined){
                postMessage({
                    path: defaultFinder.findPath(data.from[0], data.from[1], targetX, targetY, localGrid),
                    id
                });
            }else{
                postMessage({
                    path: [],
                    id
                });
            }

            break;
        case 'setGrid':
            gridData = data.grid;
            grid = new pathfinder.Grid(data.grid);
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