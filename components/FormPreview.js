import _ from "lodash";

export default class FormPreview {
  constructor() {
    this.name = "preview";
    this.state = "";
    // TODO: this.answers; OR implement it with the model, sot it can be controlled by the controller and the app -> callback based render on every input change (similiar to the Builder impl)


    document
    .querySelector(".app")
    .addEventListener("input", _.debounce(this.handleInputChange, 200));


  }

  handleInputChange(e) {
    console.log(e.target);
  }

  parseForm() {



    let form = '';

    if (this.state) {
      this.state.map(core=> form += `${this.coreQuestion(core)}`)
    }

    return 
    ` <div class="form-preview">
          ${form}
        </div>
        `;


  }

  coreQuestion(core) {


    const getSub = function get(core, callback) {

      const conditionMatch = function({}) {
        
      }
  
      core.subInputs &&
        core.subInputs.length > 0 &&
        core.subInputs.map((temp) => {
          if(conditionMatch(core, temp)){
            callback(temp);
          }
          get(temp, callback);
        });
    };

    const subs = '';

    // getSub(core,()=> {

    // });

    const coreFormTemplate = (core) => {

      if(!(core.question && core.type)) return '';
        
       return `
      <div class="form__question form__question--core" data-id="${core.id}">
        <label>${core.question}</label>
        <input type="${core.type}">
      </div>
      `
    };


    return coreFormTemplate(core);
  }



  getState() {
    function parse(str) {
      return _.attempt(JSON.parse.bind(null, str));
    }

    this.state = parse(localStorage.getItem("form-builder"), "hoho");

    if (_.isError(this.state)) {
      this.state = [];
    }
  }

  render() {
    debugger;

    this.getState();

    const html = this.parseForm();


    return { html };
  }
}
