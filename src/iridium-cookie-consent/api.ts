import { logInfo } from "./logger";
import { Category, persist, state } from "./state";

export const allowAll = () => {
  state.checked = true;

  state.component_a = true;
  state.component_b = true;
  state.component_c = true;
  persist();
};

export const denyAll = () => {
  state.checked = true;

  state.component_a = false;
  state.component_b = false;
  state.component_c = false;
  persist();
};

export const toggleCheckbox = (which: Category): boolean => {
  const newVal = !(state[which]);
  state[which] = newVal;
  persist();

  logInfo("toggled checkbox", which, newVal);
  return newVal;
};
