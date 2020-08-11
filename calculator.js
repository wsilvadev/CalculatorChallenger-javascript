function Calculator() {
  let operations = [];
  let operators = "";
  let firstNumber = "";
  let lastNumber = "";
  let resultValue = [];
  let resultCalc = [];
  let state = [];
  let equals = "";

  function getButtons() {
    let val = document.querySelectorAll("button");

    val.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        let values = e.srcElement.innerHTML;
        saveOperatorations(values);
      });
    });
  }
  function isOperator(value) {
    return ["%", "√", "¹/x", "←", "/", "*", "-", "+"].indexOf(value) > -1;
  }

  function removeAll() {
    operations = [];
    state = [];
    operators = "";
    firstNumber = "";
    lastNumber = "";
  }
  function removeLastOperation() {
    if (operations.length == 3) {
      operations.pop();
      lastNumber = "";
    } else {
      operations = [];
      firstNumber = "";
    }
  }

  function setError(value) {
    setValueInDisplay(value);
  }

  function getResults() {
    if (resultValue.length >= 1) {
      setValueInDisplay(resultValue.slice(resultValue.length - 1));
    } else if (operations.length == 3) {
      setValueInDisplay(lastNumber);
    } else if (operations.length <= 2 && operations.length > 0) {
      setValueInDisplay(firstNumber);
    } else {
      setValueInDisplay("0");
    }
  }
  function calc() {
    if (operations[1] != "%") {
      if (operations.length >= 3 || resultCalc.length >= 3) {
        let calculate =
          resultCalc.length === 3 ? resultCalc.join("") : operations.join("");
        let value = eval(calculate);
        resultCalc = [value, operators, lastNumber];
        if (operations.length == 0) {
          resultCalc[0] = value;
        }
        operations = [];
        if (resultValue != "0") {
          resultValue.push(value);
          operations = resultCalc;
          equals = "=";
          console.log(resultValue);
          console.log(operations);
        } else {
          firstNumber = "";
        }
      } else {
        setError("ERROR");
      }
    } else {
      let result = porcetOfNumber();
      removeAll();
      resultValue = result.toString().slice(0, 9);
      operations[3] = resultValue;
      console.log(resultValue);
    }
  }

  function removeLastNumber() {
    resultValue = [];
    equals = "";
    if (operations.length == 3) {
      lastNumber = lastNumber.slice(0, -1);
      operations[2] = lastNumber;
      if (operations[2] == "") {
        operations.pop();
      }
    } else if (operations.length < 3) {
      firstNumber = firstNumber.slice(0, -1);
      operations[0] = firstNumber;
      state[0] = firstNumber;
      if (operations[0] == "") {
        removeAll();
      }
    }
  }

  function addItems(value) {
    resultCalc = [];
    resultValue = [];
    equals = "";
    if (isOperator(value)) {
      if (operations[0]) {
        lastNumber = "";
        operators = value;
        operations[1] = operators;
        if (operations[2]) {
          calc();
          firstNumber = operations[0].toString();
          equals = "";
          operations.pop();
          resultValue = [];
          operations[1] = value;
        }
      }
    } else {
      if (value == "X" && operations.length != 0) {
        operators = "*";
        operations[1] = operators;
        lastNumber = firstNumber;
        operations[2] = parseFloat(lastNumber);
        state = operations;
        calc();
      } else if (!operations[1]) {
        if (value == ".") {
          state[3] = ["=" + resultCalc[0]];
          firstNumber.indexOf(".") > -1 ? (value = "") : (value = ".");
        }
        firstNumber += value;
        operations[0] = parseFloat(firstNumber);
      } else if (firstNumber != "" && operations[1]) {
        if (value == ".") {
          lastNumber.indexOf(".") > -1 ? (value = "") : (value = ".");
        }
        operations[0] = firstNumber;
        lastNumber += value;
        operations[2] = parseFloat(lastNumber);
      }
    }
  }
  const porcetOfNumber = () => {
    return (parseFloat(firstNumber) / 100) * parseFloat(lastNumber);
  };
  const squareRoot = () => {
    firstNumber = Math.sqrt(parseFloat(firstNumber)).toFixed(2);
    state = [firstNumber, "*", firstNumber, "=", operations[0]];
    operations[0] = firstNumber;
  };
  function saveOperatorations(value) {
    switch (value) {
      case "X":
        addItems("*");
        break;
      case "x²":
        addItems(`X`);
        break;
      case "=":
        calc();
        break;
      case "√":
        squareRoot();
        break;
      case "÷":
        addItems("/");
        break;
      case "±":
        !operations[1] ? addItems("+") : addItems("-");
        break;
      case ",":
        addItems(".");
        break;
      case "CE":
        removeAll();
        break;

      case "C":
        removeLastOperation();
        break;
      case "←":
        removeLastNumber();
        break;

      default:
        addItems(value);
    }
    getResults();
    console.log(operations);
  }
  function setValueInDisplay(value) {
    const display = document.querySelector("#display");
    const story = document.querySelector("#story");
    if (operations.length == 0) {
      display.innerHTML = 0;
    }

    display.innerHTML = value.toString().slice(0, 9);
    if (operations.length <= 3 && resultValue.length <= 1) {
      state = [
        firstNumber,
        operators,
        lastNumber,
        equals,
        resultValue.slice(resultValue.length - 1),
      ];
    } else {
      state = [
        resultValue.slice(resultValue.length - 2, resultValue.length - 1),
        operations[1],
        operations[2],
        equals,
        resultValue.slice(resultValue.length - 1),
      ];
    }
    story.innerHTML = state.join("  ");
  }
  getButtons();
  getResults();
}

Calculator();
