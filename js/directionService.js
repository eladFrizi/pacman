import utils from './utils.js'
// import {getRandomIntInclusive} from './utils.js'

const directions = ['up', 'down', 'left', 'right']

export const getRandomDirection = () =>
    directions[utils.getRandomIntInclusive(0, directions.length - 1)]

export const getNextLocation = ({ i, j, direction }) => {
    switch (direction) {
        case 'up': return { i: i - 1, j }
        case 'down': return { i: i + 1, j }
        case 'left': return { i, j: j - 1 }
        case 'right': return { i, j: j + 1 }
    }
}

export const getDifferentDirection = (currDirection) => {
    const oppositeDir = getOppositeDirection(currDirection)
    const withoutCurr = directions
        .filter(dir => dir !== currDirection && dir !== oppositeDir)
    return withoutCurr[utils.getRandomIntInclusive(0, withoutCurr.length - 1)]
}



export const getDirectionForCorner = (...notValidDirs) => {
    return directions.find(dir => !notValidDirs.includes(dir))
}


export const getOppositeDirection = dir => {
    if (dir === 'up') return 'down'
    if (dir === 'down') return 'up'
    if (dir === 'left') return 'right'
    if (dir === 'right') return 'left'
}

export default {
    directions
}