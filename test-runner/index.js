const electron = require('electron');
const remote = electron.remote;
const BrowserWindow = remote.BrowserWindow;
const jQuery = require('jQuery');


//var remote = require('remote');
var remoteConsole = remote.require('console');
var ipc = require("electron").ipcRenderer;
var mocha = require('mocha');
var expect = require('chai').expect;

Error.stackTraceLimit = Infinity;

console.log = function () {
  remoteConsole.log.apply(remoteConsole, arguments);
};

console.warn = function () {
  remoteConsole.warn.apply(remoteConsole, arguments);
};

console.dir = function () {
  remoteConsole.dir.apply(remoteConsole, arguments);
};

window.onerror = function (message, filename, lineno, colno, err) {
  ipc.send('mocha-error', {
    message: message,
    filename: filename,
    err: err,
    stack: err.stack
  })
};

var runner = new mocha();
//runner.reporter('nyan');
runner.ui('bdd');
runner.files = mocha.utils.lookupFiles('test', ['js'], true);
runner.run(function (failureCount) {
  ipc.send('mocha-done', failureCount);
});