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

  // set the nex value
  setNextGenValue(nextVal) {
    // this.nextSerialNumber.next(nextVal);
    // this.nextSerialNumber = seqNumGen(nextVal);
    this.nextSerialNumber.next(nextVal);
  }

  getInputById(id) {
    return this.state.find(input => input.id === id);
  }

  getIndexById(id) {
    return this.state.findIndex(qta => qta.id === id);
  }

  getInputWithIndexById(id) {
    return {
      input: this.state.find(input => input.id === id),
      index: this.getIndexById(id)
    };
  }

  deleteCoreInput(idToDelete) {
    const index = this.getIndexById(idToDelete);
    const deletedInput = this.state.splice(index, 1);
    // delete this.state[index];

    return deletedInput;
  }

  getHighestId() {
      const  [sortedIds] = this.state.map(el => el.serialNumber).sort().reverse().slice();  // i suppose it is less performant than providing a comparator, but not much enough to make a significant difference
      // or i could just take the el at last index, but i admire the functional approach 😎😁
    // EDIT: but maybe... https://shamasis.net/2009/09/javascript-string-reversing-algorithm-performance/ 🤷‍♀️ 
      return sortedIds;
  }
}
