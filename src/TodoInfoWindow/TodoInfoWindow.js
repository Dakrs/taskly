const path = require('path');
const { BrowserWindow } = require('electron');

class TodoInfoWindow {
  constructor(todo,parent){
    this.window = new BrowserWindow({
        width: 600,
        height: 450,
        titleBarStyle: 'hidden',
        movable: true,
        resizable: false,
        webPreferences: {
          //nodeIntegration: false,
          //preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
          preload: TODO_INFO_PRELOAD_WEBPACK_ENTRY,
          contextIsolation: true,
        },
        show: true,
        modal: true,
        parent: parent,
    });
    this.window.loadURL(TODO_INFO_WEBPACK_ENTRY);
    this.data = todo;
  }
}

module.exports = TodoInfoWindow;
