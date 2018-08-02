import CoreInput from "../model/CoreInput";

export default class App {
  constructor(selector) {
    this.appLocationElement = document.querySelector(selector);

    this.componentByName = {};

    console.log("App has started...");
  }

  addComponent(component) {

    console.log('>> nah just adding a component');
    this.componentByName[component.name] = component;

    if(component.model.coreInputs){
      component.model.coreInputs = this.proxify(component.model.coreInputs);
    }

    // this.appLocationElement.addEventListener("click", (e) => {
    //   const btn = e.target.closest(".btn");
    //   if (btn) {

    //     component.model.coreInputs.push(new CoreInput()); // WHY THE TRAP IS NOT TRIGGERED!?11? /* 29.07: it finally is triggered 🤪🙃  */
    //     // this.updateView();
    //   }
    // });
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

  proxify(model){
    const self = this;
    return new Proxy(model, {
      set(target, prop, value) {
        console.log(
          `[SET]target: ${JSON.stringify(target)}\n prop: ${prop}\n value:${JSON.stringify(value)}`
        );
        target[prop] = value || [];

        // const val = target[prop];
        // console.log(typeof val);
        // if (typeof val === 'function') {
        //     if (['push', 'unshift'].includes(prop)) {
        //           console.log('pushing ya babe!')
        //     }
        //   }

        self.updateView();
        return true;
      }
      // ,
      //  get(target, prop) {
      //   console.log(
      //     `[GET]target: ${JSON.stringify(target)}\n prop: ${prop}\n`
      //   );
      //  }
    });
  };
}
