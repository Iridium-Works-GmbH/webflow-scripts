interface WebflowInterface {
  allowUserTracking(options: { activate: boolean }): void;
  denyUserTracking(): void;
  ready(callback: () => void): void;
}

declare const wf: WebflowInterface;
