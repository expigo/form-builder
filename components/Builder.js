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
        debugger;
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
        // copy the actual state of state
        let actualState = this.model.coreInputs.state; //👈👈
 
        // get the id id of the input to updatse
        const questionId = e.target.closest("div").dataset.id;
 
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
        debugger;
        actualState[index] = input;     // does not trigger a proxy set trap
       // Two versions:
       // 1. setState() commented => no real-time view/state update => data taken from localStorage every time
       // 1. setState() uncommented => real-time view/state update => view rerender every state change
        this.setState(actualState);
 
        this.persistState();
      }


    };

    document
      .querySelector(".app")
      .addEventListener("input", _.debounce(handleInputChange, 500));
  }

  coreInputTemplate(coreInput) {
    console.log(`@@@ ${JSON.stringify(coreInput)}`);
    console.log(coreInput.subInputs);
    this.getSubInputs(coreInput.subInputs);

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
            ${subInput.question}
      </div>
    `;
  }

  getCoreInputs() {
    const inputsHTML = this.model.coreInputs.state.reduce(
      (markup, input) => markup + `<li>${this.coreInputTemplate(input)}</li>`,
      ""
    );

    return `<ul>${inputsHTML}</ul>`;
  }

  getSubInputs(parentInput) {
    console.log("here i am");
    // if there are subInputs for parent, get'em all!
    while (parentInput.subInputs) {
      this.getSubInputs(parentInput.subInputs);
    }

    parentInput;
  }

  handleAddInput(inputToAdd = {}) {
    // copy the actual state of state
    let actualState = this.model.coreInputs.state; //👈👈
    // create new core input
    const { question, type, id, serialNumber } = inputToAdd;

    const newCoreInput = this.model.coreInputs.addCoreInput(
      question,
      type,
      id,
      serialNumber
    );

    actualState.push(newCoreInput);

    this.setState(actualState);


  }

  handleAddSubInput(e) {
    // 1. get parent input
    const parent = e.target.closest("div");
    // 2. if parent != core -> get core
    const coreInputId = e.target.closest(".input--core").dataset.id;

    this.model.coreInputs.addSubInput(coreInputId);

    this.persistState();

    // 3. update state
  }

  handleRemoveCoreInput(idToDelete) {
    // this.model.coreInputs.deleteCoreInput(id);

    let actualState = this.model.coreInputs.state; //👈👈

    const index = this.model.coreInputs.getIndexById(idToDelete);
    const deletedInput = actualState.splice(index, 1);

    this.setState(actualState);

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
    debugger;
    const state = JSON.parse(localStorage.getItem("form-builder"));
    console.log(state);

    if (state) {
      // state.forEach(element => {
      //   // const newCoreInput = this.model.coreInputs.addCoreInput(q, t, id, sn);
      //   const newCoreInput = this.handleAddInput(element);
      // });

      // this.nextSerialNumber = this.model.coreInputs.setNextGenValue(
      //   this.model.coreInputs.getHighestId() + 1
      // );

      this.setState(state);
    }
  }

  setState(state) {
    debugger;
    const newState = new Inputs();
    newState.setState(state);
    this.model.coreInputs = newState;
  }

  // component's view
  // make it return a promise!
  render(modelParam) {
    const builderHTML = `
    <div class="builder">
      <div class="builder__inputs">
        ${this.getCoreInputs()}
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
