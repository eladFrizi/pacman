import {
  getPacmanStartLocation,
  getGhostStartLocation
} from "./locationService.js";
import {
  getRandomDirection,
  getDifferentDirection,
  getNextLocation,
  getDirectionForCorner,
  getOppositeDirection
} from './directionService.js';

import render from './render.js'
const {
  pipe
} = R

const SIMPLE_FOOD = '.'
const SUPER_FOOD = '$'

const getGhost = ({ i, j }) => {
  var dir = getRandomDirection()
  return {
    type: 'ghost',
    direction: dir,
    i,
    j
  }
}

const getPacman = ({ i, j }) =>
  ({ type: 'pacman', i, j, direction: 'up' })

const getCell = ({ i, j }) =>
  ({
    isWall: false,
    food: '',
    character: '',
    i,
    j
  })


const getWallCell = ({ i, j }) => {
  const cell = getCell({
    i,
    j
  })
  cell.isWall = true
  return cell
}

const getSimpleFoodCell = ({ i, j }) => {
  const cell = getCell({
    i,
    j
  })
  cell.food = SIMPLE_FOOD
  return cell
}

const getSuperFoodCell = ({ i, j }) => {
  const cell = getCell({
    i,
    j
  })
  cell.food = SUPER_FOOD
  return cell
}

const isWallCord = ({ i, j, size }) =>
  (i === 0 || i === size - 1 || j === 0 || j === size - 1)

const placeSuperFoodAtCorners = (board) => {
  var lastPossibleIdx = board.length - 2
  board[1][1] = getSuperFoodCell({ i: 1, j: 1 })
  board[1][lastPossibleIdx] = getSuperFoodCell({ i: 1, j: lastPossibleIdx })
  board[lastPossibleIdx][1] = getSuperFoodCell({ i: lastPossibleIdx, j: 1 })
  board[lastPossibleIdx][lastPossibleIdx] = getSuperFoodCell({
    i: lastPossibleIdx,
    j: lastPossibleIdx
  })
}



const createBoard = (size) => {
  var board = []
  for (var i = 0; i < size; i++) {
    board[i] = []
    for (var j = 0; j < size; j++) {
      if (isWallCord({ i, j, size })) {
        board[i][j] = getWallCell({ i, j })
      } else {
        board[i][j] = getSimpleFoodCell({ i, j })
      }
    }
  }
  console.log(board)
  board[10][1] = getWallCell({ i, j })
  board[10][19] = getWallCell({ i, j })


  placeSuperFoodAtCorners(board)
  return board
}


const getInitialGhosts = (count, board) => {
  return Array.from({
    length: count
  }, (v, i) => i)
    .map(x => pipe(getGhostStartLocation, getGhost)(board))
}
const getInitialPacman = pipe(getPacmanStartLocation, getPacman)

const initState = x => {
  const board = createBoard(21)
  const ghosts = getInitialGhosts(3, board)
  const pacman = getInitialPacman(board)
  return { board, ghosts, pacman }
}



const isValidCell = ((board, { i, j }) => {
  if (i < 0 || i >= board.length) return false
  if (j < 0 || j >= board[0].length) return false
  return !board[i][j].isWall
})

const moveGhosts = (board, ghosts) => {
  return ghosts.map(g => {
    var newLoc = getNextLocation(g)
    if (isValidCell(board, newLoc)) return { ...g, ...newLoc }
    // debugger
    var newGhost = {
      ...g,
      direction: getDifferentDirection(g.direction)
    }
    var newLoc = getNextLocation(newGhost)
    if (isValidCell(board, newLoc)) return { ...newGhost, ...newLoc }

    var wrongDir = newGhost.direction
    var currDir = g.direction
    var oppositeDir = getOppositeDirection(currDir)
    var newDir = getDirectionForCorner(wrongDir, currDir, oppositeDir)
    var newLoc = getNextLocation({ i: g.i, j: g.j, direction: newDir })
     return { ...newGhost, ...newLoc, direction: newDir}
  })
}

const findGhostInPacmanPlace = ({pacman,ghosts}) => {
  return ghosts.find(g => g.i === pacman.i && g.j === pacman.j)
}

const runGameCycle = () => {
  gState.ghosts = moveGhosts(gState.board, gState.ghosts)
  var ghostInPacman = findGhostInPacmanPlace(gState)
  if (ghostInPacman){
    //TODO: gameover.
  }
  render.renderGame(gState)
}


var gState = initState()
render.renderGame(gState)

// setInterval(runGameCycle, 100)


document.querySelector('.next-cycle').addEventListener('click', x => {
  runGameCycle()
})
document.querySelector('.next-cycle-5').addEventListener('click', x => {
  for (var i = 0; i < 5; i++){
    runGameCycle()
  }
})







// console.log(moveGhosts(gState.ghosts))