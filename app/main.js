import "./scss/style.scss";
// import { seqNumGen } from './util/sequentialNumberGenerator'

import App from "./lib/app";
import Router from "./lib/router";

import Builder from "../components/Builder";
import FormPreview from "../components/FormPreview";
import ExportView from "../components/ExportView";
import Welcome from "../components/Welcome";

// [1, 2, 3].map(el => console.log(el));
// const arr = [1, 2, 3];
// const iAmJavascriptES6 = () => console.log(...arr);
// window.iAmJavascriptES6 = iAmJavascriptES6;

const app = new App(".app");

const router = new Router(app);


app.addComponent(new Builder());
app.addComponent(new FormPreview());
app.addComponent(new ExportView());
app.addComponent(new Welcome());

router.addRoute("builder", "^#/builder$");
router.addRoute("preview", "^#/preview$");
router.addRoute("export", "^#/export$");
router.addRoute("welcome", "");



// handling the nav tab switching
// TODO: add onload event to handle the case when the page was loaded with specific url (e.g. http://localhost:8080/#/export -> the export link should be active)
function handleClick(e) {
  // e.preventDefault();

  // window.location.hash = `/${e.target.innerHTML.toLowerCase()}`;

  if (!handleClick.lastSelected) {
    handleClick.lastSelected = e.target;
    handleClick.lastSelected.classList.add("active");
    return;
  }

  if (e.target === handleClick.lastSelected) {
    // e.target.classList.remove('active');
    console.log("GOTYA ALREADY!");
    return; // don't bother yourself anymore
  }

  handleClick.lastSelected.classList.remove("active");

  e.target.classList.add("active");

  handleClick.lastSelected = e.target;
}

const sections = document.querySelectorAll("header a");
sections.forEach(section => section.addEventListener("click", handleClick));

// window.addEventListener("DOMContentLoaded", handleClick);

console.log("finito");
