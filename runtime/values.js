export const ValueType = ["null", "number", "boolean", "objects"];

export class RuntimeVal {
  constructor(type) {
    this.type = type;
  }
}

export class NullVal extends RuntimeVal {
  constructor() {
    super("null");
    this.value = null;
  }
}

export class NumberVal extends RuntimeVal {
  constructor(value) {
    super("number");
    this.value = value;
  }
}

export class BoolVal extends RuntimeVal {
  constructor(value) {
    super("boolean");
    this.value = value;
  }
}

export const MK_BOOL = (bVal = true) => {
  return new BoolVal(bVal);
};

export const MK_NUMBER = (number = 0) => {
  return new NumberVal(number);
};

export const MK_NULL = () => {
  return new NullVal();
};

export class ObjectVal extends RuntimeVal {
  constructor(value) {
    super("object");
    this.properties = new Map();
  }
}

export class StringVal extends RuntimeVal {
  constructor(value) {
    super("string");
    this.value = value;
  }
}

export const MK_STRING = (value = "") => {
  return new StringVal(value);
};

export class ArrayVal extends RuntimeVal {
  constructor(elements) {
    super("array");
    this.elements = elements || [];
  }
}

export const MK_ARRAY = (elements = []) => {
  return new ArrayVal(elements);
};
