/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 60);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var DiagonalMovement = {
  Always: 1,
  Never: 2,
  IfAtMostOneObstacle: 3,
  OnlyWhenNoObstacles: 4
};
module.exports = DiagonalMovement;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

/**
 * Backtrace according to the parent records and return the path.
 * (including both start and end nodes)
 * @param {Node} node End node
 * @return {Array<Array<number>>} the path
 */
function backtrace(node) {
  var path = [[node.x, node.y]];

  while (node.parent) {
    node = node.parent;
    path.push([node.x, node.y]);
  }

  return path.reverse();
}

exports.backtrace = backtrace;
/**
 * Backtrace from start and end node, and return the path.
 * (including both start and end nodes)
 * @param {Node}
 * @param {Node}
 */

function biBacktrace(nodeA, nodeB) {
  var pathA = backtrace(nodeA),
      pathB = backtrace(nodeB);
  return pathA.concat(pathB.reverse());
}

exports.biBacktrace = biBacktrace;
/**
 * Compute the length of the path.
 * @param {Array<Array<number>>} path The path
 * @return {number} The length of the path
 */

function pathLength(path) {
  var i,
      sum = 0,
      a,
      b,
      dx,
      dy;

  for (i = 1; i < path.length; ++i) {
    a = path[i - 1];
    b = path[i];
    dx = a[0] - b[0];
    dy = a[1] - b[1];
    sum += Math.sqrt(dx * dx + dy * dy);
  }

  return sum;
}

exports.pathLength = pathLength;
/**
 * Given the start and end coordinates, return all the coordinates lying
 * on the line formed by these coordinates, based on Bresenham's algorithm.
 * http://en.wikipedia.org/wiki/Bresenham's_line_algorithm#Simplification
 * @param {number} x0 Start x coordinate
 * @param {number} y0 Start y coordinate
 * @param {number} x1 End x coordinate
 * @param {number} y1 End y coordinate
 * @return {Array<Array<number>>} The coordinates on the line
 */

function interpolate(x0, y0, x1, y1) {
  var abs = Math.abs,
      line = [],
      sx,
      sy,
      dx,
      dy,
      err,
      e2;
  dx = abs(x1 - x0);
  dy = abs(y1 - y0);
  sx = x0 < x1 ? 1 : -1;
  sy = y0 < y1 ? 1 : -1;
  err = dx - dy;

  while (true) {
    line.push([x0, y0]);

    if (x0 === x1 && y0 === y1) {
      break;
    }

    e2 = 2 * err;

    if (e2 > -dy) {
      err = err - dy;
      x0 = x0 + sx;
    }

    if (e2 < dx) {
      err = err + dx;
      y0 = y0 + sy;
    }
  }

  return line;
}

exports.interpolate = interpolate;
/**
 * Given a compressed path, return a new path that has all the segments
 * in it interpolated.
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} expanded path
 */

function expandPath(path) {
  var expanded = [],
      len = path.length,
      coord0,
      coord1,
      interpolated,
      interpolatedLen,
      i,
      j;

  if (len < 2) {
    return expanded;
  }

  for (i = 0; i < len - 1; ++i) {
    coord0 = path[i];
    coord1 = path[i + 1];
    interpolated = interpolate(coord0[0], coord0[1], coord1[0], coord1[1]);
    interpolatedLen = interpolated.length;

    for (j = 0; j < interpolatedLen - 1; ++j) {
      expanded.push(interpolated[j]);
    }
  }

  expanded.push(path[len - 1]);
  return expanded;
}

exports.expandPath = expandPath;
/**
 * Smoothen the give path.
 * The original path will not be modified; a new path will be returned.
 * @param {PF.Grid} grid
 * @param {Array<Array<number>>} path The path
 */

function smoothenPath(grid, path) {
  var len = path.length,
      x0 = path[0][0],
      // path start x
  y0 = path[0][1],
      // path start y
  x1 = path[len - 1][0],
      // path end x
  y1 = path[len - 1][1],
      // path end y
  sx,
      sy,
      // current start coordinate
  ex,
      ey,
      // current end coordinate
  newPath,
      i,
      j,
      coord,
      line,
      testCoord,
      blocked;
  sx = x0;
  sy = y0;
  newPath = [[sx, sy]];

  for (i = 2; i < len; ++i) {
    coord = path[i];
    ex = coord[0];
    ey = coord[1];
    line = interpolate(sx, sy, ex, ey);
    blocked = false;

    for (j = 1; j < line.length; ++j) {
      testCoord = line[j];

      if (!grid.isWalkableAt(testCoord[0], testCoord[1])) {
        blocked = true;
        break;
      }
    }

    if (blocked) {
      lastValidCoord = path[i - 1];
      newPath.push(lastValidCoord);
      sx = lastValidCoord[0];
      sy = lastValidCoord[1];
    }
  }

  newPath.push([x1, y1]);
  return newPath;
}

exports.smoothenPath = smoothenPath;
/**
 * Compress a path, remove redundant nodes without altering the shape
 * The original path is not modified
 * @param {Array<Array<number>>} path The path
 * @return {Array<Array<number>>} The compressed path
 */

function compressPath(path) {
  // nothing to compress
  if (path.length < 3) {
    return path;
  }

  var compressed = [],
      sx = path[0][0],
      // start x
  sy = path[0][1],
      // start y
  px = path[1][0],
      // second point x
  py = path[1][1],
      // second point y
  dx = px - sx,
      // direction between the two points
  dy = py - sy,
      // direction between the two points
  lx,
      ly,
      ldx,
      ldy,
      sq,
      i; // normalize the direction

  sq = Math.sqrt(dx * dx + dy * dy);
  dx /= sq;
  dy /= sq; // start the new path

  compressed.push([sx, sy]);

  for (i = 2; i < path.length; i++) {
    // store the last point
    lx = px;
    ly = py; // store the last direction

    ldx = dx;
    ldy = dy; // next point

    px = path[i][0];
    py = path[i][1]; // next direction

    dx = px - lx;
    dy = py - ly; // normalize

    sq = Math.sqrt(dx * dx + dy * dy);
    dx /= sq;
    dy /= sq; // if the direction has changed, store the point

    if (dx !== ldx || dy !== ldy) {
      compressed.push([lx, ly]);
    }
  } // store the last point


  compressed.push([px, py]);
  return compressed;
}

exports.compressPath = compressPath;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/**
 * @namespace PF.Heuristic
 * @description A collection of heuristic functions.
 */
module.exports = {
  /**
   * Manhattan distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} dx + dy
   */
  manhattan: function (dx, dy) {
    return dx + dy;
  },

  /**
   * Euclidean distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy)
   */
  euclidean: function (dx, dy) {
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Octile distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} sqrt(dx * dx + dy * dy) for grids
   */
  octile: function (dx, dy) {
    var F = Math.SQRT2 - 1;
    return dx < dy ? F * dx + dy : F * dy + dx;
  },

  /**
   * Chebyshev distance.
   * @param {number} dx - Difference in x.
   * @param {number} dy - Difference in y.
   * @return {number} max(dx, dy)
   */
  chebyshev: function (dx, dy) {
    return Math.max(dx, dy);
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("heap");

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var Heap = __webpack_require__(3);

var Util = __webpack_require__(1);

var Heuristic = __webpack_require__(2);

var DiagonalMovement = __webpack_require__(0);
/**
 * Base class for the Jump Point Search algorithm
 * @param {object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */


function JumpPointFinderBase(opt) {
  opt = opt || {};
  this.heuristic = opt.heuristic || Heuristic.manhattan;
  this.trackJumpRecursion = opt.trackJumpRecursion || false;
}
/**
 * Find and return the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


JumpPointFinderBase.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var openList = this.openList = new Heap(function (nodeA, nodeB) {
    return nodeA.f - nodeB.f;
  }),
      startNode = this.startNode = grid.getNodeAt(startX, startY),
      endNode = this.endNode = grid.getNodeAt(endX, endY),
      node;
  this.grid = grid; // set the `g` and `f` value of the start node to be 0

  startNode.g = 0;
  startNode.f = 0; // push the start node into the open list

  openList.push(startNode);
  startNode.opened = true; // while the open list is not empty

  while (!openList.empty()) {
    // pop the position of node which has the minimum `f` value.
    node = openList.pop();
    node.closed = true;

    if (node === endNode) {
      return Util.expandPath(Util.backtrace(endNode));
    }

    this._identifySuccessors(node);
  } // fail to find the path


  return [];
};
/**
 * Identify successors for the given node. Runs a jump point search in the
 * direction of each available neighbor, adding any points found to the open
 * list.
 * @protected
 */


JumpPointFinderBase.prototype._identifySuccessors = function (node) {
  var grid = this.grid,
      heuristic = this.heuristic,
      openList = this.openList,
      endX = this.endNode.x,
      endY = this.endNode.y,
      neighbors,
      neighbor,
      jumpPoint,
      i,
      l,
      x = node.x,
      y = node.y,
      jx,
      jy,
      dx,
      dy,
      d,
      ng,
      jumpNode,
      abs = Math.abs,
      max = Math.max;
  neighbors = this._findNeighbors(node);

  for (i = 0, l = neighbors.length; i < l; ++i) {
    neighbor = neighbors[i];
    jumpPoint = this._jump(neighbor[0], neighbor[1], x, y);

    if (jumpPoint) {
      jx = jumpPoint[0];
      jy = jumpPoint[1];
      jumpNode = grid.getNodeAt(jx, jy);

      if (jumpNode.closed) {
        continue;
      } // include distance, as parent may not be immediately adjacent:


      d = Heuristic.octile(abs(jx - x), abs(jy - y));
      ng = node.g + d; // next `g` value

      ng *= neighbor.weight;

      if (!jumpNode.opened || ng < jumpNode.g) {
        jumpNode.g = ng;
        jumpNode.h = jumpNode.h || heuristic(abs(jx - endX), abs(jy - endY));
        jumpNode.f = jumpNode.g + jumpNode.h;
        jumpNode.parent = node;

        if (!jumpNode.opened) {
          openList.push(jumpNode);
          jumpNode.opened = true;
        } else {
          openList.updateItem(jumpNode);
        }
      }
    }
  }
};

module.exports = JumpPointFinderBase;

/***/ }),
/* 5 */
/***/ (function(module, exports) {

/**
 * A node in grid. 
 * This class holds some basic information about a node and custom 
 * attributes may be added, depending on the algorithms' needs.
 * @constructor
 * @param {number} x - The x coordinate of the node on the grid.
 * @param {number} y - The y coordinate of the node on the grid.
 * @param {boolean} [walkable] - Whether this node is walkable.
 */
function Node(x, y, walkable, weight) {
  /**
   * The x coordinate of the node on the grid.
   * @type number
   */
  this.x = x;
  /**
   * The y coordinate of the node on the grid.
   * @type number
   */

  this.y = y;
  /**
   * Whether this node can be walked through.
   * @type boolean
   */

  this.walkable = walkable === undefined ? true : walkable;
  /**
   * weight multiplier of this node.
   * @type number (defaults to 1)
   */

  this.weight = weight === undefined ? 1 : weight;
}

module.exports = Node;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

var Heap = __webpack_require__(3);

var Util = __webpack_require__(1);

var Heuristic = __webpack_require__(2);

var DiagonalMovement = __webpack_require__(0);
/**
 * A* path-finder. Based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching 
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */


function AStarFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.heuristic = opt.heuristic || Heuristic.manhattan;
  this.weight = opt.weight || 1;
  this.diagonalMovement = opt.diagonalMovement;

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  } // When diagonal movement is allowed the manhattan heuristic is not
  //admissible. It should be octile instead


  if (this.diagonalMovement === DiagonalMovement.Never) {
    this.heuristic = opt.heuristic || Heuristic.manhattan;
  } else {
    this.heuristic = opt.heuristic || Heuristic.octile;
  }
}
/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


AStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var openList = new Heap(function (nodeA, nodeB) {
    return nodeA.f - nodeB.f;
  }),
      startNode = grid.getNodeAt(startX, startY),
      endNode = grid.getNodeAt(endX, endY),
      heuristic = this.heuristic,
      diagonalMovement = this.diagonalMovement,
      weight = this.weight,
      abs = Math.abs,
      SQRT2 = Math.SQRT2,
      node,
      neighbors,
      neighbor,
      i,
      l,
      x,
      y,
      ng; // set the `g` and `f` value of the start node to be 0

  startNode.g = 0;
  startNode.f = 0; // push the start node into the open list

  openList.push(startNode);
  startNode.opened = true; // while the open list is not empty

  while (!openList.empty()) {
    // pop the position of node which has the minimum `f` value.
    node = openList.pop();
    node.closed = true; // if reached the end position, construct the path and return it

    if (node === endNode) {
      return Util.backtrace(endNode);
    } // get neigbours of the current node


    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      x = neighbor.x;
      y = neighbor.y; // get the distance between current node and the neighbor
      // and calculate the next g score

      ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);
      ng *= neighbor.weight; // check if the neighbor has not been inspected yet, or
      // can be reached with smaller cost from the current node

      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (!neighbor.opened) {
          openList.push(neighbor);
          neighbor.opened = true;
        } else {
          // the neighbor can be reached with smaller cost.
          // Since its f value has been updated, we have to
          // update its position in the open list
          openList.updateItem(neighbor);
        }
      }
    } // end for each neighbor

  } // end while not open list empty
  // fail to find the path


  return [];
};

module.exports = AStarFinder;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

var Heap = __webpack_require__(3);

var Util = __webpack_require__(1);

var Heuristic = __webpack_require__(2);

var DiagonalMovement = __webpack_require__(0);
/**
 * A* path-finder.
 * based upon https://github.com/bgrins/javascript-astar
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 */


function BiAStarFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.diagonalMovement = opt.diagonalMovement;
  this.heuristic = opt.heuristic || Heuristic.manhattan;
  this.weight = opt.weight || 1;

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  } //When diagonal movement is allowed the manhattan heuristic is not admissible
  //It should be octile instead


  if (this.diagonalMovement === DiagonalMovement.Never) {
    this.heuristic = opt.heuristic || Heuristic.manhattan;
  } else {
    this.heuristic = opt.heuristic || Heuristic.octile;
  }
}
/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


BiAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var cmp = function (nodeA, nodeB) {
    return nodeA.f - nodeB.f;
  },
      startOpenList = new Heap(cmp),
      endOpenList = new Heap(cmp),
      startNode = grid.getNodeAt(startX, startY),
      endNode = grid.getNodeAt(endX, endY),
      heuristic = this.heuristic,
      diagonalMovement = this.diagonalMovement,
      weight = this.weight,
      abs = Math.abs,
      SQRT2 = Math.SQRT2,
      node,
      neighbors,
      neighbor,
      i,
      l,
      x,
      y,
      ng,
      BY_START = 1,
      BY_END = 2; // set the `g` and `f` value of the start node to be 0
  // and push it into the start open list


  startNode.g = 0;
  startNode.f = 0;
  startOpenList.push(startNode);
  startNode.opened = BY_START; // set the `g` and `f` value of the end node to be 0
  // and push it into the open open list

  endNode.g = 0;
  endNode.f = 0;
  endOpenList.push(endNode);
  endNode.opened = BY_END; // while both the open lists are not empty

  while (!startOpenList.empty() && !endOpenList.empty()) {
    // pop the position of start node which has the minimum `f` value.
    node = startOpenList.pop();
    node.closed = true; // get neigbours of the current node

    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      if (neighbor.opened === BY_END) {
        return Util.biBacktrace(node, neighbor);
      }

      x = neighbor.x;
      y = neighbor.y; // get the distance between current node and the neighbor
      // and calculate the next g score

      ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2);
      ng *= neighbor.weight; // check if the neighbor has not been inspected yet, or
      // can be reached with smaller cost from the current node

      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h || weight * heuristic(abs(x - endX), abs(y - endY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (!neighbor.opened) {
          startOpenList.push(neighbor);
          neighbor.opened = BY_START;
        } else {
          // the neighbor can be reached with smaller cost.
          // Since its f value has been updated, we have to
          // update its position in the open list
          startOpenList.updateItem(neighbor);
        }
      }
    } // end for each neighbor
    // pop the position of end node which has the minimum `f` value.


    node = endOpenList.pop();
    node.closed = true; // get neigbours of the current node

    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      if (neighbor.opened === BY_START) {
        return Util.biBacktrace(neighbor, node);
      }

      x = neighbor.x;
      y = neighbor.y; // get the distance between current node and the neighbor
      // and calculate the next g score

      ng = node.g + (x - node.x === 0 || y - node.y === 0 ? 1 : SQRT2); // check if the neighbor has not been inspected yet, or
      // can be reached with smaller cost from the current node

      if (!neighbor.opened || ng < neighbor.g) {
        neighbor.g = ng;
        neighbor.h = neighbor.h || weight * heuristic(abs(x - startX), abs(y - startY));
        neighbor.f = neighbor.g + neighbor.h;
        neighbor.parent = node;

        if (!neighbor.opened) {
          endOpenList.push(neighbor);
          neighbor.opened = BY_END;
        } else {
          // the neighbor can be reached with smaller cost.
          // Since its f value has been updated, we have to
          // update its position in the open list
          endOpenList.updateItem(neighbor);
        }
      }
    } // end for each neighbor

  } // end while not open list empty
  // fail to find the path


  return [];
};

module.exports = BiAStarFinder;

/***/ }),
/* 8 */,
/* 9 */
/***/ (function(module, exports) {

pointToGrid = x => {
  if (typeof x === 'number') {
    return x / 64 | 0;
  } else {
    return undefined;
  }
};

gridToPoint = (x, atMiddle) => {
  if (atMiddle) {
    return 32 + x * 64;
  } else {
    return x * 64;
  }
};

module.exports = {
  pointToGrid,
  gridToPoint
};

/***/ }),
/* 10 */,
/* 11 */,
/* 12 */,
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */,
/* 17 */,
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(19);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  'Heap': __webpack_require__(3),
  'Node': __webpack_require__(5),
  'Grid': __webpack_require__(20),
  'Util': __webpack_require__(1),
  'DiagonalMovement': __webpack_require__(0),
  'Heuristic': __webpack_require__(2),
  'AStarFinder': __webpack_require__(6),
  'BestFirstFinder': __webpack_require__(21),
  'BreadthFirstFinder': __webpack_require__(22),
  'DijkstraFinder': __webpack_require__(23),
  'BiAStarFinder': __webpack_require__(7),
  'BiBestFirstFinder': __webpack_require__(24),
  'BiBreadthFirstFinder': __webpack_require__(25),
  'BiDijkstraFinder': __webpack_require__(26),
  'IDAStarFinder': __webpack_require__(27),
  'JumpPointFinder': __webpack_require__(28)
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var Node = __webpack_require__(5);

var DiagonalMovement = __webpack_require__(0);
/**
 * The Grid class, which serves as the encapsulation of the layout of the nodes.
 * @constructor
 * @param {number|Array<Array<(number|boolean)>>} width_or_matrix Number of columns of the grid, or matrix
 * @param {number} height Number of rows of the grid.
 * @param {Array<Array<(number|boolean)>>} [matrix] - A 0-1 matrix
 *     representing the walkable status of the nodes(0 or false for walkable).
 *     If the matrix is not supplied, all the nodes will be walkable.  */


function Grid(width_or_matrix, height, matrix) {
  var width;

  if (typeof width_or_matrix !== 'object') {
    width = width_or_matrix;
  } else {
    height = width_or_matrix.length;
    width = width_or_matrix[0].length;
    matrix = width_or_matrix;
  }
  /**
   * The number of columns of the grid.
   * @type number
   */


  this.width = width;
  /**
   * The number of rows of the grid.
   * @type number
   */

  this.height = height;
  /**
   * A 2D array of nodes.
   */

  this.nodes = this._buildNodes(width, height, matrix);
}
/**
 * Build and return the nodes.
 * @private
 * @param {number} width
 * @param {number} height
 * @param {Array<Array<number|boolean>>} [matrix] - A 0-1 matrix representing
 *     the walkable status of the nodes.
 * @see Grid
 */


Grid.prototype._buildNodes = function (width, height, matrix) {
  var i,
      j,
      nodes = new Array(height);

  for (i = 0; i < height; ++i) {
    nodes[i] = new Array(width);

    for (j = 0; j < width; ++j) {
      nodes[i][j] = new Node(j, i);
    }
  }

  if (matrix === undefined) {
    return nodes;
  }

  if (matrix.length !== height || matrix[0].length !== width) {
    throw new Error('Matrix size does not fit');
  }

  for (i = 0; i < height; ++i) {
    for (j = 0; j < width; ++j) {
      if (matrix[i][j]) {
        // 0, false, null will be walkable
        // while others will be un-walkable
        nodes[i][j].walkable = false;
      }
    }
  }

  return nodes;
};

Grid.prototype.getNodeAt = function (x, y) {
  return this.nodes[y][x];
};
/**
 * Determine whether the node at the given position is walkable.
 * (Also returns false if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {boolean} - The walkability of the node.
 */


Grid.prototype.isWalkableAt = function (x, y) {
  return this.isInside(x, y) && this.nodes[y][x].walkable;
};
/**
 * Determine whether the position is inside the grid.
 * XXX: `grid.isInside(x, y)` is wierd to read.
 * It should be `(x, y) is inside grid`, but I failed to find a better
 * name for this method.
 * @param {number} x
 * @param {number} y
 * @return {boolean}
 */


Grid.prototype.isInside = function (x, y) {
  return x >= 0 && x < this.width && y >= 0 && y < this.height;
};
/**
 * Set whether the node on the given position is walkable.
 * NOTE: throws exception if the coordinate is not inside the grid.
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {boolean} walkable - Whether the position is walkable.
 */


Grid.prototype.setWalkableAt = function (x, y, walkable) {
  this.nodes[y][x].walkable = walkable;
};
/**
 * Set the weight multiplier of a given node
 * NOTE: if it is unset, we will return 1 since this will do nothing
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @param {number} weight - Weight multiplier of the node
 */


Grid.prototype.setWeightAt = function (x, y, weight) {
  if (this.isInside(x, y)) this.nodes[y][x].weight = weight;
};
/**
 * Determine the weight mulitpler of a given node.
 * (Also returns 1 if the position is outside the grid.)
 * @param {number} x - The x coordinate of the node.
 * @param {number} y - The y coordinate of the node.
 * @return {number} - The weight multiplier of the node.
 */


Grid.prototype.getWeightAt = function (x, y) {
  return this.isInside(x, y) ? this.nodes[y][x].weight : 1;
};
/**
 * Get the neighbors of the given node.
 *
 *     offsets      diagonalOffsets:
 *  +---+---+---+    +---+---+---+
 *  |   | 0 |   |    | 0 |   | 1 |
 *  +---+---+---+    +---+---+---+
 *  | 3 |   | 1 |    |   |   |   |
 *  +---+---+---+    +---+---+---+
 *  |   | 2 |   |    | 3 |   | 2 |
 *  +---+---+---+    +---+---+---+
 *
 *  When allowDiagonal is true, if offsets[i] is valid, then
 *  diagonalOffsets[i] and
 *  diagonalOffsets[(i + 1) % 4] is valid.
 * @param {Node} node
 * @param {DiagonalMovement} diagonalMovement
 */


Grid.prototype.getNeighbors = function (node, diagonalMovement) {
  var x = node.x,
      y = node.y,
      neighbors = [],
      s0 = false,
      d0 = false,
      s1 = false,
      d1 = false,
      s2 = false,
      d2 = false,
      s3 = false,
      d3 = false,
      nodes = this.nodes; // ↑

  if (this.isWalkableAt(x, y - 1)) {
    neighbors.push(nodes[y - 1][x]);
    s0 = true;
  } // →


  if (this.isWalkableAt(x + 1, y)) {
    neighbors.push(nodes[y][x + 1]);
    s1 = true;
  } // ↓


  if (this.isWalkableAt(x, y + 1)) {
    neighbors.push(nodes[y + 1][x]);
    s2 = true;
  } // ←


  if (this.isWalkableAt(x - 1, y)) {
    neighbors.push(nodes[y][x - 1]);
    s3 = true;
  }

  if (diagonalMovement === DiagonalMovement.Never) {
    return neighbors;
  }

  if (diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
    d0 = s3 && s0;
    d1 = s0 && s1;
    d2 = s1 && s2;
    d3 = s2 && s3;
  } else if (diagonalMovement === DiagonalMovement.IfAtMostOneObstacle) {
    d0 = s3 || s0;
    d1 = s0 || s1;
    d2 = s1 || s2;
    d3 = s2 || s3;
  } else if (diagonalMovement === DiagonalMovement.Always) {
    d0 = true;
    d1 = true;
    d2 = true;
    d3 = true;
  } else {
    throw new Error('Incorrect value of diagonalMovement');
  } // ↖


  if (d0 && this.isWalkableAt(x - 1, y - 1)) {
    neighbors.push(nodes[y - 1][x - 1]);
  } // ↗


  if (d1 && this.isWalkableAt(x + 1, y - 1)) {
    neighbors.push(nodes[y - 1][x + 1]);
  } // ↘


  if (d2 && this.isWalkableAt(x + 1, y + 1)) {
    neighbors.push(nodes[y + 1][x + 1]);
  } // ↙


  if (d3 && this.isWalkableAt(x - 1, y + 1)) {
    neighbors.push(nodes[y + 1][x - 1]);
  }

  return neighbors;
};
/**
 * Get a clone of this grid.
 * @return {Grid} Cloned grid.
 */


Grid.prototype.clone = function () {
  var i,
      j,
      width = this.width,
      height = this.height,
      thisNodes = this.nodes,
      newGrid = new Grid(width, height),
      newNodes = new Array(height);

  for (i = 0; i < height; ++i) {
    newNodes[i] = new Array(width);

    for (j = 0; j < width; ++j) {
      newNodes[i][j] = new Node(j, i, thisNodes[i][j].walkable, thisNodes[i][j].weight);
    }
  }

  newGrid.nodes = newNodes;
  return newGrid;
};

module.exports = Grid;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

var AStarFinder = __webpack_require__(6);
/**
 * Best-First-Search path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */


function BestFirstFinder(opt) {
  AStarFinder.call(this, opt);
  var orig = this.heuristic;

  this.heuristic = function (dx, dy) {
    return orig(dx, dy) * 1000000;
  };
}

BestFirstFinder.prototype = new AStarFinder();
BestFirstFinder.prototype.constructor = BestFirstFinder;
module.exports = BestFirstFinder;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(1);

var DiagonalMovement = __webpack_require__(0);
/**
 * Breadth-First-Search path finder.
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */


function BreadthFirstFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.diagonalMovement = opt.diagonalMovement;

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  }
}
/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


BreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var openList = [],
      diagonalMovement = this.diagonalMovement,
      startNode = grid.getNodeAt(startX, startY),
      endNode = grid.getNodeAt(endX, endY),
      neighbors,
      neighbor,
      node,
      i,
      l; // push the start pos into the queue

  openList.push(startNode);
  startNode.opened = true; // while the queue is not empty

  while (openList.length) {
    // take the front node from the queue
    node = openList.shift();
    node.closed = true; // reached the end position

    if (node === endNode) {
      return Util.backtrace(endNode);
    }

    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i]; // skip this neighbor if it has been inspected before

      if (neighbor.closed || neighbor.opened) {
        continue;
      }

      openList.push(neighbor);
      neighbor.opened = true;
      neighbor.parent = node;
    }
  } // fail to find the path


  return [];
};

module.exports = BreadthFirstFinder;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var AStarFinder = __webpack_require__(6);
/**
 * Dijkstra path-finder.
 * @constructor
 * @extends AStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */


function DijkstraFinder(opt) {
  AStarFinder.call(this, opt);

  this.heuristic = function (dx, dy) {
    return 0;
  };
}

DijkstraFinder.prototype = new AStarFinder();
DijkstraFinder.prototype.constructor = DijkstraFinder;
module.exports = DijkstraFinder;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

var BiAStarFinder = __webpack_require__(7);
/**
 * Bi-direcitional Best-First-Search path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 */


function BiBestFirstFinder(opt) {
  BiAStarFinder.call(this, opt);
  var orig = this.heuristic;

  this.heuristic = function (dx, dy) {
    return orig(dx, dy) * 1000000;
  };
}

BiBestFirstFinder.prototype = new BiAStarFinder();
BiBestFirstFinder.prototype.constructor = BiBestFirstFinder;
module.exports = BiBestFirstFinder;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(1);

var DiagonalMovement = __webpack_require__(0);
/**
 * Bi-directional Breadth-First-Search path finder.
 * @constructor
 * @param {object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */


function BiBreadthFirstFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.diagonalMovement = opt.diagonalMovement;

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  }
}
/**
 * Find and return the the path.
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


BiBreadthFirstFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  var startNode = grid.getNodeAt(startX, startY),
      endNode = grid.getNodeAt(endX, endY),
      startOpenList = [],
      endOpenList = [],
      neighbors,
      neighbor,
      node,
      diagonalMovement = this.diagonalMovement,
      BY_START = 0,
      BY_END = 1,
      i,
      l; // push the start and end nodes into the queues

  startOpenList.push(startNode);
  startNode.opened = true;
  startNode.by = BY_START;
  endOpenList.push(endNode);
  endNode.opened = true;
  endNode.by = BY_END; // while both the queues are not empty

  while (startOpenList.length && endOpenList.length) {
    // expand start open list
    node = startOpenList.shift();
    node.closed = true;
    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      if (neighbor.opened) {
        // if this node has been inspected by the reversed search,
        // then a path is found.
        if (neighbor.by === BY_END) {
          return Util.biBacktrace(node, neighbor);
        }

        continue;
      }

      startOpenList.push(neighbor);
      neighbor.parent = node;
      neighbor.opened = true;
      neighbor.by = BY_START;
    } // expand end open list


    node = endOpenList.shift();
    node.closed = true;
    neighbors = grid.getNeighbors(node, diagonalMovement);

    for (i = 0, l = neighbors.length; i < l; ++i) {
      neighbor = neighbors[i];

      if (neighbor.closed) {
        continue;
      }

      if (neighbor.opened) {
        if (neighbor.by === BY_START) {
          return Util.biBacktrace(neighbor, node);
        }

        continue;
      }

      endOpenList.push(neighbor);
      neighbor.parent = node;
      neighbor.opened = true;
      neighbor.by = BY_END;
    }
  } // fail to find the path


  return [];
};

module.exports = BiBreadthFirstFinder;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var BiAStarFinder = __webpack_require__(7);
/**
 * Bi-directional Dijkstra path-finder.
 * @constructor
 * @extends BiAStarFinder
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 */


function BiDijkstraFinder(opt) {
  BiAStarFinder.call(this, opt);

  this.heuristic = function (dx, dy) {
    return 0;
  };
}

BiDijkstraFinder.prototype = new BiAStarFinder();
BiDijkstraFinder.prototype.constructor = BiDijkstraFinder;
module.exports = BiDijkstraFinder;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

var Util = __webpack_require__(1);

var Heuristic = __webpack_require__(2);

var Node = __webpack_require__(5);

var DiagonalMovement = __webpack_require__(0);
/**
 * Iterative Deeping A Star (IDA*) path-finder.
 *
 * Recursion based on:
 *   http://www.apl.jhu.edu/~hall/AI-Programming/IDA-Star.html
 *
 * Path retracing based on:
 *  V. Nageshwara Rao, Vipin Kumar and K. Ramesh
 *  "A Parallel Implementation of Iterative-Deeping-A*", January 1987.
 *  ftp://ftp.cs.utexas.edu/.snapshot/hourly.1/pub/AI-Lab/tech-reports/UT-AI-TR-87-46.pdf
 *
 * @author Gerard Meier (www.gerardmeier.com)
 *
 * @constructor
 * @param {Object} opt
 * @param {boolean} opt.allowDiagonal Whether diagonal movement is allowed.
 *     Deprecated, use diagonalMovement instead.
 * @param {boolean} opt.dontCrossCorners Disallow diagonal movement touching
 *     block corners. Deprecated, use diagonalMovement instead.
 * @param {DiagonalMovement} opt.diagonalMovement Allowed diagonal movement.
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {number} opt.weight Weight to apply to the heuristic to allow for
 *     suboptimal paths, in order to speed up the search.
 * @param {boolean} opt.trackRecursion Whether to track recursion for
 *     statistical purposes.
 * @param {number} opt.timeLimit Maximum execution time. Use <= 0 for infinite.
 */


function IDAStarFinder(opt) {
  opt = opt || {};
  this.allowDiagonal = opt.allowDiagonal;
  this.dontCrossCorners = opt.dontCrossCorners;
  this.diagonalMovement = opt.diagonalMovement;
  this.heuristic = opt.heuristic || Heuristic.manhattan;
  this.weight = opt.weight || 1;
  this.trackRecursion = opt.trackRecursion || false;
  this.timeLimit = opt.timeLimit || Infinity; // Default: no time limit.

  if (!this.diagonalMovement) {
    if (!this.allowDiagonal) {
      this.diagonalMovement = DiagonalMovement.Never;
    } else {
      if (this.dontCrossCorners) {
        this.diagonalMovement = DiagonalMovement.OnlyWhenNoObstacles;
      } else {
        this.diagonalMovement = DiagonalMovement.IfAtMostOneObstacle;
      }
    }
  } // When diagonal movement is allowed the manhattan heuristic is not
  // admissible, it should be octile instead


  if (this.diagonalMovement === DiagonalMovement.Never) {
    this.heuristic = opt.heuristic || Heuristic.manhattan;
  } else {
    this.heuristic = opt.heuristic || Heuristic.octile;
  }
}
/**
 * Find and return the the path. When an empty array is returned, either
 * no path is possible, or the maximum execution time is reached.
 *
 * @return {Array<Array<number>>} The path, including both start and
 *     end positions.
 */


IDAStarFinder.prototype.findPath = function (startX, startY, endX, endY, grid) {
  // Used for statistics:
  var nodesVisited = 0; // Execution time limitation:

  var startTime = new Date().getTime(); // Heuristic helper:

  var h = function (a, b) {
    return this.heuristic(Math.abs(b.x - a.x), Math.abs(b.y - a.y));
  }.bind(this); // Step cost from a to b:


  var cost = function (a, b) {
    return a.x === b.x || a.y === b.y ? 1 : Math.SQRT2;
  };
  /**
   * IDA* search implementation.
   *
   * @param {Node} The node currently expanding from.
   * @param {number} Cost to reach the given node.
   * @param {number} Maximum search depth (cut-off value).
   * @param {Array<Array<number>>} The found route.
   * @param {number} Recursion depth.
   *
   * @return {Object} either a number with the new optimal cut-off depth,
   * or a valid node instance, in which case a path was found.
   */


  var search = function (node, g, cutoff, route, depth) {
    nodesVisited++; // Enforce timelimit:

    if (this.timeLimit > 0 && new Date().getTime() - startTime > this.timeLimit * 1000) {
      // Enforced as "path-not-found".
      return Infinity;
    }

    var f = g + h(node, end) * this.weight; // We've searched too deep for this iteration.

    if (f > cutoff) {
      return f;
    }

    if (node == end) {
      route[depth] = [node.x, node.y];
      return node;
    }

    var min, t, k, neighbour;
    var neighbours = grid.getNeighbors(node, this.diagonalMovement); // Sort the neighbours, gives nicer paths. But, this deviates
    // from the original algorithm - so I left it out.
    //neighbours.sort(function(a, b){
    //    return h(a, end) - h(b, end);
    //});

    /*jshint -W084 */
    //Disable warning: Expected a conditional expression and instead saw an assignment

    for (k = 0, min = Infinity; neighbour = neighbours[k]; ++k) {
      /*jshint +W084 */
      //Enable warning: Expected a conditional expression and instead saw an assignment
      if (this.trackRecursion) {
        // Retain a copy for visualisation. Due to recursion, this
        // node may be part of other paths too.
        neighbour.retainCount = neighbour.retainCount + 1 || 1;

        if (neighbour.tested !== true) {
          neighbour.tested = true;
        }
      }

      t = search(neighbour, g + cost(node, neighbour), cutoff, route, depth + 1);

      if (t instanceof Node) {
        route[depth] = [node.x, node.y]; // For a typical A* linked list, this would work:
        // neighbour.parent = node;

        return t;
      } // Decrement count, then determine whether it's actually closed.


      if (this.trackRecursion && --neighbour.retainCount === 0) {
        neighbour.tested = false;
      }

      if (t < min) {
        min = t;
      }
    }

    return min;
  }.bind(this); // Node instance lookups:


  var start = grid.getNodeAt(startX, startY);
  var end = grid.getNodeAt(endX, endY); // Initial search depth, given the typical heuristic contraints,
  // there should be no cheaper route possible.

  var cutOff = h(start, end);
  var j, route, t; // With an overflow protection.

  for (j = 0; true; ++j) {
    route = []; // Search till cut-off depth:

    t = search(start, 0, cutOff, route, 0); // Route not possible, or not found in time limit.

    if (t === Infinity) {
      return [];
    } // If t is a node, it's also the end node. Route is now
    // populated with a valid path to the end node.


    if (t instanceof Node) {
      return route;
    } // Try again, this time with a deeper cut-off. The t score
    // is the closest we got to the end node.


    cutOff = t;
  } // This _should_ never to be reached.


  return [];
};

module.exports = IDAStarFinder;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author aniero / https://github.com/aniero
 */
var DiagonalMovement = __webpack_require__(0);

var JPFNeverMoveDiagonally = __webpack_require__(29);

var JPFAlwaysMoveDiagonally = __webpack_require__(30);

var JPFMoveDiagonallyIfNoObstacles = __webpack_require__(31);

var JPFMoveDiagonallyIfAtMostOneObstacle = __webpack_require__(32);
/**
 * Path finder using the Jump Point Search algorithm
 * @param {Object} opt
 * @param {function} opt.heuristic Heuristic function to estimate the distance
 *     (defaults to manhattan).
 * @param {DiagonalMovement} opt.diagonalMovement Condition under which diagonal
 *      movement will be allowed.
 */


function JumpPointFinder(opt) {
  opt = opt || {};

  if (opt.diagonalMovement === DiagonalMovement.Never) {
    return new JPFNeverMoveDiagonally(opt);
  } else if (opt.diagonalMovement === DiagonalMovement.Always) {
    return new JPFAlwaysMoveDiagonally(opt);
  } else if (opt.diagonalMovement === DiagonalMovement.OnlyWhenNoObstacles) {
    return new JPFMoveDiagonallyIfNoObstacles(opt);
  } else {
    return new JPFMoveDiagonallyIfAtMostOneObstacle(opt);
  }
}

module.exports = JumpPointFinder;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__(4);

var DiagonalMovement = __webpack_require__(0);
/**
 * Path finder using the Jump Point Search algorithm allowing only horizontal
 * or vertical movements.
 */


function JPFNeverMoveDiagonally(opt) {
  JumpPointFinderBase.call(this, opt);
}

JPFNeverMoveDiagonally.prototype = new JumpPointFinderBase();
JPFNeverMoveDiagonally.prototype.constructor = JPFNeverMoveDiagonally;
/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */

JPFNeverMoveDiagonally.prototype._jump = function (x, y, px, py) {
  var grid = this.grid,
      dx = x - px,
      dy = y - py;

  if (!grid.isWalkableAt(x, y)) {
    return null;
  }

  if (this.trackJumpRecursion === true) {
    grid.getNodeAt(x, y).tested = true;
  }

  if (grid.getNodeAt(x, y) === this.endNode) {
    return [x, y];
  }

  if (dx !== 0) {
    if (grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1) || grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1)) {
      return [x, y];
    }
  } else if (dy !== 0) {
    if (grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy) || grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy)) {
      return [x, y];
    } //When moving vertically, must check for horizontal jump points


    if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
      return [x, y];
    }
  } else {
    throw new Error("Only horizontal and vertical movements are allowed");
  }

  return this._jump(x + dx, y + dy, x, y);
};
/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */


JPFNeverMoveDiagonally.prototype._findNeighbors = function (node) {
  var parent = node.parent,
      x = node.x,
      y = node.y,
      grid = this.grid,
      px,
      py,
      nx,
      ny,
      dx,
      dy,
      neighbors = [],
      neighborNodes,
      neighborNode,
      i,
      l; // directed pruning: can ignore most neighbors, unless forced.

  if (parent) {
    px = parent.x;
    py = parent.y; // get the normalized direction of travel

    dx = (x - px) / Math.max(Math.abs(x - px), 1);
    dy = (y - py) / Math.max(Math.abs(y - py), 1);

    if (dx !== 0) {
      if (grid.isWalkableAt(x, y - 1)) {
        neighbors.push([x, y - 1]);
      }

      if (grid.isWalkableAt(x, y + 1)) {
        neighbors.push([x, y + 1]);
      }

      if (grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y]);
      }
    } else if (dy !== 0) {
      if (grid.isWalkableAt(x - 1, y)) {
        neighbors.push([x - 1, y]);
      }

      if (grid.isWalkableAt(x + 1, y)) {
        neighbors.push([x + 1, y]);
      }

      if (grid.isWalkableAt(x, y + dy)) {
        neighbors.push([x, y + dy]);
      }
    }
  } // return all neighbors
  else {
      neighborNodes = grid.getNeighbors(node, DiagonalMovement.Never);

      for (i = 0, l = neighborNodes.length; i < l; ++i) {
        neighborNode = neighborNodes[i];
        neighbors.push([neighborNode.x, neighborNode.y]);
      }
    }

  return neighbors;
};

module.exports = JPFNeverMoveDiagonally;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__(4);

var DiagonalMovement = __webpack_require__(0);
/**
 * Path finder using the Jump Point Search algorithm which always moves
 * diagonally irrespective of the number of obstacles.
 */


function JPFAlwaysMoveDiagonally(opt) {
  JumpPointFinderBase.call(this, opt);
}

JPFAlwaysMoveDiagonally.prototype = new JumpPointFinderBase();
JPFAlwaysMoveDiagonally.prototype.constructor = JPFAlwaysMoveDiagonally;
/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */

JPFAlwaysMoveDiagonally.prototype._jump = function (x, y, px, py) {
  var grid = this.grid,
      dx = x - px,
      dy = y - py;

  if (!grid.isWalkableAt(x, y)) {
    return null;
  }

  if (this.trackJumpRecursion === true) {
    grid.getNodeAt(x, y).tested = true;
  }

  if (grid.getNodeAt(x, y) === this.endNode) {
    return [x, y];
  } // check for forced neighbors
  // along the diagonal


  if (dx !== 0 && dy !== 0) {
    if (grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y) || grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy)) {
      return [x, y];
    } // when moving diagonally, must check for vertical/horizontal jump points


    if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
      return [x, y];
    }
  } // horizontally/vertically
  else {
      if (dx !== 0) {
        // moving along x
        if (grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1) || grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1)) {
          return [x, y];
        }
      } else {
        if (grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y) || grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y)) {
          return [x, y];
        }
      }
    }

  return this._jump(x + dx, y + dy, x, y);
};
/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */


JPFAlwaysMoveDiagonally.prototype._findNeighbors = function (node) {
  var parent = node.parent,
      x = node.x,
      y = node.y,
      grid = this.grid,
      px,
      py,
      nx,
      ny,
      dx,
      dy,
      neighbors = [],
      neighborNodes,
      neighborNode,
      i,
      l; // directed pruning: can ignore most neighbors, unless forced.

  if (parent) {
    px = parent.x;
    py = parent.y; // get the normalized direction of travel

    dx = (x - px) / Math.max(Math.abs(x - px), 1);
    dy = (y - py) / Math.max(Math.abs(y - py), 1); // search diagonally

    if (dx !== 0 && dy !== 0) {
      if (grid.isWalkableAt(x, y + dy)) {
        neighbors.push([x, y + dy]);
      }

      if (grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y]);
      }

      if (grid.isWalkableAt(x + dx, y + dy)) {
        neighbors.push([x + dx, y + dy]);
      }

      if (!grid.isWalkableAt(x - dx, y)) {
        neighbors.push([x - dx, y + dy]);
      }

      if (!grid.isWalkableAt(x, y - dy)) {
        neighbors.push([x + dx, y - dy]);
      }
    } // search horizontally/vertically
    else {
        if (dx === 0) {
          if (grid.isWalkableAt(x, y + dy)) {
            neighbors.push([x, y + dy]);
          }

          if (!grid.isWalkableAt(x + 1, y)) {
            neighbors.push([x + 1, y + dy]);
          }

          if (!grid.isWalkableAt(x - 1, y)) {
            neighbors.push([x - 1, y + dy]);
          }
        } else {
          if (grid.isWalkableAt(x + dx, y)) {
            neighbors.push([x + dx, y]);
          }

          if (!grid.isWalkableAt(x, y + 1)) {
            neighbors.push([x + dx, y + 1]);
          }

          if (!grid.isWalkableAt(x, y - 1)) {
            neighbors.push([x + dx, y - 1]);
          }
        }
      }
  } // return all neighbors
  else {
      neighborNodes = grid.getNeighbors(node, DiagonalMovement.Always);

      for (i = 0, l = neighborNodes.length; i < l; ++i) {
        neighborNode = neighborNodes[i];
        neighbors.push([neighborNode.x, neighborNode.y]);
      }
    }

  return neighbors;
};

module.exports = JPFAlwaysMoveDiagonally;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__(4);

var DiagonalMovement = __webpack_require__(0);
/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there are no obstacles.
 */


function JPFMoveDiagonallyIfNoObstacles(opt) {
  JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfNoObstacles.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfNoObstacles.prototype.constructor = JPFMoveDiagonallyIfNoObstacles;
/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */

JPFMoveDiagonallyIfNoObstacles.prototype._jump = function (x, y, px, py) {
  var grid = this.grid,
      dx = x - px,
      dy = y - py;

  if (!grid.isWalkableAt(x, y)) {
    return null;
  }

  if (this.trackJumpRecursion === true) {
    grid.getNodeAt(x, y).tested = true;
  }

  if (grid.getNodeAt(x, y) === this.endNode) {
    return [x, y];
  } // check for forced neighbors
  // along the diagonal


  if (dx !== 0 && dy !== 0) {
    // if ((grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y)) ||
    // (grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy))) {
    // return [x, y];
    // }
    // when moving diagonally, must check for vertical/horizontal jump points
    if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
      return [x, y];
    }
  } // horizontally/vertically
  else {
      if (dx !== 0) {
        if (grid.isWalkableAt(x, y - 1) && !grid.isWalkableAt(x - dx, y - 1) || grid.isWalkableAt(x, y + 1) && !grid.isWalkableAt(x - dx, y + 1)) {
          return [x, y];
        }
      } else if (dy !== 0) {
        if (grid.isWalkableAt(x - 1, y) && !grid.isWalkableAt(x - 1, y - dy) || grid.isWalkableAt(x + 1, y) && !grid.isWalkableAt(x + 1, y - dy)) {
          return [x, y];
        } // When moving vertically, must check for horizontal jump points
        // if (this._jump(x + 1, y, x, y) || this._jump(x - 1, y, x, y)) {
        // return [x, y];
        // }

      }
    } // moving diagonally, must make sure one of the vertical/horizontal
  // neighbors is open to allow the path


  if (grid.isWalkableAt(x + dx, y) && grid.isWalkableAt(x, y + dy)) {
    return this._jump(x + dx, y + dy, x, y);
  } else {
    return null;
  }
};
/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */


JPFMoveDiagonallyIfNoObstacles.prototype._findNeighbors = function (node) {
  var parent = node.parent,
      x = node.x,
      y = node.y,
      grid = this.grid,
      px,
      py,
      nx,
      ny,
      dx,
      dy,
      neighbors = [],
      neighborNodes,
      neighborNode,
      i,
      l; // directed pruning: can ignore most neighbors, unless forced.

  if (parent) {
    px = parent.x;
    py = parent.y; // get the normalized direction of travel

    dx = (x - px) / Math.max(Math.abs(x - px), 1);
    dy = (y - py) / Math.max(Math.abs(y - py), 1); // search diagonally

    if (dx !== 0 && dy !== 0) {
      if (grid.isWalkableAt(x, y + dy)) {
        neighbors.push([x, y + dy]);
      }

      if (grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y]);
      }

      if (grid.isWalkableAt(x, y + dy) && grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y + dy]);
      }
    } // search horizontally/vertically
    else {
        var isNextWalkable;

        if (dx !== 0) {
          isNextWalkable = grid.isWalkableAt(x + dx, y);
          var isTopWalkable = grid.isWalkableAt(x, y + 1);
          var isBottomWalkable = grid.isWalkableAt(x, y - 1);

          if (isNextWalkable) {
            neighbors.push([x + dx, y]);

            if (isTopWalkable) {
              neighbors.push([x + dx, y + 1]);
            }

            if (isBottomWalkable) {
              neighbors.push([x + dx, y - 1]);
            }
          }

          if (isTopWalkable) {
            neighbors.push([x, y + 1]);
          }

          if (isBottomWalkable) {
            neighbors.push([x, y - 1]);
          }
        } else if (dy !== 0) {
          isNextWalkable = grid.isWalkableAt(x, y + dy);
          var isRightWalkable = grid.isWalkableAt(x + 1, y);
          var isLeftWalkable = grid.isWalkableAt(x - 1, y);

          if (isNextWalkable) {
            neighbors.push([x, y + dy]);

            if (isRightWalkable) {
              neighbors.push([x + 1, y + dy]);
            }

            if (isLeftWalkable) {
              neighbors.push([x - 1, y + dy]);
            }
          }

          if (isRightWalkable) {
            neighbors.push([x + 1, y]);
          }

          if (isLeftWalkable) {
            neighbors.push([x - 1, y]);
          }
        }
      }
  } // return all neighbors
  else {
      neighborNodes = grid.getNeighbors(node, DiagonalMovement.OnlyWhenNoObstacles);

      for (i = 0, l = neighborNodes.length; i < l; ++i) {
        neighborNode = neighborNodes[i];
        neighbors.push([neighborNode.x, neighborNode.y]);
      }
    }

  return neighbors;
};

module.exports = JPFMoveDiagonallyIfNoObstacles;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * @author imor / https://github.com/imor
 */
var JumpPointFinderBase = __webpack_require__(4);

var DiagonalMovement = __webpack_require__(0);
/**
 * Path finder using the Jump Point Search algorithm which moves
 * diagonally only when there is at most one obstacle.
 */


function JPFMoveDiagonallyIfAtMostOneObstacle(opt) {
  JumpPointFinderBase.call(this, opt);
}

JPFMoveDiagonallyIfAtMostOneObstacle.prototype = new JumpPointFinderBase();
JPFMoveDiagonallyIfAtMostOneObstacle.prototype.constructor = JPFMoveDiagonallyIfAtMostOneObstacle;
/**
 * Search recursively in the direction (parent -> child), stopping only when a
 * jump point is found.
 * @protected
 * @return {Array<Array<number>>} The x, y coordinate of the jump point
 *     found, or null if not found
 */

JPFMoveDiagonallyIfAtMostOneObstacle.prototype._jump = function (x, y, px, py) {
  var grid = this.grid,
      dx = x - px,
      dy = y - py;

  if (!grid.isWalkableAt(x, y)) {
    return null;
  }

  if (this.trackJumpRecursion === true) {
    grid.getNodeAt(x, y).tested = true;
  }

  if (grid.getNodeAt(x, y) === this.endNode) {
    return [x, y];
  } // check for forced neighbors
  // along the diagonal


  if (dx !== 0 && dy !== 0) {
    if (grid.isWalkableAt(x - dx, y + dy) && !grid.isWalkableAt(x - dx, y) || grid.isWalkableAt(x + dx, y - dy) && !grid.isWalkableAt(x, y - dy)) {
      return [x, y];
    } // when moving diagonally, must check for vertical/horizontal jump points


    if (this._jump(x + dx, y, x, y) || this._jump(x, y + dy, x, y)) {
      return [x, y];
    }
  } // horizontally/vertically
  else {
      if (dx !== 0) {
        // moving along x
        if (grid.isWalkableAt(x + dx, y + 1) && !grid.isWalkableAt(x, y + 1) || grid.isWalkableAt(x + dx, y - 1) && !grid.isWalkableAt(x, y - 1)) {
          return [x, y];
        }
      } else {
        if (grid.isWalkableAt(x + 1, y + dy) && !grid.isWalkableAt(x + 1, y) || grid.isWalkableAt(x - 1, y + dy) && !grid.isWalkableAt(x - 1, y)) {
          return [x, y];
        }
      }
    } // moving diagonally, must make sure one of the vertical/horizontal
  // neighbors is open to allow the path


  if (grid.isWalkableAt(x + dx, y) || grid.isWalkableAt(x, y + dy)) {
    return this._jump(x + dx, y + dy, x, y);
  } else {
    return null;
  }
};
/**
 * Find the neighbors for the given node. If the node has a parent,
 * prune the neighbors based on the jump point search algorithm, otherwise
 * return all available neighbors.
 * @return {Array<Array<number>>} The neighbors found.
 */


JPFMoveDiagonallyIfAtMostOneObstacle.prototype._findNeighbors = function (node) {
  var parent = node.parent,
      x = node.x,
      y = node.y,
      grid = this.grid,
      px,
      py,
      nx,
      ny,
      dx,
      dy,
      neighbors = [],
      neighborNodes,
      neighborNode,
      i,
      l; // directed pruning: can ignore most neighbors, unless forced.

  if (parent) {
    px = parent.x;
    py = parent.y; // get the normalized direction of travel

    dx = (x - px) / Math.max(Math.abs(x - px), 1);
    dy = (y - py) / Math.max(Math.abs(y - py), 1); // search diagonally

    if (dx !== 0 && dy !== 0) {
      if (grid.isWalkableAt(x, y + dy)) {
        neighbors.push([x, y + dy]);
      }

      if (grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y]);
      }

      if (grid.isWalkableAt(x, y + dy) || grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y + dy]);
      }

      if (!grid.isWalkableAt(x - dx, y) && grid.isWalkableAt(x, y + dy)) {
        neighbors.push([x - dx, y + dy]);
      }

      if (!grid.isWalkableAt(x, y - dy) && grid.isWalkableAt(x + dx, y)) {
        neighbors.push([x + dx, y - dy]);
      }
    } // search horizontally/vertically
    else {
        if (dx === 0) {
          if (grid.isWalkableAt(x, y + dy)) {
            neighbors.push([x, y + dy]);

            if (!grid.isWalkableAt(x + 1, y)) {
              neighbors.push([x + 1, y + dy]);
            }

            if (!grid.isWalkableAt(x - 1, y)) {
              neighbors.push([x - 1, y + dy]);
            }
          }
        } else {
          if (grid.isWalkableAt(x + dx, y)) {
            neighbors.push([x + dx, y]);

            if (!grid.isWalkableAt(x, y + 1)) {
              neighbors.push([x + dx, y + 1]);
            }

            if (!grid.isWalkableAt(x, y - 1)) {
              neighbors.push([x + dx, y - 1]);
            }
          }
        }
      }
  } // return all neighbors
  else {
      neighborNodes = grid.getNeighbors(node, DiagonalMovement.IfAtMostOneObstacle);

      for (i = 0, l = neighborNodes.length; i < l; ++i) {
        neighborNode = neighborNodes[i];
        neighbors.push([neighborNode.x, neighborNode.y]);
      }
    }

  return neighbors;
};

module.exports = JPFMoveDiagonallyIfAtMostOneObstacle;

/***/ }),
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

// implement soldier routines we want to offload to workers here via onmessage methods
const pathfinder = __webpack_require__(18);

const utils = __webpack_require__(9);

let defaultFinder = new pathfinder.AStarFinder({
  allowDiagonal: true,
  dontCrossCorners: true
});
let gridData = [];
let grid = {};

onmessage = function (e) {
  const data = e.data.context;
  const event = e.data.event;

  switch (event) {
    case 'findPath':
      const localGrid = new pathfinder.Grid(gridData);
      const id = data.id;
      const targetX = utils.pointToGrid(data.to[0]),
            targetY = utils.pointToGrid(data.to[1]);
      postMessage({
        path: defaultFinder.findPath(data.from[0], data.from[1], targetX, targetY, localGrid),
        id
      });
      break;

    case 'setGrid':
      gridData = data.grid;
      grid = new pathfinder.Grid(data.grid);
      break;

    case 'configureFinder':
      defaultFinder = new pathfinder[data.finder]({
        allowDiagonal: data.allowDiagonal,
        dontCrossCorners: data.dontCrossCorners
      });

    default:
      postMessage('Unable to parse the provided event, supported events are \'findPath\' and \'setGrid\' ');
  }
};

/***/ })
/******/ ]);
//# sourceMappingURL=pathfinding.js.map