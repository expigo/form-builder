export function* seqNumGen(startingNumber) {
  let counter = startingNumber || 1;
  while (true) {
    yield counter++;
  }
}

// export const checkIfInput = e =>
//   e.target.tagName.toLowerCase() === "input" ||
//   e.target.tagName.toLowerCase() === "select";

export const checkIfInput = target => {
  return (
    target.tagName.toLowerCase() === "input" ||
    target.tagName.toLowerCase() === "select"
  );
};

// ??redesign to be able to handle a list of elements ??
export function* DOMtraversal(el) {
  yield el;
  el = el.firstElementChild;
  while (el) {
    yield* DOMtraversal(el);
    el = el.nextElementSibling;
  }
}

export const getInputValues = (nodes) => {
  // spread syntax is not an operator (it is a part of the array literal and funciton call), hence it does not have a precedence
  // https://stackoverflow.com/questions/44934828/is-foo-an-operator-or-syntax

  const temp = [];


  debugger;

  if(nodes.length) {
    for(let i of nodes) {
      for(let element of DOMtraversal(i)) {
        if(checkIfInput(element)) temp.push(element);
      }
    }
  } else {
    for(let element of DOMtraversal(nodes)) {
      if(checkIfInput(element)) temp.push(element);
    }
  }




  console.log(temp);

  const values = temp.reduce(
    (res, { value, tagName }) => [
      ...res,
      // http://www.wolframalpha.com/widget/widgetPopup.jsp?p=v&id=a52797be9f91295a27b14cb751198ae3&title=Boolean%20Algebra%20Calculator&theme=blue&i0=(a%20AND%20b)%20OR%20(b%20AND%20c)&podSelect=
      ...((value || value === "") &&
      ["input", "select"].includes(tagName.toLowerCase())
        ? [value]
        : [])
    ],
    []
  );

  return values;
  // return {
  //   condType: values[0],
  //   condAnswear: values[1],
  //   inputQuestion: values[2],
  //   inputType: values[3],
  // }
};

export const splitExclusive = stringToSplit => index => [
  stringToSplit.slice(0, index),
  stringToSplit.slice(index + 1)
];
