import Inputs from "../model/Inputs";

export default class App {
  constructor(selector) {
    this.appLocationElement = document.querySelector(selector);

    this.componentByName = {};

    console.log("App has started...");
  }

  addComponent(component) {
    console.log(">> nah just adding a component");
    this.componentByName[component.name] = component;

    if (component.model.coreInputs) {
      component.model = this.proxify(component.model);
    }
  }

  renderComponent(name) {
    //   console.table(this.componentByName);
    this.currentComponent = this.componentByName[name];

    if (this.currentComponent) {
      this.currentComponent.controller(this.currentComponent.model);
    }

    this.updateView();
  }

  updateView() {
    console.log("updating view...");
    if (this.currentComponent) {
      const { html, changedInputName } = this.currentComponent.render(
        this.currentComponent.model
      );
      this.appLocationElement.innerHTML = html;

      // focus on the last changed input (if there is one)
      if (changedInputName) {

        // unfortunately there is a quirk: https://stackoverflow.com/questions/511088/use-javascript-to-place-cursor-at-end-of-text-in-text-input-element
        const inputToBeFocusedOn = document.querySelector(
          `input[name="${changedInputName}"]`
        );
        inputToBeFocusedOn.focus();
        const val = inputToBeFocusedOn.value;
        inputToBeFocusedOn.value = '';
        inputToBeFocusedOn.value = val;
      }
    } else {
      this.appLocationElement.innerHTML = "404";
    }
  }

  // to track changes in the state
  // contenteditable on the actual form, changes reflected on the model
  // well, maybe someday... 😁😁
  proxify(model) {
    const self = this;
    return new Proxy(model, {
      set(target, prop, value) {
        // console.log(
        //   `[SET]target: ${JSON.stringify(
        //     target
        //   )}\n prop: ${prop}\n value:${JSON.stringify(value)}`
        // );
        if (prop === "length") {
          console.log(
            `[SET]target: ${JSON.stringify(
              target
            )}\n prop: ${prop}\n value:${JSON.stringify(value)}`
          );
          self.updateView();
          target[prop] = value;
          return true;
        }
        target[prop] = value || new Inputs();
        self.updateView(); // hmm
        return true;
      }
    });
  }
}
