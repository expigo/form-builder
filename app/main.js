import "./scss/style.scss";
// import { seqNumGen } from './util/sequentialNumberGenerator'

import App from './lib/app';
import Router from './lib/router';

import Builder from '../components/Builder'
import CoreInput from "./model/CoreInput";

// [1, 2, 3].map(el => console.log(el));
const arr = [1, 2, 3];
const iAmJavascriptES6 = () => console.log(...arr);
window.iAmJavascriptES6 = iAmJavascriptES6;

const app = new App('.app');


const router = new Router(app);

// const builderComponent = new Builder();

// app.addComponent(builderComponent);

app.addComponent(new Builder());

router.addRoute('builder', '#/Builder');


// builderComponent.model.coreInputs.push(new CoreInput());



// handling the nav tab switching
function handleClick(e) {
    e.preventDefault();

    // console.log(e.target.innerHTML);
    window.location.hash = `/${e.target.innerHTML.toLowerCase()}`; 
    
    if(!handleClick.lastSelected) {
        handleClick.lastSelected = e.target;
        handleClick.lastSelected.classList.add('active');
        return; 
    }

    if(e.target === handleClick.lastSelected) {
        // e.target.classList.remove('active');
        console.log('GOTYA ALREADY!')
        return; // don't bother yourself anymore
    }

    handleClick.lastSelected.classList.remove('active');
    
    e.target.classList.add('active');

    handleClick.lastSelected = e.target;
    // const activeNow = e.target;
    // console.dir(activeNow);
};


const sections =  document.querySelectorAll('header a');
[...sections].forEach(section => section.addEventListener('click', handleClick));


// window.addEventListener('DOMContentLoaded', function() {
//     window.location.hash = '';
// })


console.log('finito');
