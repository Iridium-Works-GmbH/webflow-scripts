export const logErr = (
  ...args: any[]
): Error => {
  console.error(
    "iridium-cc cookie consent:",
    ...args,
  );

  const message = args.length === 1
    ? `iridium-cc:${args[0]}`
    : `iridium-cc:${args}`;
  return new Error(message);
};
export const logInfo = (
  ...args: any[]
): void => {
  console.log('iridium-cc', ...args);
};
