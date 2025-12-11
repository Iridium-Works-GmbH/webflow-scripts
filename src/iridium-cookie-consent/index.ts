import { logInfo } from "./logger";
import { allowAll, denyAll, toggleCheckbox } from "./api";
import { initUi } from "./ui";

// Wait for Webflow Browser APIs to be ready
wf.ready(() => {
  logInfo("Beginning setup");

  initUi(
    denyAll,
    allowAll,
    toggleCheckbox,
  );
});
