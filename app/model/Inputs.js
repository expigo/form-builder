import uuidv1 from 'uuid/v1';
import seqNumGen from '../util/sequentialNumberGenerator'

/**
 * ADT for storing all the inputs
 */
export default class Inputs {
    constructor() {
        this.state = [];
        this.nextSerialNumber = seqNumGen();
    }


    addCoreInput(question, type) {
        const coreInput = {question, type };

        coreInput.id = uuidv1();

        this.setState();

        return coreInput;
    }

    // a method for persisting the stored data in localStorage
    setState() {
        localStorage.setItem('form-builder', JSON.stringify(this.state));
    }

    getState(){
        
    }

}