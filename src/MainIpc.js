const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid');
import { url, postCode, sync_google } from './authGoogle';
import Task from './Database/tasks';
import {drop} from './Database/credential';

const Store = require('electron-store');
const store = new Store();

export default function setIpc(){

  ipcMain.handle('url-google',async (event,arg) => {
    var url = await url();
    console.log(url);
    return url
  });

  ipcMain.handle('store_google_api_key', async (event, ...args) => {
    var response=false
    try{
      var aux = await postCode(args[0]);
      store.set('GOOGLE_API_KEY',true);

      console.log(aux);
    }
    catch(err) {
          console.error("Erro",err)
      }
    return response
  });

  ipcMain.handle('complete_todo_id', async (event, ...id) => {

    var response = false;
    try {
       response = await Task.updateState(id[0],1);
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response = true;
    }
    catch(err) {
      console.error("Erro",err)
      }

    return response;

  });

  ipcMain.handle('cancel_todo_id', async (event, ...id) => {
    var response = false
    try {
       response = await Task.updateState(id[0],2);
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response = true

    }
    catch(err) {
      console.error("Erro",err)
    }

    return response;

  });

  ipcMain.handle('update_list_index', async (event, ...todos) => {

    var response
    try {
        await Promise.all(todos[0].forEach(async (item) => {
          await Task.updateById(item);
        }));
    }

    catch(err) {
        return false;
    }

    return true;
  });

  ipcMain.handle('get_all_todos', async (event, ...args) => {
    const todos = await Task.selectAll();
    todos.forEach(item => {
      if (item.hasOwnProperty('date'))
        item.date = new Date(item.date);
    });

    return todos;

  });

  ipcMain.handle('get_google_todos', async (event, ...args) => {
    const todos = await sync_google();
    return todos;
  });

  ipcMain.handle('add_todo', async (event, ...args) => {
    var response;
    try {
          response = await Task.insert({
            name : args[0].name,
            priority : args[0].priority,
            description : args[0].description,
            origin : "metodo",
            importance: args[0].importance,
            urgency: args[0].urgency
          });
    }
    catch(err) {
      console.log(err);
      return null
    }
    return response;

  });

  ipcMain.handle('reset-token-storage', async (event, ...args) => {
    store.set('GOOGLE_API_KEY',false);
    const res = await drop();
    return res;
  })
}
