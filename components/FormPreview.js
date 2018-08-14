import  _  from "lodash";

export default class FormPreview {
  constructor() {
    this.name = "preview";
    this.state = '';

  }

  getState() {
    function parse(str){
        return _.attempt(JSON.parse.bind(null, str));
    }
  
  
      this.state = parse(localStorage.getItem("form-builder"), 'hoho');
  
      if (_.isError(this.state)) {
        this.state = [];
      }
  
}

render() {
    debugger;
    
    this.getState();

    const html =  `
        <div class="preview">
            <div class="big-black-box">
                <h1> Tu bydzie cosik fajnego </h1>
                <pre style="white-space: pre-wrap; word-break: keep-all;">
                <code>
                    ${JSON.stringify(this.state, undefined, 2)}
                </code>
                </pre>
                </div>
        </div>

        
        `;

        return {html};
  }
}
