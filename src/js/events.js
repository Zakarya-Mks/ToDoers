export const events = (function () {
  const event = {};

  const on = function (eventName, evHandler) {
    event[eventName] = event[eventName] || [];
    event[eventName].push(evHandler);
  };
  const off = function (eventName, evHandler) {
    if (event[eventName]) {
      event[eventName].filter((fn) => fn != evHandler);
    }
  };
  const publish = function (eventName, data) {
    if (event[eventName]) {
      event[eventName].forEach((fnHandler) => fnHandler(data));
    }
  };

  return {
    on,
    off,
    publish,
  };
})();
