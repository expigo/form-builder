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
      ...((value && ["input", "select"].includes(tagName.toLowerCase())) ||
      value === ""
        ? [value]
        : [])
    ],
    []
  );

  return values;
};
