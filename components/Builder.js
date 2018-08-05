import _ from "lodash";

import Inputs from "../app/model/Inputs";
import { checkIfInput, getInputValues } from "../app/util/util";
import { format } from "url";
import { TIMEOUT } from "dns";

export default class Builder {
  constructor() {
    this.name = "builder";
    this.model = {
      coreInputs: new Inputs()
    };

    window.addEventListener("DOMContentLoaded", e => {
      this.getState();
    });
  }

  setState(state) {
    const newState = new Inputs();
    newState.setState(state);
    this.model.coreInputs = newState;
  }

  // a method for retrieving
  getState() {
    const state = JSON.parse(localStorage.getItem("form-builder"));

    if (state) {
      this.setState(state);
    }
  }

  // a method for persisting the stored data in localStorage
  persistState() {
    console.log("$$setting state");
    localStorage.setItem(
      "form-builder",
      JSON.stringify(this.model.coreInputs.state)
    );
  }

  // component's view
  // make it return a promise!
  render(modelParam) {

    // 👇🖖🤘 get it right!
    const getSubInputs = function getSub(parentInput, callback) {
      console.log("^^ getSubInput");
      // callback(parentInput.subInputs);
      // if there are subInputs for parent, get'em all!

      // callback(parentInput.subInputs, callback);
      // parentInput= parentInput.subInputs;

      while (parentInput.subInputs) {
        getSub(parentInput.subInputs, callback);
        parentInput = parentInput.subInputs;
      }

      callback(parentInput);
    };

    const getSub = function get(i, callback) {
      // callback(i);
      // i.subInputs && i.subInputs.length > 0 && get(i.subInputs, callback);
      callback(i);
      i.subInputs && i.subInputs.length > 0 && i.subInputs.map((temp, ii) => {
        temp.id = `${i.id}.${ii + 1}`;
        get(temp, callback);
        // callback(temp);
      })
    }

    const coreInputTemplate = coreInput => {
      console.log(`@@@ ${JSON.stringify(coreInput)}`);
      let subInputs = "";
      debugger;

      // getSubInputs(coreInput, parent => {
      //   const subs = parent.reduce(
      //     (result, sub) => result + `<li>${JSON.stringify(sub)}</li>`,
      //     ""
      //   );

      //   subInputs = `<ul>${subs}</ul>`;

      //   subInputs + parent;
      // });

      coreInput.subInputs.map((si, index) => {
        si.id = index + 1;
        getSub(si, function(temp) {
          subInputs += `<div>${temp.id || 'NI MA'}: ${temp.question}</div>`
        })
      }
    );

      console.log(subInputs);

      return `
        <div class="input input--core" data-id="${coreInput.id}">
            <!-- Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
        coreInput.serialNumber
      } -->
  
      ${coreInput.question} ||  T: ${coreInput.type} ID:${
        coreInput.serialNumber
      }
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
            ${subInputs}
          <button class="btn btn--add-sub">Add Sub-Input</button>
          <button class="btn btn--remove">&times;</button>
  
        </div>
    `;
    };

    const subInputTemplate = subInput => {
      return `
        <div class="input input--sub" >
              ${subInput.question}
        </div>
      `;
    };

    const getCoreInputs = () => {
      const inputsHTML = this.model.coreInputs.state.reduce(
        (markup, input) => markup + `<li>${coreInputTemplate(input)}</li>`,
        ""
      );

      return `<ul>${inputsHTML}</ul>`;
    };

    const builderHTML = `
    <div class="builder">
      <div class="builder__inputs">
        ${getCoreInputs()}
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

    // make the state observable through proxy
    this.model.coreInputs = model.coreInputs;

    const handleRemoveCoreInput = idToDelete => {
      // this.model.coreInputs.deleteCoreInput(id);

      let actualState = this.model.coreInputs.state; //👈👈

      const index = this.model.coreInputs.getIndexById(idToDelete);
      const deletedInput = actualState.splice(index, 1);

      this.setState(actualState);

      this.persistState();
    };

    const handleAddInput = (inputToAdd = {}) => {
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
    };

    const handleAddSubInput = e => {
      // 1. get parent input
      const parent = e.target.closest("div");
      // 2. if parent != core -> get core
      const coreInputId = e.target.closest(".input--core").dataset.id;

      const { coreInput, index } = this.model.coreInputs.addSubInput(
        coreInputId
      );

      // 3. update state
      let actualState = this.model.coreInputs.state;

      actualState[index] = coreInput;

      this.setState(actualState);

      this.persistState();
    };

    /* 🐱‍👤 EVENT HANDLERS 👤 */

    // handle adding new core question with 'add' btn
    document.querySelector(".app").addEventListener("click", e => {
      const btnAdd = e.target.matches(".btn--add");
      if (btnAdd) {
        handleAddInput();
        this.persistState();
      }

      const btnRemove = e.target.matches(".btn--remove");
      if (btnRemove) {
        const inputId = e.target.closest("div").dataset.id;
        handleRemoveCoreInput(inputId);
      }

      const btnAddSub = e.target.matches(".btn--add-sub");
      if (btnAddSub) {
        // const inputId = e.target.closest("div");
        // inputId.insertAdjacentHTML("afterend", `<div> haloooooo</div>`);
        handleAddSubInput(e);
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
        const {
          coreInput,
          index
        } = this.model.coreInputs.getCoreInputWithIndexById(questionId);

        // get values from the inputs on the page
        const [updatedInput, updatedType] = getInputValues(
          e.target.parentNode.children
        );

        // assign new values
        coreInput.question = updatedInput;
        input.type = updatedType;

        // update the state
        actualState[index] = input; // does not trigger a proxy set trap
        // Two versions:
        // 1. setState() commented => no real-time view/state update => data taken from localStorage every time
        // 1. setState() uncommented => real-time view/state update => view rerender every state change
        setState(actualState);

        this.persistState();
      }
    };

    document
      .querySelector(".app")
      .addEventListener("input", _.debounce(handleInputChange, 500));
  }
}
