import {seqNumGen} from "../util/util";
import Input from "./Input";
import SubInput from "./SubInput";



export default class CoreInput extends Input {
  constructor(serialNumber) {
    super(serialNumber);

    // SHOULD THE COMPONENT DEFINE EVENT LISTENERS OR MODEL, THIS IS A QUESTION!
    // well, it won't work since i lose all the classes instances in the second the data is recreated from localStorage => moving back to Builder component
//     document.querySelector(`.app`).addEventListener("keyup", e => {
//       const elemele = e.target.closest(`div[data-id="${this.id}"] input`);
//       if (elemele) {
//         console.log(elemele);
//         // elemele.value = this.question;
//         this.question = elemele.value;
//       }
//       console.log(this);
//     });
  }

  getTemplate() {
    return `
            <div class="halko" data-id="${this.id}">
                Q: ${this.question} ||  T: ${this.type} ID:${this.serialNumber}
                <label for="question${this.serialNumber}">Question: </label>
                <input type="text" name="question${
                  this.serialNumber
                }" placeholder="Enter the question..." value="${
      this.question
    }"/>
            </div>
        `;
  }

  giveItToMe() {
      console.log('YEEEEA');
  }

  addSubInput() {
    const newSub = new SubInput(this.subIdGen.next().value);
    this.subInputs.push(newSub);
  }
}
