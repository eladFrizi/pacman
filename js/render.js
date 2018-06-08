const getCellClass = ({i,j}) => `cell-${i}-${j}`

const getCellHTML = (cell,i,j) => {
    var content = cell.isWall ? '=' : cell.food
    return (
      `<td class="cell-${i}-${j}">
        ${content}
      </td>`
    )
  }




  const renderBoard = board => {
    const elTbody = document.querySelector('tbody');
    const strHTML = board.map((row,i) =>
          `<tr>
              ${row.map((cell,j) => getCellHTML(cell,i,j)).join('')}
          </tr>`
    ).join('')
    elTbody.innerHTML = strHTML
  }

  const renderGhosts = ghosts => {
    const elTbody = document.querySelector('tbody');
    ghosts.forEach(({i,j, ...ghost}) => {
        const cellClass = getCellClass({i,j})
        const elCell = elTbody.querySelector('.'+cellClass)
        elCell.innerHTML = 'G'
    })
  }

  const renderPacman = ({i,j, ...pacman}) => {
    const elTbody = document.querySelector('tbody');
    const cellClass = getCellClass({i,j})
    const elCell = elTbody.querySelector('.'+cellClass)
    elCell.innerHTML = 'P'
  }

  const renderGame = ({board, ghosts, pacman}) => {
    renderBoard(board)
    renderGhosts(ghosts)
    renderPacman(pacman)
  }

  

  

  export default {
      renderBoard,
      renderGhosts,
      renderPacman,
      renderGame
  }