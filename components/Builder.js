import _ from "lodash";

import Inputs from "../app/model/Inputs";
import {
  checkIfInput,
  getInputValues,
  splitExclusive,
  DOMtraversal
} from "../app/util/util";

export default class Builder {
  constructor() {
    this.name = "builder";
    this.model = {
      coreInputs: new Inputs()
    };

    window.addEventListener("DOMContentLoaded", e => {
      console.log("^^loaded");
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
    // TODO: focus on the last added element
    // idea:
    // 1. compare the lastly rendered html with the new one (this should result in the newly added div)
    // 2. get the input el from the div obtained above
    // input.focus()

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
      i.subInputs &&
        i.subInputs.length > 0 &&
        i.subInputs.map((temp, ii) => {
          temp.serialNumber = `${i.serialNumber}.${ii}`;
          // temp.condType = i.type; TODOOOOO
          get(temp, callback);
          // callback(temp);
        });
    };

    const coreInputTemplate = coreInput => {
      let subInputs = "";

      coreInput.subInputs.map((si, index) => {
        si.serialNumber = `${coreInput.serialNumber}.${index}`;
        getSub(si, function(temp) {
          // subInputs += `<div>${temp.id || "NI MA"}: ${temp.question}</div>`;
          subInputs += subInputTemplate(temp);
        });
      });

      return `
          <div class="input input__core" data-id="${coreInput.id}">
        
        <!--
        Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
        coreInput.serialNumber
      } 

       <br>
  -->


            <div class="input__question input__question--core">
              <input type="text" name="question${coreInput.serialNumber}"          placeholder="Enter the question..." value="${coreInput.question ||
                       ""}" required data-validation-error="*Required">
              <label for="question${coreInput.serialNumber}">Enter the question...</label>
              <span class="input__error" aria-live="polite"></span>
            </div>

            <div class="input__type input__type--core">
              Type: <select name="question${coreInput.serialNumber || ""}" data-val="${
                            coreInput.type
                             }" required>
                      <option value="input" ${
                        coreInput.type === "input" ? "selected" : ""
                      }>Text</option>
                      <option value="radio" ${
                        coreInput.type === "radio" ? "selected" : ""
                      }>Yes/No</option>
                      <option value="number" ${
                        coreInput.type === "number" ? "selected" : ""
                      }>Number</option>
                    </select>
              
            </div>
            
              <button class="btn btn--add-sub" value="Add Sub-Input">Add Sub-Input</button>
              <button class="btn btn--remove">&times;</button>

              <div class="input__subs">
                ${subInputs}
              </div>

  
        </div>

    `;
    };

    const subInputTemplate = subInput => {
      return `
        <div class="input input__sub input__sub-${
          subInput.serialNumber.length
        }" data-serial="${subInput.serialNumber}">


        <!--
        Q: ${subInput.question} ||  T: ${subInput.type} ID:${
        subInput.serialNumber
      } 

      -->


        <div class="input__condition">
        
        Condition
        <select required name="condType${subInput.serialNumber ||
          ""}" data-val="${subInput.conditionType}">
                <option value="input" ${
                  subInput.conditionType === "input" ? "selected" : ""
                }>Text</option>
                <option value="radio" ${
                  subInput.conditionType === "radio" ? "selected" : ""
                }>Yes/No</option>
                <option value="number" ${
                  subInput.conditionType === "number" ? "selected" : ""
                }>Number</option>
              </select>
              <input type="${subInput.conditionType}" name="condType${
        subInput.serialNumber
      }" placeholder="Enter the matching answear..." value="${subInput.conditionAnswear ||
        ""}" required data-validation-error="*Required">
                <label for="condType${subInput.serialNumber}">Match: </label>
          <span class="input__error" aria-live="polite"></span>

        </div>
        
        
        <div class="input__question">
        <input type="text" name="question${
        subInput.serialNumber
      }" placeholder="Enter the question..." value="${subInput.question ||
        ""}" required data-validation-error="*Required">
          <label for="question${subInput.serialNumber}">Question: </label>
          <span class="input__error" aria-live="polite"></span>
        <select required name="question${subInput.serialNumber ||
          ""}" data-val="${subInput.type}">
                <option value="input" ${
                  subInput.type === "input" ? "selected" : ""
                }>Text</option>
                <option value="radio" ${
                  subInput.type === "radio" ? "selected" : ""
                }>Yes/No</option>
                <option value="number" ${
                  subInput.type === "number" ? "selected" : ""
                }>Number</option>
                </select>
                <br>
                
                </div>
                <button class="btn btn--add-sub">Add Sub-Input</button>
                <button class="btn btn--remove-sub">&times;</button>
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

    const coreInputs = getCoreInputs();
    console.log(coreInputs === "<ul></ul>");

    const builderHTML = `
    <div class="builder">
      <div class="builder__inputs ${coreInputs === "<ul></ul>" ? "imOut" : ""}">
        ${coreInputs}
        </div>

          <button class="btn btn--add ${
            coreInputs === "<ul></ul>" ? "btn--end" : ""
          }">
           &#43;
          </button>

    </div>
    `;

    // getting ready for finding the last updated/added input
    // or maybe i should/ve store it in the state xD
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
    // const diffString = builderHTML.replace(this.lastResult, "XDDD");

    // const matchesActual = builderHTML.match(/<input\s+[\S\s]*?\/>/gi);
    // const matchesLast = this.lastResult.match(/<input\s+[\S\s]*?\/>/gi);

    const matchesActual = builderHTML.match(/<(input|select)\s+[\S\s]*?>/gi);
    const matchesLast = this.lastResult.match(/<(input|select)\s+[\S\s]*?>/gi);



    const renderInfo = {
      newCoreAdded: false,
      firstInput: matchesLast === null,
      lastInput: matchesActual === null
    };

    let beforeChangeDiv = "";
    let temp = "";
    let diff = "";

    if (matchesActual && matchesLast) {
      renderInfo.newCoreAdded = matchesActual.length - matchesLast.length === 2; // the difference between number of inputs in coreInput and subInput

      diff = matchesActual.filter(arrEl1 => {
        // check if sub-input from actual state exists in previous state
        const isFound = matchesLast.some((arrEl2, i) => {
          if (arrEl1 === arrEl2) {
            temp = matchesLast[i + 1];
            return true;
          } else {
            return false;
          }
        });

        // if not found -> this is what we're looking for -> save the previous state
        if (!isFound) beforeChangeDiv = temp || matchesLast[0];

        // keep the actual stae
        return !isFound;
      });
    }

    console.log(diff);

    // diff.length === 0 --> sth is missing --> focus on the first el
    if (diff && diff.length) {
      renderInfo.changedInputName = /(?:name=")(.*?)(?:")/gi.exec(
        diff.toString()
      )[1];
    } else {
      //  focus on the first input
      console.log("nah");
    }


    this.lastResult = builderHTML;

    // TODO: keep track of the last position to make the scrolling more smooth

    renderInfo.html = builderHTML;
    return renderInfo;
    // return { html: builderHTML, renderInfo };
  }

  // component's controller
  controller(model) {
    // shitload of work to do... (order irrelevant)
    // determine the input being created/changed
    // create a new question based on the data provided ()

    // make the state observable through proxy
    this.model.coreInputs = model.coreInputs;

    const handleRemoveCoreInput = idToDelete => {
      let actualState = this.model.coreInputs.state.slice(); //👈👈

      // TODO: make it more consistent with the model
      const index = this.model.coreInputs.getIndexById(idToDelete);
      const deletedInput = actualState.splice(index, 1);

      this.setState(actualState);

      this.persistState();
    };

    const handleAddInput = (inputToAdd = {}) => {
      // copy the actual state of state
      let actualState = this.model.coreInputs.state.slice(); //👈👈
      // create new core input
      const { question, type, id, serialNumber } = inputToAdd;

      const newCoreInput = this.model.coreInputs.addCoreInput(
        question,
        type,
        id,
        serialNumber
      );

      this.setState([...actualState, newCoreInput]);
    };

    const handleAddSubInput = e => {
      // 1. get parent input
      const parent = e.target.closest("div");

      // 2. if parent != core -> get core
      const coreInputId = e.target.closest(".input__core");

      /* ----------------- VALIDATION START -------------------*/

      // 1. get inputs to validate (always contained within the first two direct div of the parent div of the subInput to be newly created)
      const inputsToValidate = parent.querySelectorAll(
        ":scope > div:nth-of-type(-n+2)"
      );

      // flag that indicates how the validation went
      let freeToGo = true;

      // 2. validate:
      // for every element to validate
      for (let i of inputsToValidate) {
        // grab all the nested elements
        for (let element of DOMtraversal(i)) {
          // if the element is an input
          if (checkIfInput(element)) {
            // check whether everything is ok
            if (!element.checkValidity()) {
              // if not, don't let them through!
              // element.reportValidity();
              element.classList.add("util-shaky");
              setTimeout(() => {
                element.classList.remove("util-shaky");
              }, 700);
              const msg =
                element.dataset.validationError || "sth bad happened 🙆‍♀️";
              element.nextElementSibling.nextElementSibling.innerHTML = `${msg}`;
              element.nextElementSibling.nextElementSibling.classList.add('util-active-block');
              freeToGo = false;
            }
          }
        }
      }

      if (!freeToGo) return;
      /* ----------------- VALIDATION END -------------------*/

      const { coreInput, index } = this.model.coreInputs.addSubInput(
        coreInputId.dataset.id,
        parent.dataset.serial
      );

      // 3. update state
      let actualState = this.model.coreInputs.state.slice();

      actualState[index] = coreInput;
      this.setState(actualState);

      this.persistState();
    };

    /* 🐱‍👤 EVENT HANDLERS 👤 */

    // handle adding new core question with 'add' btn
    document.querySelector(".app").addEventListener("click", e => {
      // e.preventDefault();
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

      const btnRemoveSub = e.target.matches(".btn--remove-sub");

      if (btnRemoveSub) {
        // 1. the the position of the subinput to delete
        const position = e.target.closest("div").dataset.serial;

        // 2. get its parent position, along with the location within it
        const [parentPosition, indexToDelete] = splitExclusive(position)(
          position.lastIndexOf(".")
        );

        // 3. the the core input to be updated
        const coreInputId = e.target.closest(".input__core").dataset.id;
        const {
          coreInput,
          index
        } = this.model.coreInputs.getCoreInputWithIndexById(coreInputId);

        // 4. get the subToDelete parent to update
        const parentToUpdate = Inputs.findInputByPosition(
          coreInput,
          parentPosition
        );

        // 5. delete the sub basing on the data fetched before
        parentToUpdate.subInputs.splice(indexToDelete, 1);

        // 6. update state
        let actualState = this.model.coreInputs.state.slice();
        actualState[index] = coreInput;
        this.setState(actualState);
        this.persistState();
      }
    });

    const updateCore = (e, input) => {
      // get the actual input to update along its index in the state
      const {
        coreInput,
        index
      } = this.model.coreInputs.getCoreInputWithIndexById(input.dataset.id);

      // get values from the inputs on the page
      const [updatedInput, updatedType] = getInputValues(
        // e.target.parentNode.children
        // e.target.closest('div[data-id]')
        // input
        e.target.parentNode.parentNode.children
      );

      // assign new values
      coreInput.question = updatedInput;
      coreInput.type = updatedType;

      return { coreInput, index };
    };

    const updateSub = (e, subSerialNumber) => {
      const coreInputId = e.target.closest("div[data-id]").dataset.id;

      // get the actual input to update along its index in the state
      const {
        coreInput,
        index
      } = this.model.coreInputs.getCoreInputWithIndexById(coreInputId);

      // get values from the inputs on the page
      // const [condType, condAnswear, updatedInput, updatedType] = getInputValues(
      const [...valuesFromUI] = getInputValues(
        e.target.parentNode.parentNode.children
      );

      // update sub
      const updatedCore = this.model.coreInputs.updateSub(
        coreInputId,
        subSerialNumber,
        valuesFromUI
      );

      return { coreInput, index };
    };

    // ideas for making this better for UX:
    // - handling two different events separately: one for input (eg. focusout), one for select tag (like input) (caveat: the number of event handlers will grow with the new inputs type) ❌
    // - try different events, and select one that fits best ❌
    // throttle the function invocation ✔
    const handleInputChange = e => {
      console.log("TRIGGERED 😡😡😡");

      if (checkIfInput(e.target)) {
        // copy the actual state of state
        let actualState = this.model.coreInputs.state.slice(); //👈👈 is this a shallow copy? is it enough?

        // get the id id of the core input to be updated
        const closestDiv = e.target.closest("div");

        let sliceToUpdate = {};
        debugger;

        // if closestInput el. id attr. exists => coreInput
        // 😑🙄 TODO: i don't like the way it is hardcoded
        if (closestDiv.parentNode.dataset.id) {
          sliceToUpdate = updateCore(e, closestDiv.parentNode);
        } else {
          sliceToUpdate = updateSub(e, closestDiv.parentNode.dataset.serial);
        }

        actualState[sliceToUpdate.index] = sliceToUpdate.coreInput;

        // Two versions:
        // 1. setState() commented => no real-time view/state update => data taken from localStorage every time
        // 1. setState() uncommented => real-time view/state update => view rerender every state change
        this.setState(actualState);
        // TODO: use it to implement controlled input

        this.persistState();
      }
    };

    document
      .querySelector(".app")
      .addEventListener("input", _.debounce(handleInputChange, 200));
  }
}
