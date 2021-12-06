// @ts-nocheck
let stop = false;

function getProgram() {
  let Program = document.getElementById("Input").value;
  clearOutput();
  setTimeout(function () {
    update([0], 0, Program, 0);
  }, 0);
  stop = false;
  Run(Program, 0, [0], 0);
}

function Run(Prg, PrgPos, mem, memPos) {
  document.getElementById("RunProg").disabled = true;
  document.getElementById("program").innerHTML = Prg;

  if (Prg.charAt(PrgPos) == "<") {
    memPos -= 1;
    if (memPos < 0) {
      console.log("ERROR: Head moved off tape!");
      memoryUpdate(mem);
      return;
    }
  } else if (Prg.charAt(PrgPos) == ">") {
    memPos += 1;
    if (mem.length <= memPos) {
      mem.push(0);
    }
  } else if (Prg.charAt(PrgPos) == "+") {
    mem[memPos] += 1;

    if (mem[memPos] > 255) {
      mem[memPos] = 0;
    }
  } else if (Prg.charAt(PrgPos) == "-") {
    mem[memPos] -= 1;

    if (mem[memPos] > 255) {
      mem[memPos] = 0;
    }
    if (mem[memPos] < 0) {
      mem[memPos] = 255;
    }
  } else if (Prg.charAt(PrgPos) == ".") {
    const newOutput = mem[memPos];
    setTimeout(function () {
      display(newOutput);
    }, 0);
  } else if (Prg.charAt(PrgPos) == ",") {
    const input = getInput();
    if (isNaN(input)) {
      console.log("ERROR: no valid input! try again");
    } else {
      mem[memPos] = input;
    }
  } else if (Prg.charAt(PrgPos) == "[") {
    if (mem[memPos] == 0) {
      let countOpen = 0;
      PrgPos += 1;

      while (PrgPos < Prg.length) {
        if (Prg.charAt(PrgPos) == "]" && countOpen == 0) {
          break;
        } else if (Prg.charAt(PrgPos) == "[") {
          countOpen += 1;
        } else if (Prg.charAt(PrgPos) == "]") {
          countOpen -= 1;
        }
        PrgPos += 1;
      }
    }
  } else if (Prg.charAt(PrgPos) == "]") {
    if (mem[memPos] != 0) {
      let countClosed = 0;
      PrgPos -= 1;

      while (PrgPos >= 0) {
        if (Prg.charAt(PrgPos) == "[" && countClosed == 0) {
          break;
        } else if (Prg.charAt(PrgPos) == "]") {
          countClosed += 1;
        } else if (Prg.charAt(PrgPos) == "[") {
          countClosed -= 1;
        }
        PrgPos -= 1;
      }
    }
  }

  update(mem, memPos, Prg, PrgPos);
  PrgPos += 1;

  if (PrgPos < Prg.length && !stop) {
    setTimeout(function () {
      Run(Prg, PrgPos, mem, memPos);
    }, 0);
  } else {
    console.log("done");
    document.getElementById("RunProg").disabled = false;
    stop = false;
  }
}

function update(Memory, SelectedCell, Prg, Pos) {
  let list = document.getElementById("memory");

  while (list.hasChildNodes()) {
    list.removeChild(list.firstChild);
  }

  for (let i = 0; i < Memory.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = Memory[i];
    list.appendChild(li);
  }

  let selectedCell = list.childNodes;
  selectedCell[SelectedCell].style.backgroundColor = "yellow";

  document.getElementById("program").innerHTML = placeCursor(Prg, Pos);
  // sleep(10);
}

function placeCursor(Program, Pos) {
  prgStart = Program.slice(0, Pos);
  prgEnd = Program.slice(Pos + 1, Program.length);
  comandSelected = "<span>" + Program[Pos] + "</span>";
  return prgStart + comandSelected + prgEnd;
}

function getInput() {
  let userInput = window.prompt("please enter a valid character.");
  return userInput.charCodeAt(0);
}

function display(val) {
  let output = document.getElementById("Output");
  let x = String.fromCharCode(val);
  output.innerHTML = output.innerHTML + x;
}

function clearOutput() {
  document.getElementById("Output").innerHTML = "";
}

function sleep(miliseconds) {
  var currentTime = new Date().getTime();

  while (currentTime + miliseconds >= new Date().getTime()) {}
}

