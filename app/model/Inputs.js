import uuidv1 from "uuid/v1";
import { seqNumGen } from "../util/util";

/**
 * ADT for storing all the inputs
 * TODO: _.mapKeys(this.state, 'id')
 */
export default class Inputs {
  constructor() {
    this.state = [];
    this.nextSerialNumber = 1;
  }

  addCoreInput(
    question = "",
    type = "text",
    id = uuidv1(),
    serialNumber = this.nextSerialNumber,
    subInputs = []
  ) {
    const coreInput = { question, type, subInputs };

    coreInput.id = id;
    coreInput.serialNumber = serialNumber;

    return coreInput;
  }

  addSubInput(
    coreId,
    position,
    conditionType = "text",
    conditionAnswear = "",
    question = "",
    type = "",
    subInputs = []
  ) {
    const { coreInput, index } = this.getCoreInputWithIndexById(coreId);

    const objToUpdate = this.constructor.findInputByPosition(
      coreInput,
      position
    );

    objToUpdate.subInputs.push({
      conditionType,
      conditionAnswear,
      question,
      type,
      subInputs
    });

    return {
      coreInput,
      index
    };
  }

  static findInputByPosition(coreInput, position) {
  
    if (position) {
      // TODO: try with monad

      position = position.split(".");

      position.shift(); // get the actual position in the coreInput.subInputs[]

      // console.log(position);
      // console.log(coreInput['subInputs'][0]);
      // console.log(coreInput['subInputs'][0]['subInputs'][0]);

      return position.reduce((ci, key) => ci["subInputs"][key], coreInput);
    }

    return coreInput;
    // return objToUpdate;
  }

  // TODO: make it so it takes an obj with particular properties to update, like
  //   setState({coreInputs})
  //   setState({coreInputs, actualInput })
  setState(newState) {
    this.state = newState;
    this.nextSerialNumber = this.getHighestId() + 1 || 1;
  }

  // set the nex value
  setNextGenValue(nextVal) {
    this.nextSerialNumber = seqNumGen(nextVal);
    // this.nextSerialNumber.next(nextVal);
  }

  getInputById(id) {
    return this.state.find(input => input.id === id);
  }

  getIndexById(id) {
    return this.state.findIndex(qta => qta.id === id);
  }

  getCoreInputWithIndexById(id) {
    return {
      coreInput: this.state.find(input => input.id === id),
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
    if (!this.state.length) return;
    const sortedIds = this.state.map(el => el.serialNumber);

    const max = Math.max(...sortedIds);
    return max;
  }

  updateSub(coreId, position, valuesArr) {
    const coreInput = this.getInputById(coreId);

    const objToUpdate = Inputs.findInputByPosition(coreInput, position);

    objToUpdate.conditionType = valuesArr[0];
    objToUpdate.conditionAnswear = valuesArr[1];
    objToUpdate.question = valuesArr[2];
    objToUpdate.type = valuesArr[3];


    return coreInput;
  }
}
