/* eslint radix: ["error", "as-needed"] */

class CalcController {
  constructor() {
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
  }

  addEventListenerAll(element, events, fn) {
    events.split(" ").forEach(event => {
      element.addEventListener(event, fn, false);
    });
  }

  clearAll() {
    this._operation = [];
  }

  cancelEntry() {
    this._operation.pop();
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

  pusOperaration(value) {}

  addOperation(value) {
    console.log("a", value, isNaN(this.getLastOperation()), isNaN(value));

    if (isNaN(this.getLastOperation())) {
      // string

      if (this.isOperator(value)) {
        // troca op
        console.log("trocaop", value);
        this.setLastOperation(value);
      } else if (isNaN(value)) {
        // outra coisa
        console.log("outracoisa", value);
        this._operation.push(value);
      } else {
        // console.log('Primeiro',this._operation);
        this._operation.push(value);
      }
    } else if (this.isOperator(value)) {
      // troca op
      this._operation.push(value);
    } else {
      const newValue = this.getLastOperation().toString() + value.toString();
      this.setLastOperation(parseInt(newValue));
    }
    // number
    // console.log(object);
    console.log("lasts", this._operation);
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
        // this.addOperation('=');
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
