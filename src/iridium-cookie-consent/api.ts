import { Category, persist, state } from "./state";

export const allowAll = () => {
  state.checked = true;

  state.analytics = true;
  state.marketing = true;
  state.personalized = true;
  persist();
};

export const denyAll = () => {
  state.checked = true;

  state.analytics = false;
  state.marketing = false;
  state.personalized = false;
  persist();
};

export const toggleCheckbox = (which: Category): boolean => {
  const newVal = !(state[which]);
  state[which] = newVal;
  persist();

  return newVal;
};
