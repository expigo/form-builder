import _ from "lodash";

export default class ExportPreview {
  constructor() {
    this.name = "export";
    this.state = "";

    window.onload = function() {
      document.body.addEventListener("dblclick", function(e) {
        debugger;
        var target = e.target || e.srcElement;
        if (
          target.className.indexOf("highlight") !== -1 ||
          target.parentNode.className.indexOf("highlight") !== -1
        ) {
          var range, selection;

          if (document.body.createTextRange) {
            range = document.body.createTextRange();
            range.moveToElementText(target);
            range.select();
          } else if (window.getSelection) {
            selection = window.getSelection();
            range = document.createRange();
            range.selectNodeContents(target);
            selection.removeAllRanges();
            selection.addRange(range);
          }
          e.stopPropagation();
        }
      });
    };
  }

  getState() {
    function parse(str) {
      return _.attempt(JSON.parse.bind(null, str));
    }

    this.state = parse(localStorage.getItem("form-builder"));

    if (_.isError(this.state)) {
      this.state = [];
    }
  }

  render() {
    this.getState();

    const stateToPrint = JSON.stringify(this.state, undefined, 2);
    const stateHighlighted = stateToPrint.replace(/"question":[\s\S]+?",/gi, '<mark>$&</mark>')

    console.log(stateHighlighted);
    const html = `
        <div class="export">
            <div class="export__info">
              <span>INFO:</span> Double click to select all
            </div>
            <div class="export__code">
                <pre class="highlight">
                  <code>
                      ${stateHighlighted}
                  </code>
                </pre>
                </div>
        </div>

        
        `;

    return { html };
  }
}
