import { logInfo } from "./logger";
import { trackingChoicePrefix, WFC } from "./webflow";

export type Category = 'component_a' | 'component_b' | 'component_c';

const lsPrefixed = (which: Category): string => {
  return `iridium-cc:${which}`;
};
const readConsent = (
  which: Category,
): null | WFC => {
  const val = localStorage.getItem(lsPrefixed(which));
  if (val === null) { return null; }

  switch (val) {
    case WFC.ALLOW:
    case WFC.DENY:
      return val;
    default: return null;
  }
};

// assumes webflow to _have set_ it to some value already
const setIntellimizeTrackingChoice = (consentChoice: WFC) => {
  logInfo('setting tracking choice to', consentChoice);

  const amountItems = localStorage.length;
  for (let i = 0; i < amountItems; i++) {
    const key = localStorage.key(i);
    if (key === null) { continue; }

    if (!key.startsWith(trackingChoicePrefix)) { continue; }

    logInfo('found correct localstorage item');
    localStorage.setItem(key, consentChoice);
    return;
  }
};
const purgeIntellimize = (): void => {
  const amountItems = localStorage.length;
  for (let i = 0; i < amountItems; i++) {
    const key = localStorage.key(i);
    if (key === null) { continue; }

    if (!key.startsWith('intellimize')) { continue; }

    logInfo('purging intellimize localstorage item', key);
    localStorage.removeItem(key);
  }
};



const initialState = (): ConsentState => {
  const component_b = readConsent('component_b');
  const component_c = readConsent('component_c');
  const component_a = readConsent('component_a');

  let checked = true;
  if (component_b === null) {
    checked = false;
  } else if (component_c === null) {
    checked = false;
  } else if (component_a === null) {
    checked = false;
  }

  const s: ConsentState = {
    checked,
    component_a: component_a === WFC.ALLOW,
    component_b: component_b === WFC.ALLOW,
    component_c: component_c === WFC.ALLOW,
  };
  return s;
};

// stable reference
export const state: ConsentState = initialState();
export type ConsentState = {
  checked: boolean;

  component_a: boolean;
  component_b: boolean;
  component_c: boolean;
};
// ALWAYS writes into localstorage, doesn't clear
export const persist = (): void => {
  const keys: Category[] = ['component_a', 'component_b', 'component_c'];
  for (const key of keys) {
    const lsKey = lsPrefixed(key);
    const value = state[key] ? WFC.ALLOW : WFC.DENY;
    localStorage.setItem(lsKey, value);
  }

  if (state.component_a) {
    if (typeof wf !== 'undefined') {
      wf.allowUserTracking({ activate: true });
    }

    setIntellimizeTrackingChoice(WFC.ALLOW);
  } else {
    if (typeof wf !== 'undefined') {
      wf.denyUserTracking();
    }

    purgeIntellimize();
  }
};
