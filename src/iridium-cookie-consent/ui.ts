import { Category, ConsentState } from "./state";
import { logErr, logInfo } from "./logger";

// we require these values in the actual webflow components
const ASK_BANNER = '.ir-notice';
const ASK_BANNER_DECLINE_BUTTON = 'a.ir-notice-decline';
const ASK_BANNER_ACCEPT_BUTTON = '.ir-notice-accept[ir-action="allow"]';
const OPENER = '.ir-manager';
const DETAILS = '.ir-settings';
const CLOSE = '.ir-settings-close';
const OPTION_FIELD = '.ir-option';
const OPTION_CHECKBOX_VISUAL = '.switch-wrap';
const OPTION_TOGGLE_KNUB = '.circle';
const OPTION_CHECKBOX_INPUT = (which: Category) => `[ir-toggle="${which}"]`;
const DISABLE_ALL_BUTTON = 'a.ir-settings-button[ir-action="deny"]';
const ALLOW_ALL_BUTTON = 'a.ir-settings-button[ir-action="allow"]';
const SAVE_SETTINGS_BUTTON = 'a.ir-settings-submit.w-button[ir-action="submit"]';

type UiState = {
  askBanner: HTMLElement;
  askBannerDeclineButton: HTMLElement;
  askBannerAcceptButton: HTMLElement;
  opener: HTMLElement;
  details: HTMLElement;
  close: HTMLElement;
  optionField: (which: Category) => HTMLElement; // 4 exist, first is static `necessary`
  optionToggleVisual: (which: Category) => HTMLElement; // controls appearance
  optionToggleKnub: (which: Category) => HTMLElement; // little toggle knub
  optionCheckboxInput: (which: Category) => HTMLInputElement; // keeps `.value` in state
  disableAllButton: HTMLElement;
  allowAllButton: HTMLElement;
  saveSettingsButton: HTMLElement;
};
// ONLY on DOM-level
export type UiApi = {
  askBanner: {
    show: () => void;
    hide: () => void;
  },
  details: {
    show: () => void;
    hide: () => void;
  },

  check: (which: Category) => void;
  unCheck: (which: Category) => void;

  // save & x actually are just ui, the changes apply directly
  disableAllClickHandler: (callback: () => void) => void;
  acceptAllClickHandler: (callback: () => void) => void;
  onToggles: (callback: ((which: Category) => void)) => void;
};

export const initUi = (
  disableAll: () => void,
  allowAll: () => void,
  onToggle: (which: Category) => boolean,
  initialState: ConsentState,
): void => {
  const state: UiState = {
    askBanner: document.querySelector(ASK_BANNER)!,
    askBannerDeclineButton: document.querySelector(ASK_BANNER_DECLINE_BUTTON)!,
    askBannerAcceptButton: document.querySelector(ASK_BANNER_ACCEPT_BUTTON)!,
    opener: document.querySelector(OPENER)!,
    details: document.querySelector(DETAILS)!,
    close: document.querySelector(CLOSE)!,
    optionField: (which) => {
      const all = document.querySelectorAll(OPTION_FIELD);
      const selector = OPTION_CHECKBOX_INPUT(which);
      for (const candidate of all) {
        const correctCheckbox = candidate.querySelector(selector);
        if (correctCheckbox === null) { continue; }
        return candidate as HTMLElement;
      }

      throw logErr('no candidate matches', which);
    },
    optionToggleVisual: (which) => {
      const all = document.querySelectorAll(OPTION_CHECKBOX_VISUAL);
      const selector = OPTION_CHECKBOX_INPUT(which);
      for (const candidate of all) {
        const root = candidate.parentElement as Element;
        const correctCheckbox = root.querySelector(selector);
        if (correctCheckbox === null) { continue; }
        return candidate as HTMLElement;
      }

      throw logErr('no candidate matches', which);
    },
    optionToggleKnub: (which) => {
      const all = document.querySelectorAll(OPTION_CHECKBOX_VISUAL);
      const selector = OPTION_CHECKBOX_INPUT(which);
      for (const candidate of all) {
        const root = candidate.parentElement as Element;
        const correctCheckbox = root.querySelector(selector);
        if (correctCheckbox === null) { continue; }

        return candidate.querySelector(OPTION_TOGGLE_KNUB) as HTMLElement;
      }

      throw logErr('no candidate matches (knub)', which);
    },
    optionCheckboxInput: (which) => {
      return document.querySelector(OPTION_CHECKBOX_INPUT(which))!;
    },
    disableAllButton: document.querySelector(DISABLE_ALL_BUTTON)!,
    allowAllButton: document.querySelector(ALLOW_ALL_BUTTON)!,
    saveSettingsButton: document.querySelector(SAVE_SETTINGS_BUTTON)!,
  };
  // verify statics
  for (const [key, val] of Object.entries(state)) {
    switch (key) {
      case "optionField":
      case "optionCheckboxVisual":
      case "optionCheckboxInput":
        continue;
      default:
        if (val === null) {
          throw logErr('not found during ui setup', key);
        }
    }
  }



  const askBanner = {
    show: () => {
      logInfo("show ask banner");
      state.askBanner.style.display = 'flex';
      state.opener.style.display = 'none';
    },
    hide: () => {
      logInfo("hide ask banner");
      state.askBanner.style.display = 'none';
      state.opener.style.display = 'flex';
    },
  };
  const details = {
    show: () => {
      logInfo("show details banner");
      state.opener.style.display = 'none';
      state.details.style.display = 'flex';
    },
    hide: () => {
      logInfo("hide details banner");
      state.details.style.display = 'none';
      state.opener.style.display = 'flex';
    },
  };
  const check = (which: Category) => {
    logInfo("ui check", which);
    const input = state.optionCheckboxInput(which);
    const visual = state.optionToggleVisual(which);
    const knub = state.optionToggleKnub(which);

    input.checked = true;
    visual.classList.add('switch-checked');
    knub.classList.add('circle-checked');
    // unknown reason why this is necessary, but otherwise it just doesn't work
    setTimeout(() => {
      input.checked = true;
      visual.classList.add('switch-checked');
      knub.classList.add('circle-checked');
    }, 0);
    logInfo(visual.classList);
  };
  const unCheck = (which: Category) => {
    logInfo("ui uncheck", which);
    const input = state.optionCheckboxInput(which);
    const visual = state.optionToggleVisual(which);
    const knub = state.optionToggleKnub(which);

    input.checked = false;
    visual.classList.remove('switch-checked');
    knub.classList.remove('circle-checked');
    // unknown reason why this is necessary, but otherwise it just doesn't work
    setTimeout(() => {
      input.checked = false;
      visual.classList.remove('switch-checked');
      knub.classList.remove('circle-checked');
    }, 0);
    logInfo(visual.classList);
  };



  logInfo("setting up click listeners");

  // disable all
  for (const decliner of [state.askBannerDeclineButton, state.disableAllButton]) {
    decliner.addEventListener('click', () => {
      logInfo('clicked decliner', decliner);
      disableAll();
      unCheck('component_a');
      unCheck('component_b');
      unCheck('component_c');

      askBanner.hide();
      details.hide();
    });
  }

  // open/close details
  state.opener.addEventListener('click', details.show);
  state.close.addEventListener('click', details.hide);
  state.saveSettingsButton.addEventListener('click', details.hide);

  // accept all
  for (const accepter of [state.askBannerAcceptButton, state.allowAllButton]) {
    accepter.addEventListener('click', () => {
      logInfo('clicked accepter', accepter);
      allowAll();
      check('component_a');
      check('component_b');
      check('component_c');

      askBanner.hide();
      details.hide();
    });
  }

  for (const category of ['component_a', 'component_b', 'component_c'] as const) {
    let debounce = false;
    state.optionCheckboxInput(category).addEventListener('click', () => {
      console.log(JSON.stringify(initialState));
      if (debounce) return;
      debounce = true;

      logInfo('clicked option of', category);

      const newVal = onToggle(category);
      if (newVal) {
        check(category);
      } else {
        unCheck(category);
      }

      setTimeout(() => { debounce = false; }, 50);
    });
  }
  logInfo('listeners fully wired up');

  logInfo('applying initial state to ui');
  // All elements start as display:none
  if (initialState.checked) {
    state.opener.style.display = 'flex';

    for (const category of ['component_a', 'component_b', 'component_c'] as const) {
      const checked = initialState[category];
      if (checked) {
        check(category);
      } else {
        unCheck(category);
      }
    }
  } else {
    state.askBanner.style.display = 'flex';
  }

  console.log(state);

  logInfo('setup routine done');
};
