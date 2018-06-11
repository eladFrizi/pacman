const getCellClass = ({ i, j }) => `cell-${i}-${j}`

const getCellHTML = (cell, i, j) => {
  var content = cell.isWall ? '=' : cell.food
  return (
    `<td class="cell-${i}-${j}">
        ${content}
      </td>`
  )
}

const renderBoard = board => {
  const elTbody = document.querySelector('tbody');
  const strHTML = board.map((row, i) =>
    `<tr>
              ${row.map((cell, j) => getCellHTML(cell, i, j)).join('')}
          </tr>`
  ).join('')
  elTbody.innerHTML = strHTML
}

const renderGhosts = ghosts => {
  const elTbody = document.querySelector('tbody');
  ghosts.forEach(g => {
    const cellClass = getCellClass(g)
    const elCell = elTbody.querySelector('.' + cellClass)
    elCell.innerHTML = 'G'
  }
  )

}

const renderPacman = pacman => {
  const elTbody = document.querySelector('tbody');
  const cellClass = getCellClass(pacman)
  const elCell = elTbody.querySelector('.' + cellClass)
  elCell.innerHTML = 'P'
}

const  renderEl = selector => {
  const el = document.querySelector(selector) 
  return (content) => {
      el.innerHTML = content
  }
}
const renderPowerModeSteps = renderEl('.steps')
const renderFoodCount = renderEl('.food-count')



const renderGame = ({ board, ghosts, pacman, powerModeSteps,currFoodCount }) => {
  renderBoard(board)
  renderGhosts(ghosts)
  renderPacman(pacman)
  renderPowerModeSteps(powerModeSteps)
  renderFoodCount(currFoodCount)
}





export default {
  renderBoard,
  renderGhosts,
  renderPacman,
  renderGame
}