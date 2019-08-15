class CalcController {
  constructor() {
    this._audio = new Audio("click.mp3");
    this._audioOnOff = false;
    this._lastOperator = "";
    this._lastNumber = "";
    this._operation = [];
    this._locale = "pt-BR";
    this._displayCalcEl = document.querySelector("#display");
    this._displayDateEl = document.querySelector("#data");
    this._displayTimeEl = document.querySelector("#hora");
    this._currentDate;
    this.initialize();
    this.initButtonsEvents();
    this.initKeyboard();
  }

  pasteFromClipboard() {
    document.addEventListener("paste", e => {
      let text = e.clipboardData.getData("Text");
      this.displayCalc = parseFloat(text);
      console.log(text);
    });
  }

  copyToClipBoard() {
    let input = document.createElement("input");
    input.value = this.displayCalc;
    document.body.appendChild(input);

    input.select();
    document.execCommand("Copy");
    input.remove();
  }

  initialize() {
    this.setDisplayTime();

    setInterval(() => {
      this.setDisplayTime();
    }, 1000);
    this.setLastNumberToDisplay();
    this.pasteFromClipboard();

    document.querySelectorAll(".btn-ac").forEach(btn => {
      btn.addEventListener("dblclick", e => {
        this.toogleAudio();
      });
    });
  }

  toogleAudio() {
    // this._audioOnOff = this._audioOnOff ? false : true;
    this._audioOnOff = !this._audioOnOff;
  }

  playAudio() {
    if (this._audioOnOff) {
      this._audio.currentTime = 0;
      this._audio.play();
    }
  }

  initKeyboard() {
    document.addEventListener("keyup", e => {
      this.playAudio();

      switch (e.key) {
        case "Escape":
          this.clearAll();
          break;

        case "Backspace":
          this.cancelEntry();
          break;

        case "+":
        case "-":
        case "/":
        case "*":
        case "%":
          this.addOperation(e.key);
          break;
        case ".":
        case ",":
          this.addDot(".");
          break;

        case "Enter":
        case "=":
          this.calc();
          break;

        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
        case "0":
          this.addOperation(parseInt(e.key));
          break;

        case "c":
          if (e.ctrlKey) this.copyToClipBoard();
          break;
      }
    });
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
    this._lastNumber = "";
    this._lastOperator = "";
    this.setLastNumberToDisplay();
  }

  cancelEntry() {
    this._operation.pop();
    this.setLastNumberToDisplay();
  }

  setError() {
    this.displayCalc = "Error";
  }

  isOperator(value) {
    return ["+", "-", "*", "%", "/"].indexOf(value) > -1;
  }

  setLastOperation(value) {
    this._operation[this._operation.length - 1] = value;
  }

  getLastOperation() {
    return this._operation[this._operation.length - 1];
  }

  pushOperaration(value) {
    this._operation.push(value);

    if (this._operation.length > 3) {
      this.calc();
    }
  }

  getResult() {
    try {
      return eval(this._operation.join(""));
    } catch (error) {
      setTimeout(() => {
        this.setError();
      }, 1);
    }
  }

  calc() {
    let last = "";

    this._lastOperator = this.getLastItem();

    if (this._operation.length < 3) {
      let firstItem = this._operation[0];
      this._operation = [firstItem, this._lastOperator, this._lastNumber];
    }

    if (this._operation.length > 3) {
      last = this._operation.pop();

      this._lastNumber = this.getResult();
    } else if (this._operation.length == 3) {
      this._lastNumber = this.getLastItem(false);
    }

    let result = this.getResult();

    if (last == "%") {
      result /= 100;
      this._operation = [result];
    } else {
      this._operation = [result];

      if (last) this._operation.push(last);
    }
    // this.setLastOperation(last);

    this.setLastNumberToDisplay();
  }

  getLastItem(isOperator = true) {
    let lastItem = "";
    for (let i = this._operation.length - 1; i >= 0; i--) {
      if (this.isOperator(this._operation[i]) == isOperator) {
        lastItem = this._operation[i];
        break;
      }
    }

    if (!lastItem) {
      lastItem = isOperator ? this._lastOperator : this._lastNumber;
    }

    return lastItem;
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);
    if (!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    if (isNaN(this.getLastOperation())) {
      // string

      if (this.isOperator(value)) {
        // troca op
        this.setLastOperation(value);
      } else {
        this.pushOperaration(value);
        this.setLastNumberToDisplay();
      }
    } else if (this.isOperator(value)) {
      // troca op
      this.pushOperaration(value);
    } else {
      const newValue = this.getLastOperation().toString() + value.toString();
      this.setLastOperation(newValue);
      //atualiza display
      this.setLastNumberToDisplay();
    }
  }

  addDot() {
    let lastOperation = this.getLastOperation();
    console.log(lastOperation);
    if (
      (typeof lastOperation === "string" && lastOperation && lastOperation,
      split("").indexOf(".")) > -1
    )
      return;

    if (this.isOperator(lastOperation) || !lastOperation) {
      this.pushOperaration("0.");
    } else {
      this.setLastOperation(lastOperation.toString() + ".");
    }
    this.setLastNumberToDisplay();
  }

  execBtn(value) {
    this.playAudio();

    switch (value) {
      case "ac":
        this.clearAll();
        break;

      case "ce":
        this.cancelEntry();
        break;

      case "soma":
        this.addOperation("+");
        break;

      case "subtracao":
        this.addOperation("-");
        break;

      case "divisao":
        this.addOperation("/");
        break;

      case "multiplicacao":
        this.addOperation("*");
        break;

      case "porcento":
        this.addOperation("%");
        break;
      case "ponto":
        this.addDot(".");
        break;

      case "igual":
        this.calc();
        break;

      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
      case "0":
        this.addOperation(parseInt(value));
        break;

      default:
        this.setError();
        break;
    }
  }

  initButtonsEvents() {
    const buttons = document.querySelectorAll("#buttons > g, #parts > g");

    buttons.forEach((btn, index) => {
      this.addEventListenerAll(btn, "click drag", e => {
        const txtBtn = btn.className.baseVal.replace("btn-", "");
        // this.displayCalc+=(btn.className.baseVal.replace("btn-",""));
        this.execBtn(txtBtn);
      });

      this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
        btn.style.cursor = "pointer";
      });
    });
  }

  get displayCalc() {
    return this._displayCalcEl.innerHTML;
  }

  get displayDate() {
    return this.displayDate.innerHTML;
  }

  get displayTime() {
    return this.displayTime.innerHTML;
  }

  get currentDate() {
    return new Date();
  }

  set displayCalc(value) {
    if (value.toString().length > 8) {
      this.setError();
      return false;
    }

    this._displayCalcEl.innerHTML = value;
  }

  set displayDate(date) {
    this._displayDateEl.innerHTML = date;
  }

  set displayTime(time) {
    this._displayTimeEl.innerHTML = time;
  }

  setDisplayTime() {
    this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
    this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
  }
}
