export const assignKey = (obj, keyCode) => {
  const target = obj;
  target[keyCode] = {
    pressed: true,
    code: keyCode,
  };

  return target;
};

export const removeKey = (obj, keyCode) => {
  const target = obj;
  delete target[keyCode];
  return target;
};

export default {
  assignKey,
  removeKey,
};
