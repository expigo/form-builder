import CoreInput from "../model/CoreInput";
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
      component.model.coreInputs.state = this.proxify(
        component.model.coreInputs.state
      );
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
    if (this.currentComponent) {
      this.appLocationElement.innerHTML = this.currentComponent.render(
        this.currentComponent.model
      );
    } else {
      this.appLocationElement.innerHTML = "404";
    }
  }

  proxify(model) {
    const self = this;
    return new Proxy(model, {
      set(target, prop, value) {
        console.log(
          `[SET]target: ${JSON.stringify(
            target
          )}\n prop: ${prop}\n value:${JSON.stringify(value)}`
        );
        target[prop] = value || new Inputs();
        self.updateView();
        return true;
      }
    });
  }
}
