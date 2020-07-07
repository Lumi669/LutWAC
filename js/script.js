//var grid = document.getElementById("board");

var rows = document.getElementsByClassName("row");
// console.log('rows[0].children = ', rows[0].children);
// console.log('rows[0].children[0] = ', rows[0].children[0]);

var cols = document.getElementsByClassName("col");
//cellArray contains all the cells of board ( all the td elements of table)
var cellArray = [];

// Add each of col object into cellArray data structure
for (var col of cols) {
  //console.log('col = ', col);
  cellArray.push(col);
}

//mark appears on the cell when it is clicked.
var mark = "";
var count = 1;
var player;
var bgColor;

function play() {
  if (count % 2 === 1) {
    player = 1;
    mark = "x";
    bgColor = "rgb(124, 252, 0)";
  } else if (count % 2 === 0) {
    player = 2;
    mark = "o";
    bgColor = "rgb(250, 128, 114)";
  }
  console.log("count:", count);
}

function addMark(clickedId) {
  //call function play
  play();

  //console.log('now player is:;;;;;;; ', player);
  document.getElementsByTagName("captio")[0].innerHTML =
    "Player " + displayPlayer() + " turn";

  var currentCell = document.getElementById(clickedId);
  if (currentCell.innerHTML !== "") {
    return;
  } else {
    currentCell.innerHTML = mark;
    currentCell.style.backgroundColor = bgColor;

    // console.log("count = ", count);
    // console.log("player = ", player);

    isWin();

    count += 1;
  }
}

// swith player, because it will be called to display next player's turn
function displayPlayer() {
  if (player === 1) {
    player = 2;
  } else if (player === 2) {
    player = 1;
  }
  return player;
}

//bool function isWin to see whether the condition meets win or not
//overall strategy:
// 1. check one individual row, check one individual column
// 2. check if there is one row full filled with same symble in board,
//    check if there is one row full filled with same symble in board.
// 3. check left diagonal, check right diagonal
// 4. check diagonal
// 5. finally the isWin function overall check row, column and diagnal.
function isWin() {
  if (
    hasRowWithSameContents() ||
    hasColumnWithSameContents() ||
    hasDiagonalWithSameContents()
  ) {
    var temp = "Player " + displayPlayer() + " won!";
    setTimeout(function() {
      alert(temp);
    }, 1);
    removeOnclickAttribute();
    return true;
  } else {
    return false;
  }
}

// function dummy() {
//   //do nothing
// }

//bool function to see whether there is one row with all cells filled with 'x' or 'o'
function hasRowWithSameContents() {
  var count = 0;
  for (var row of rows) {
    if (isSameInOneRow(row)) {
      count += 1;
    }
  }
  if (count > 0) {
    return true;
  } else {
    return false;
  }
}

//bool function to see whether there is one column with all cells filled with 'x' or 'o'
function hasColumnWithSameContents() {
  var n = rows[0].children.length;

  var count = 0;
  for (var i = 0; i < n; i++) {
    if (isSameInOneColumn(i)) {
      count += 1;
    }
  }
  if (count > 0) {
    return true;
  } else {
    return false;
  }
}

//bool function to see whether there is diagonal with all cells filled with 'x' or 'o'
function hasDiagonalWithSameContents() {
  if (isSameInLeftDiagonal() || isSameInRightDiagonal()) {
    return true;
  }
  return false;
}

//bool function to check whether the left oriented diagonal with all cells filled with 'x' or 'o'
function isSameInLeftDiagonal() {
  var n = rows.length;
  for (var i = 0; i < n - 1; i++) {
    if (
      !(
        (rows[i].children[4 - i].innerHTML === "x" &&
          rows[i + 1].children[4 - (i + 1)].innerHTML === "x") ||
        (rows[i].children[4 - i].innerHTML === "o" &&
          rows[i + 1].children[4 - (i + 1)].innerHTML === "o")
      )
    ) {
      return false;
    }
  }
  return true;
}

//bool function to check whether the right oriented diagonal with all cells filled with 'x' or 'o'
function isSameInRightDiagonal() {
  var n = rows.length;
  for (var i = 0; i < n - 1; i++) {
    if (
      !(
        (rows[i].children[i].innerHTML === "x" &&
          rows[i + 1].children[i + 1].innerHTML === "x") ||
        (rows[i].children[i].innerHTML === "o" &&
          rows[i + 1].children[i + 1].innerHTML === "o")
      )
    ) {
      return false;
    }
  }
  return true;
}

//bool function to check whether one individual column with all cells filled with 'x' or 'o'
function isSameInOneColumn(j) {
  for (var i = 0; i < rows.length - 1; i++) {
    if (
      !(
        (rows[i].children[j].innerHTML === "x" &&
          rows[i + 1].children[j].innerHTML === "x") ||
        (rows[i].children[j].innerHTML === "o" &&
          rows[i + 1].children[j].innerHTML === "o")
      )
    ) {
      return false;
    }
  }
  return true;
}

//bool function to check whether one individual row with all cells filled with 'x' or 'o'
function isSameInOneRow(row) {
  var cells = row.children;
  for (var i = 0; i < cells.length - 1; i++) {
    if (
      !(
        (cells[i].innerHTML === "x" && cells[i + 1].innerHTML === "x") ||
        (cells[i].innerHTML === "o" && cells[i + 1].innerHTML === "o")
      )
    ) {
      return false;
    }
  }
  return true;
}

//to inactivate the clicking on cells
function removeOnclickAttribute() {
  for (var item of cellArray) {
    item.removeAttribute("onclick");
  }
}

//add every cell an onclick attribute and its value are addMark(this.id and timeLeft()).
for (var item of cellArray) {
  //setAttribute has string of addMark as parameter, this openshift cannot recognise during minization
  //when I deploy my codes during serving the game on my server to people. Therefore, it was changed //
  //to item.onclick
  //item.setAttribute("onclick", "addMark(this.id); timeLeft()");
  item.onclick = function() {
    addMark(this.id);
    timeLeft();
  }
}

//make progress bar dynamic and connect to game
var timeleft;
var timerId = null; // because below will examin timerId, it is good to let it be null for safety

function timeLeft() {
  timeleft = 10;
  var elem = document.getElementById("myBar");
  var width = 10;

  //progress bar filling progress restart
  if (timerId) {
    clearInterval(timerId);
  }

  timerId = setInterval(frame, 1000);
  function frame() {
    if (timeleft < 0) {
      clearInterval(timerId);

      // if runout of time, change player
      count += 1;
    } else {
      elem.style.width = (width - timeleft) * 10 + "%";
      elem.innerHTML = timeleft + " s";
      timeleft -= 1;
    }
  }
}
