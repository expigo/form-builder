import seqNumGen from '../util/sequentialNumberGenerator'
import uuidv1 from 'uuid/v1'

export default class Input {
    constructor(serialNumber) {
        this.id = uuidv1();
        this.subInputs = [];
        this.subIdGen = seqNumGen();
        this.question = '';
        this.type = '';
        this.serialNumber = serialNumber;
    }
}

