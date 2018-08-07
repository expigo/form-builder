export function* seqNumGen(startingNumber) {
  let counter = startingNumber || 1;
  while (true) {
    yield counter++;
  }
}

// export const checkIfInput = e =>
//   e.target.tagName.toLowerCase() === "input" ||
//   e.target.tagName.toLowerCase() === "select";

export const checkIfInput = e => {
  return (
    e.target.tagName.toLowerCase() === "input" ||
    e.target.tagName.toLowerCase() === "select"
  );
};

export const getInputValues = ([...nodes]) => {
  // spread syntax is not an operator (it is a part of the array literal and funciton call), hence it does not have a precedence
  // https://stackoverflow.com/questions/44934828/is-foo-an-operator-or-syntax
  const values = nodes.reduce(
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
