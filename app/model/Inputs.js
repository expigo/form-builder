import uuidv1 from "uuid/v1";
import { seqNumGen } from "../util/util";

/**
 * ADT for storing all the inputs
 */
export default class Inputs {
  constructor() {
    this.state = [];
    this.nextSerialNumber = seqNumGen();
  }

  addCoreInput(
    question = "",
    type = "",
    id = uuidv1(),
    serialNumber = this.nextSerialNumber.next().value
  ) {
    const coreInput = { question, type };

    coreInput.id = id;
    coreInput.serialNumber = serialNumber;

    this.state.push(coreInput);

    return coreInput;
  }




  // a method for persisting the stored data in localStorage
  persistState() {
    localStorage.setItem("form-builder", JSON.stringify(this.state));
  }

  getState() {
    const state = JSON.parse(localStorage.getItem("form-builder"));

    console.log(typeof state);
    if (state) {
      console.log("retrieving inputs...");
      state.forEach(element => {
        // done one by one to trigger the proxy trap=>render on page
        this.state.push(element);

        // i suppose inserting to the state should be more consistent, but nah (at least for now, no additional logic is required so i'll leave it like it is)
        // it would be nice if i could add the event listener to the newly cerated input form here (at least from the responsibilty point of view)
        // but i gues it would increase the coupling between classes
        // this.addCoreInput(...element);
      });

      this.nextSerialNumber = seqNumGen(state.length + 1);
    }
  }

  // set the nex value
  setNextGenValue(nextVal) {
    this.nextSerialNumber.next(nextVal);
  }

  getInputById(id) {
    return this.state.find(input => input.id === id);
  }

  getIndexById(id) {
      return this.state.findIndex(qta => qta.id === id)
  }

  getInputWithIndexById(id) {
    return {
        input: this.state.find(input => input.id === id),
        index: this.getIndexById(id)
    };
  }

  
  deleteCoreInput(idToDelete) {
    debugger;
    const index = this.getIndexById(idToDelete);
    this.state.splice(index, 1);
    // delete this.state[index];

    this.persistState();

    // return this.getInputById(idToDelete);
}
}
