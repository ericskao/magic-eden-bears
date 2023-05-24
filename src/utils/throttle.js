export function throttle(cb, delay = 300) {
  let shouldWait = false;

  return (...args) => {
    if (shouldWait) return;

    cb(...args);
    shouldWait = true;
    setTimeout(() => {
      shouldWait = false;
    }, delay);
  };
}
