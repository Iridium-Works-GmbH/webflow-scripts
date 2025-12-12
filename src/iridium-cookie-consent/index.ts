import { logErr, logInfo } from "./logger";
import { allowAll, denyAll, toggleCheckbox } from "./api";
import { initUi } from "./ui";
import { sleep } from "./sleep";

const init = async (withWf: boolean): Promise<void> => {
  if (withWf) {
    logInfo("Beginning setup with `wf`");
  } else {
    logInfo("Beginning setup without `wf`");
  }

  let failed = true;
  let backoff = 5; // milliseconds
  const delay = () => {
    backoff = Math.ceil(backoff * 1.2);
  };

  // browser dom race condition maybe?
  while (failed) {
    logInfo("another trial for setup");
    try {
      initUi(
        denyAll,
        allowAll,
        toggleCheckbox,
      );
      failed = false;
    } catch (e) {
      delay();
      await sleep(backoff);
      logErr("ran into problem during setup, trying again in", backoff);
      failed = true;
    }
  }
};

if (typeof wf === 'undefined') {
  init(false);
} else {
  // webflow browser api only defined with tracking settings in wf backend
  // allegedly
  wf.ready(() => {
    init(true);
  });
}
