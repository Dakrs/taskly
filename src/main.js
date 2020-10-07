const { app, BrowserWindow, ipcMain, shell} = require('electron');
const path = require('path');
const axios = require('axios');
const MainWindow = require('./MainWindow/MainWindow');
const TodoInfoWindow = require('./TodoInfoWindow/TodoInfoWindow');
import setIpc from './MainIpc';
import GoogleAuth from './authGoogle';


let loadwin = null;
let mainwin = null;
let todowin = null;

if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', function () {
	//loadwin = new LoadingWindow();
	//loadwin.window.show();

  mainwin = new MainWindow();
  mainwin.window.once('ready-to-show',() => {
    mainwin.window.webContents.on('did-finish-load', () => {
      mainwin.window.show();
      //loadwin.window.hide();
      //loadwin.window.close();
    })
  });
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q

	if (process.platform !== 'darwin') {
		app.quit()
	}
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    mainwin = new MainWindow();
		mainwin.window.once('ready-to-show', () => {
      mainwin.window.webContents.on('did-finish-load', () => {
        mainwin.window.show();
      })
		});
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
setIpc();

ipcMain.on('trigger-google-url', async (event,arg) => {
	var url = await GoogleAuth.url();
	shell.openExternal(url);
});

var modalRes = null;

ipcMain.handle('toggle_todo_data', (event,...args) => {
  todowin = new TodoInfoWindow(args[0],mainwin.window);

  modalRes = new Promise((resolve,reject) => {
    todowin.res = resolve;
  });

  todowin.window.once('ready-to-show',() => {
    todowin.window.show();
  });

  todowin.window.once('closed',() => {
    todowin = null;
  });

  return modalRes;
})

ipcMain.on('close-modal', (event,arg) => {
  if (todowin !== null){
    modalRes = null;
    todowin.res(arg);
    todowin.window.hide();
    todowin.window.destroy();
    //mainwin.window.setEnabled(true);
  }
})

ipcMain.handle('get_todo_data', () => {
  return todowin.data;
})
