import _ from "lodash";

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
      const btnAdd = e.target.matches(".btn--add");
      if (btnAdd) {
        this.handleAddInput();
        this.persistState();
      }

      const btnRemove = e.target.matches(".btn--remove");
      if (btnRemove) {
        const inputId = e.target.closest("div").dataset.id;
        this.handleRemoveCoreInput(inputId);
      }

      const btnAddSub = e.target.matches(".btn--add-sub");
      if (btnAddSub) {
        const inputId = e.target.closest("div");
        inputId.insertAdjacentHTML("afterend", `<div> haloooooo</div>`);
        this.handleAddSubInput(e);
      }
    });

    // ideas for making this better for UX:
    // - handling two different events separately: one for input (eg. focusout), one for select tag (like input) (caveat: the number of event handlers will grow with the new inputs type) ❌
    // - try different events, and select one that fits the best ❌
    // throttle the function invocation ✔

    const handleInputChange = e => {
      console.log("TRIGGERED 😡😡😡");

      if (checkIfInput(e)) {
        // get the id id of the input to update
        const questionId = e.target.closest("div").dataset.id;

        // const inputToUpdate = this.model.coreInputs.getInputById(questionId);
        // const inputIndex = this.model.coreInputs.state.findIndex(
        //   qta => qta.id === inputToUpdate.id
        // );

        // get the actual input to update along its index in the state
        const { input, index } = this.model.coreInputs.getInputWithIndexById(
          questionId
        );

        // get values from the inputs on the page
        const [updatedInput, updatedType] = getInputValues(
          e.target.parentNode.children
        );

        // assign new values
        input.question = updatedInput;
        input.type = updatedType;

        // update the state
        this.model.coreInputs.state[index] = input;

        this.persistState();

        // you know, just tryin'
        // i guess it would be better to reassign the whole state
        // TODO when i find out why the shallow copy w/ spread operator is not working ✌
        // let actualState = { ...this.model}; //👈👈
      }
    };

    document
      .querySelector(".app")
      .addEventListener("input", _.debounce(handleInputChange, 500));
  }

  coreInputTemplate(coreInput) {
    return `
      <div class="input input--core" data-id="${coreInput.id}">
          <!-- Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
      coreInput.serialNumber
    } -->

    ${coreInput.question} ||  T: ${coreInput.type} ID:${coreInput.serialNumber}
          <label for="question${coreInput.serialNumber}">Question: </label>
          <input autofocus class="input__question" type="text" name="question${
            coreInput.serialNumber
          }" placeholder="Enter the question..." value="${coreInput.question ||
      ""}"/>
          <select class="input__select" name="type${coreInput.serialNumber ||
            ""}">
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
        <button class="btn btn--add-sub">Add Sub-Input</button>
        <button class="btn btn--remove">&times;</button>
      </div>
  `;
  }

  subInputTemplate(subInput) {
    return `
      <div class="input input--sub" >

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

  handleAddInput(inputToAdd = {}) {
    const { question, type, id, serialNumber } = inputToAdd;

    const newCoreInput = this.model.coreInputs.addCoreInput(
      question,
      type,
      id,
      serialNumber
    );
  }

  handleAddSubInput(e) {
    // 1. get parent input
    const parent = e.target.closest("div");
    // 2. if parent != core -> get core
    const coreInput = e.target.closest(".input--core");

    console.log(parent, coreInput);

    // 3. update state
  }

  handleRemoveCoreInput(id) {
    this.model.coreInputs.deleteCoreInput(id);
    this.persistState();
  }

  // a method for persisting the stored data in localStorage
  persistState() {
    console.log("$$setting state");
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
        const newCoreInput = this.handleAddInput(element);
      });

      this.nextSerialNumber = this.model.coreInputs.setNextGenValue(
        this.model.coreInputs.getHighestId() + 1
      );
    }
  }

  // component's view
  render(modelParam) {
    const builderHTML = `
    <div class="builder">
      <div class="builder__inputs">
        ${this.getInputs()}
        </div>
        <button class="btn--add">&#43;</button
    </div>
    `;

    // TODO: focus on the last added element
    // idea:
    // 1. compare the lastly rendered html with the new one (this should result in the newly added div)
    // 2. get the input el from the div obtained above
    // input.focus()

    if (!this.lastResult) {
      console.log("#!");
      this.lastResult = builderHTML;
    }

    // below requires a little work to do
    // TRY:
    //  1. isolate the input--core divs
    // 2. remove duplicates => result should be a newle created div
    // 3. get the input from that div
    // 4. if the above won't work, get saomkind of diff lib or implement the diff alg
    const diffString = builderHTML.replace(this.lastResult, "XDDD");

    this.lastResult = builderHTML;

    return builderHTML;
  }
  // component's controller
  controller(model) {
    // shitload of work to do... (order irrelevant)
    // determine the input being created/changed
    // create a new question based on the data provided ()
    this.model.coreInputs = model.coreInputs;
  }
}
