export function isNotEmtpyString(value) {
    // For simplicity
    return typeof value === 'string' && value.length > 0;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
