import CoreInput from "../app/model/CoreInput";
import seqNumGen from "../app/util/sequentialNumberGenerator";

// const coreInputTemplate = coreInput => {
//   return `
//     <div class="halko" data-id="${coreInput.id}">
//         Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
//     coreInput.serialNumber
//   }
//         <label for="question${coreInput.serialNumber}">Question: </label>
//         <input type="text" name="question${
//           coreInput.serialNumber
//         }" placeholder="Enter the question..." value="${coreInput.question}"/>
//     </div>
// `;
// };

export default class Builder {
  constructor() {
    this.name = "builder";
    this.model = {
      coreInputs: []
    };

    window.addEventListener("DOMContentLoaded", e => {
      this.readState();
    });

    // for keeping score of the no of core inputs
    this.nextNumber = seqNumGen();

    // handle adding new core question
    document.querySelector(".app").addEventListener("click", e => {
      const btn = e.target.closest(".btn--add");
      if (btn) {
        console.log(e);
        const serialNumber = this.nextNumber.next().value;
        const newCoreInput = new CoreInput(serialNumber);
        this.model.coreInputs.push(newCoreInput); // WHY THE TRAP IS NOT TRIGGERED!?11? /* 29.07: it is finally being triggered 🤪🙃  */

        const elemele = document.querySelector(`div[data-id="${newCoreInput.id}"] input`);

        console.log(elemele);
        elemele.addEventListener('keyup', (e) => {
          console.log(this);
        });


        this.saveState();
      }

      // const read = e.target.closest(".btn-read");
      // if (read) {
      //   this.readState();
      // }

      // if i wanted to listen for the event in the component, i would have to change the way new coreInputs are stored (or at least seems like a good idea ✌✌):
      // const newCoreInput = new CoreInput();
      // this.model.coreInputs[newCoreInput.id] = newCoreInput;
      //  and this would affect storing to and retrieving model from the localStorage
      // --------------
      // FEW HOURS LATER: giving it another try 🙆‍♀️🙆‍♀️🙆‍♀️
      // const elemele = e.target.closest(`div[data-id="${newCoreInput.id}"] input`);
      // console.log(elemele);
      // if (elemele) {
      //   elemele.value = this.question;
      //   this.question = elemele.value;
      // }
      console.log(this);
      console.log(e);
    });
  }

  coreInputTemplate(coreInput) {
    return `
      <div class="halko" data-id="${coreInput.id}">
          Q: ${coreInput.question} ||  T: ${coreInput.type} ID:${
      coreInput.serialNumber
    }
          <label for="question${coreInput.serialNumber}">Question: </label>
          <input type="text" name="question${
            coreInput.serialNumber
          }" placeholder="Enter the question..." value="${coreInput.question || ''}"/>
      </div>
  `;
  }

  getInputs() {
    const inputsHTML = this.model.coreInputs.reduce(
      (markup, input) => markup + `<li>${this.coreInputTemplate(input)}</li>`,
      ""
    );

    return `<ul>${inputsHTML}</ul>`;
  }

  saveState() {
    localStorage.setItem("form-builder", JSON.stringify(this.model.coreInputs));
  }

  readState() {
    const state = JSON.parse(localStorage.getItem("form-builder"));

    console.log(this.model.coreInputs);

    console.log(state);
    if (state) {
      state.forEach(element => {
        this.model.coreInputs.push(element);
      });

      this.nextNumber = seqNumGen(state.length + 1);
    }
  }

  render(modelParam) {
    return `
        <div class="builder">
            ${this.getInputs()}
        </div>
        <button class="btn--add">&#43;</button>
        <button class="btn-read">read</button>
        `;
  }

  controller(model) {
    // shitload of work to do... (order irrelevant)
    // determine the input being created/changed
    // create a new question based on the data provided ()
    console.log("helo from kontroller");
    this.model.coreInputs = model.coreInputs;
  }
}
