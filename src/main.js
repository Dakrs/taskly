const { app, BrowserWindow, ipcMain, shell} = require('electron');
const path = require('path');
const axios = require('axios');
const LoadingWindow = require('./Electron/LoadingWindow');
const MainWindow = require('./Electron/MainWindow');
import setIpc from './MainIpc';
import GoogleAuth from './authGoogle';


let loadwin = null;
let mainwin = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var shuttingDown;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async function () {
  shuttingDown = false;
	loadwin = new LoadingWindow();
	loadwin.window.show();

	if (true){
		mainwin = new MainWindow();
		mainwin.window.once('ready-to-show',() => {
			mainwin.window.show();
			loadwin.window.hide();
			loadwin.window.close();
		});
	}
	else{
		app.quit();
	}
});

// Called before quitting...gives us an opportunity to shutdown the child process
app.on('before-quit',function()
{
	log.info('gracefully shutting down...');

	// Need this to make sure we don't kick things off again in the child process
	shuttingDown = true;
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q

	if (process.platform !== 'darwin') {
		app.quit()
	}
});


process.on("SIGINT", function () {
	//graceful shutdown
	log.info('shutting down...');
	process.exit();
});


app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0 && mainwin !== null) {
    mainwin = new MainWindow();
		mainwin.window.once('ready-to-show', () => {
			mainwin.window.show();
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
