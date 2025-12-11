import { logInfo } from "./logger";
import { trackingChoicePrefix, WebflowConsent } from "./webflow";

export type Category = 'marketing' | 'personalized' | 'analytics';

const lsPrefixed = (which: Category): string => {
  return `iridium-cc:${which}`;
};
const readConsent = (
  which: Category,
): null | WebflowConsent => {
  const val = localStorage.getItem(lsPrefixed(which));
  if (val === null) { return null; }

  switch (val) {
    case WebflowConsent.ALLOW:
    case WebflowConsent.DENY:
      return val;
    default: return null;
  }
};

// assumes webflow to _have set_ it to some value already
const setIntellimizeTrackingChoice = (consentChoice: WebflowConsent) => {
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
  const marketing = readConsent('marketing');
  const personalized = readConsent('personalized');
  const analytics = readConsent('analytics');

  const s: ConsentState = {
    checked: !!(marketing || personalized || analytics),
    analytics: !!analytics,
    marketing: !!marketing,
    personalized: !!personalized,
  };
  return s;
};

// stable reference
export const state: ConsentState = initialState();
export type ConsentState = {
  checked: boolean; // whether we know of any existing opt-out (or in)

  marketing: boolean;
  personalized: boolean;
  analytics: boolean;
};
// ALWAYS writes into localstorage, doesn't clear
export const persist = (): void => {
  const keys: Category[] = ['analytics', 'marketing', 'personalized'];
  for (const key of keys) {
    const lsKey = lsPrefixed(key);
    const value = state[key] ? WebflowConsent.ALLOW : WebflowConsent.DENY;
    localStorage.setItem(lsKey, value);
  }

  if (state.analytics) {
    wf.allowUserTracking({ activate: true });
    setIntellimizeTrackingChoice(WebflowConsent.ALLOW);
  } else {
    wf.denyUserTracking();
    purgeIntellimize();
  }
};
