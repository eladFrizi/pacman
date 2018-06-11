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
import * as R from 'ramda';

const SIMPLE_FOOD = '.'
const SUPER_FOOD = '$'

const getGhost = ({ i, j }) => {
    return {
        type: 'ghost',
        direction: getRandomDirection(),
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
        i,
        j
    })

const getWallCell = R.pipe(getCell, R.assoc('isWall', true))
const getSimpleFoodCell = R.pipe(getCell, R.assoc('food', SIMPLE_FOOD))
const getSuperFoodCell = R.pipe(getCell, R.assoc('food', SUPER_FOOD))

const isWallCell = ({ i, j, size }) =>
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
            if (isWallCell({ i, j, size })) {
                board[i][j] = getWallCell({ i, j })
            } else {
                board[i][j] = getSimpleFoodCell({ i, j })
            }
        }
    }
    board[10][1] = getWallCell({ i: 10, j: 1 })
    board[10][19] = getWallCell({ i: 10, j: 19 })
    board[11][11] = getWallCell({ i: 11, j: 11 })


    placeSuperFoodAtCorners(board)
    return board
}


const getInitialGhosts = (count, board) => {
    return Array.from({
        length: count
    }, R.pipe(
        R.partial(getGhostStartLocation, [board]),
        getGhost
    ))
}

const getInitialPacman = R.pipe(getPacmanStartLocation, getPacman)

const countFood = (board) => {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].food) count++
        }
    }
    return count
}

const initState = x => {
    const board = createBoard(21)
    const foodCount = countFood(board)
    const ghosts = getInitialGhosts(3, board)
    const pacman = getInitialPacman(board)
    const isGameOver = false;
    const score = 0;
    const powerModeSteps = 10;
    const deadGhosts = []
    return { board, ghosts, pacman, isGameOver, powerModeSteps, score, deadGhosts, foodCount }
}

const checkIsPowerModeOn = R.pipe(
    R.prop('powerModeSteps'),
    R.partialRight(R.gt, [0]),
)

const isValidCell = ((board, { i, j }) => {
    if (i < 0 || i >= board.length) return false
    if (j < 0 || j >= board[0].length) return false
    return !board[i][j].isWall
})

const moveGhosts = ({ board, ...state }) => {
    const ghosts = state.ghosts.map(g => {
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
        return { ...newGhost, ...newLoc, direction: newDir }
    })
    return { ...state, board, ghosts }
}

const findGhostInPacmanPlace = ({ pacman, ghosts }) => {
    return ghosts.find(g => g.i === pacman.i && g.j === pacman.j)
}

const changePacmanLocation = (state, direction) => {
    state.pacman = { ...state.pacman, direction }
}

const movePacman = (state) => {
    var newLoc = getNextLocation(state.pacman)
    let pacman = (isValidCell(state.board, newLoc))
        ? { ...state.pacman, ...newLoc } : state.pacman
    return { ...state, pacman }
}

const eatFood = ({ score, powerModeSteps, ...state }) => {
    const { i, j } = state.pacman
    const currCell = state.board[i][j]
    if (currCell.food === SIMPLE_FOOD) {
        score += 1
    } else if (currCell.food === SUPER_FOOD) {
        score += 10
        state.powerModeSteps = 50
    }
    currCell.food = ''
    return { score, powerModeSteps, ...state }
}

const killGhost = (ghostInPacman, state) => {
    if (!state.powerModeSteps) return state
    const checkNotEaten = R.pipe(R.equals(ghostInPacman), R.not)
    const liveGhosts = (R.filter(checkNotEaten, state.ghosts))
    const deathCount = state.ghosts.length - liveGhosts.length
    const deadGhosts = R.concat(state.deadGhosts, R.repeat(ghostInPacman, deathCount))
    return { ...state, ghosts: liveGhosts, deadGhosts }
}

const checkEngagement = (state) => {
    var ghostInPacman = findGhostInPacmanPlace(state)
    if (!ghostInPacman) return state

    return R.ifElse(
        checkIsPowerModeOn,
        R.partial(killGhost, [ghostInPacman]),
        R.assoc('isGameOver',true)
    )(state)
}

const decPowerModeSteps = ({ powerModeSteps, ...state }) => {
    powerModeSteps -= 1
    return { ...state, powerModeSteps }
}
const isPowerModeJustFinish = (state) => R.equals(0, state.powerModeSteps)

const revivalGhosts = (state) => {
    return {
        ...state,
        ghosts: [...state.ghosts,
        ...getInitialGhosts(state.deadGhosts.length, state.board)],
        deadGhosts: []
    }
}

const runGameCycle = () => {
    // each function get the state and return new state.
    gState = R.pipe(
        moveGhosts,
        checkEngagement,
        movePacman,
        checkEngagement,
        eatFood,
        decPowerModeSteps,
        R.when(isPowerModeJustFinish, revivalGhosts),
        // R.tap(console.log),
        R.tap(render.renderGame)
    )(gState)
    if (gState.isGameOver){
        clearInterval(gGameInterval)
    }
}


var gState = initState()
render.renderGame(gState)

var  gGameInterval = setInterval(runGameCycle, 100)


document.querySelector('.next-cycle').addEventListener('click', x => {
    runGameCycle()
})
document.querySelector('.next-cycle-5').addEventListener('click', x => {
    runCycles(5);
})

document.querySelector('.next-cycle-100').addEventListener('click', x => {
    runCycles(100);
})
document.querySelector('.next-cycle-50').addEventListener('click', x => {
    runCycles(50);
})


document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case "ArrowLeft":
            changePacmanLocation(gState, 'left')
            break;
        case "ArrowRight":
            changePacmanLocation(gState, 'right')
            break;
        case "ArrowUp":
            changePacmanLocation(gState, 'up')
            break;
        case "ArrowDown":
            changePacmanLocation(gState, 'down')
            break;
    }
})

function runCycles(num) {
    for (var i = 0; i < num; i++) {
        runGameCycle();
    }
}
