import Scroll from "scroll-js";
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

    if (component.model && component.model.coreInputs) {
      component.model = this.proxify(component.model);
    }
  }

  renderComponent(name) {
    //   console.table(this.componentByName);
    this.currentComponent = this.componentByName[name];

    console.log(this.componentByName);
    console.log(this.currentComponent);

    if (this.currentComponent && this.currentComponent.model) {
      this.currentComponent.controller(this.currentComponent.model);
    }

    this.updateView();
  }

  updateView() {
    console.log("updating view...");
    if (this.currentComponent) {
      const {
        html,
        changedInputName,
        newCoreAdded,
        firstInput,
        lastInput
      } = this.currentComponent.render(this.currentComponent.model);
      this.appLocationElement.innerHTML = html;

      // junk START
      const btn = document.querySelector(".btn--add");

      if (btn && !btn.classList.contains("btn--flag")) {
        if (firstInput) {
          btn.classList.add("btn--flag");
          setTimeout(function() {
            btn.classList.remove("btn--start");
          }, 1);
        }
        btn.classList.remove("btn--start");

        if (lastInput) {
          btn.classList.add("btn--start");
          setTimeout(function() {
            btn.classList.add("btn--end");
            btn.classList.remove("btn--start");
          }, 100);
        }
      }

      // junk END

  debugger;

      // focus on the last changed input (if there is one)
      if (changedInputName) {
        // unfortunately there is a quirk: https://stackoverflow.com/questions/511088/use-javascript-to-place-cursor-at-end-of-text-in-text-input-element
        const inputToBeFocusedOn = document.querySelector(
          `[name="${changedInputName}"]`
        );

        // TODO: think of sth else in case when parent.type === 'radio'
        

        ///////////////////////////////////////////
        const builder = document.querySelector(".builder");
        // const scrollEnd =
        // builder.scrollHeight - builder.scrollTop - builder.clientHeight;


        // PROBLEM: after rerender the scrollTop === 0, so all the calcs make no sense
        const scrollEnd = builder.scrollHeight + builder.scrollTop === builder.clientHeight;
        
        console.log(
          builder.scrollHeight,
          builder.scrollTop,
          builder.clientHeight,
          builder.offsetHeight
        );
        
        console.log(scrollEnd);
        ///////////////////////////////////////////
        
        
        if (newCoreAdded && false) {
          var scroll = new Scroll(document.querySelector(".builder"));
          scroll
            .toElement(inputToBeFocusedOn.closest('div[data-id]'), {
              duration: 1000,
              easing: "easeInOutCubic"
            })
            .then(function() {
              // well, scroll is enough
              console.log('scrolled!');
            });
        }

        inputToBeFocusedOn.focus();
        const val = inputToBeFocusedOn.value;
        inputToBeFocusedOn.value = "";
        inputToBeFocusedOn.value = val;
      }
    } else {
      this.appLocationElement.innerHTML = "404";
    }
  }

  // to track changes in the state
  // contenteditable on the actual form, changes reflected on the model (two-way binding)
  // well, maybe someday... 😁😁
  proxify(model) {
    const self = this;
    return new Proxy(model, {
      set(target, prop, value) {

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
