class CalcController {
  constructor() {
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
  }

  initialize() {
    this.setDisplayTime();

    setInterval(() => {
      this.setDisplayTime();
    }, 1000);
    this.setLastNumberToDisplay();
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [0];
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
    // console.log('isOpera',['+','-','*', '%','/'].indexOf(value) > -1);
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

      console.log(this._operation);
    }
  }

  getResult() {
    return eval(this._operation.join(""));
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

    console.log("last operator", this._lastOperator);
    console.log("last number", this._lastNumber);

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
    return lastItem;
  }

  setLastNumberToDisplay() {
    let lastNumber = this.getLastItem(false);
    if (!lastNumber) lastNumber = 0;
    this.displayCalc = lastNumber;
  }

  addOperation(value) {
    // console.log("a", value, isNaN(this.getLastOperation()), isNaN(value));

    if (isNaN(this.getLastOperation())) {
      // string

      if (this.isOperator(value)) {
        // troca op
        this.setLastOperation(value);
      } else if (isNaN(value)) {
        // outra coisa
        console.log("outracoisa", value);
      } else {
        // console.log('Primeiro',this._operation);
        this.pushOperaration(value);
        this.setLastNumberToDisplay();
      }
    } else if (this.isOperator(value)) {
      // troca op
      this.pushOperaration(value);
    } else {
      const newValue = this.getLastOperation().toString() + value.toString();
      this.setLastOperation(parseInt(newValue));
      //atualiza display
      this.setLastNumberToDisplay();
    }
  }

  execBtn(value) {
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
        this.addOperation(".");
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

    // console.log(buttons);

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
