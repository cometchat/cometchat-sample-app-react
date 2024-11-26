var WORKER_ENABLED;

if (!window.global) {
  window.global = window;
  WORKER_ENABLED = !!(
    global === global.window &&
    global.URL &&
    global.Blob &&
    global.Worker
  );
}else{
  WORKER_ENABLED = !!(
    global === global.window &&
    global.URL &&
    global.Blob &&
    global.Worker
  );
}

function InlineWorker(func, self) {
  var _this = this;
  var functionBody;

  self = self || {};

  if (WORKER_ENABLED) {
    functionBody = func
      .toString()
      .trim()
      .match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];

    return new global.Worker(
      global.URL.createObjectURL(
        new global.Blob([functionBody], { type: "text/javascript" })
      )
    );
  }

  function postMessage(data) {
    setTimeout(function () {
      _this.onmessage({ data: data });
    }, 0);
  }

  this.self = self;
  this.self.postMessage = postMessage;

  setTimeout(func.bind(self, self), 0);
}

InlineWorker.prototype.postMessage = function postMessage(data) {
  var _this = this;

  setTimeout(function () {
    _this.self.onmessage({ data: data });
  }, 0);
};

export default InlineWorker;
