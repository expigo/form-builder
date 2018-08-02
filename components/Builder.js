import Inputs from "../app/model/Inputs";
import { checkIfInput, getInputValues } from "../app/util/util";

export default class Builder {
  constructor() {
    this.name = "builder";
    this.model = {
      coreInputs: new Inputs()
    };

    window.addEventListener("DOMContentLoaded", e => {
      this.getState();
    });

    // handle adding new core question with 'add' btn
    document.querySelector(".app").addEventListener("click", e => {
      const btn = e.target.closest(".btn--add");
      if (btn) {
        this.handleAddInput(e);
        this.setState();
      }
    });

    document.querySelector(".app").addEventListener("focusout", e => {
      console.log("TRIGGERED 😡😡😡");

      if (checkIfInput(e)) {
        const questionId = e.target.closest("div").dataset.id;
        console.log(getInputValues(e.target.parentNode.children));

        const questionToUpdate = this.model.coreInputs.getInputById(questionId);
        const questionIndex = this.model.coreInputs.state.findIndex(
          qta => qta.id === questionToUpdate.id
        );

        const [updatedQuestion, updatedType] = getInputValues(
          e.target.parentNode.children
        );

        questionToUpdate.question = updatedQuestion;
        questionToUpdate.type = updatedType;

        this.model.coreInputs.state[questionIndex] = questionToUpdate;

        this.setState();
      }
    });
  }

  coreInputTemplate(coreInput) {
    return `
      <div class="halko" data-id="${coreInput.id}">
          Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
      coreInput.serialNumber
    }
          <label for="question${coreInput.serialNumber}">Question: </label>
          <input required type="text" name="question${
            coreInput.serialNumber
          }" placeholder="Enter the question..." value="${coreInput.question ||
      ""}"/>
          <select name="type${coreInput.serialNumber || ""}">
            <option value="input" ${
              coreInput.type === "input" ? "selected" : ""
            }>Text</option>
            <option value="select" ${
              coreInput.type === "select" ? "selected" : ""
            }>Yes/No</option>
            <option value="number" ${
              coreInput.type === "number" ? "selected" : ""
            }>Number</option>
          </select>
      </div>
  `;
  }

  getInputs() {
    const inputsHTML = this.model.coreInputs.state.reduce(
      (markup, input) => markup + `<li>${this.coreInputTemplate(input)}</li>`,
      ""
    );

    return `<ul>${inputsHTML}</ul>`;
  }

  handleAddInput(e, inputToAdd = {}) {
    // console.log(e);

    const { question, type, id, sn } = inputToAdd;

    const newCoreInput = this.model.coreInputs.addCoreInput(question, type, id, sn);

  }

  // a method for persisting the stored data in localStorage
  setState() {
    localStorage.setItem(
      "form-builder",
      JSON.stringify(this.model.coreInputs.state)
    );
  }

  getState() {
    const state = JSON.parse(localStorage.getItem("form-builder"));

    if (state) {
      state.forEach(element => {
        // const newCoreInput = this.model.coreInputs.addCoreInput(q, t, id, sn);
        const newCoreInput = this.handleAddInput(null, element);
      });

      // this.nextSerialNumber = this.model.coreInputs.setNextGenValue(6634);
    }
  }

  // component's view
  render(modelParam) {
    return `
        <div class="builder">
            ${this.getInputs()}
        </div>
        <button class="btn--add">&#43;</button>
        `;
  }
  // component's controller
  controller(model) {
    // shitload of work to do... (order irrelevant)
    // determine the input being created/changed
    // create a new question based on the data provided ()
    this.model.coreInputs = model.coreInputs;
  }
}
