import { RuntimeVal } from "./values.js";
import { MK_NULL, MK_BOOL } from "./values.js";

export const setUpScope = (env) => {
  env.declareVar("true", MK_BOOL(true), true);
  env.declareVar("false", MK_BOOL(false), true);
  env.declareVar("null", MK_NULL(), true);
};

export class Environment {
  constructor(parentENV = null) {
    const global = parentENV ? true : false;
    this.parent = parentENV;
    this.variables = new Map();
    this.constants = new Set();
    setUpScope(this);
  }

  declareVar(varname, value, constant) {
    if (this.variables.has(varname)) {
      throw new Error(
        `Cannot declare variable ${varname}. It is already defined.`
      );
    }
    this.variables.set(varname, value);
    if (constant) {
      this.constants.add(varname);
    }
    return value;
  }

  assignVar(varname, value) {
    const env = this.resolve(varname);
    if (env.constants.has(varname)) {
      throw new Error(`${varname} is a const variable, cannot reassign value`);
    }
    env.variables.set(varname, value);
    return value;
  }

  resolve(varname) {
    if (this.variables.has(varname)) {
      return this;
    }
    if (this.parent === null) {
      throw `Cannot resolve '${varname}'. It does not exist.`;
    }
    return this.parent.resolve(varname);
  }

  lookupVar(varname) {
    const env = this.resolve(varname);
    return env.variables.get(varname);
  }
}
