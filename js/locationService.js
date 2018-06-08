const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const randFreeIndexInBoard = board => getRandomIntInclusive(1, board.length - 2)

const randFreeLocationAtBoard = board => ({
    i : randFreeIndexInBoard(board),
    j: randFreeIndexInBoard(board)
})

export const getPacmanStartLocation = board => ({i: board.length - 2, j: parseInt(board.length / 2) })

export const getGhostStartLocation = board => ({i:parseInt(board.length / 2), j: parseInt(board.length / 2) })

export default {
  getRandomIntInclusive,
  randFreeLocationAtBoard, 
  getPacmanStartLocation,
  getGhostStartLocation
}