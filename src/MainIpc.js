const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid');
import { url, postCode, sync_google } from './authGoogle';
import Task from './Database/tasks'

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

    var response=false
    try {
       response = await Task.updateState(id[0],1);
       console.log(response);
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response=true;
    }
    catch(err) {
      console.error("Erro",err)
      }

    return response;

  });

  ipcMain.handle('cancel_todo_id', async (event, ...id) => {
    var response =false
    try {
       response = await Task.updateState(id[0],2);
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response =true

    }
    catch(err) {
          console.error("Erro",err)
    }

    return response;

  });

  ipcMain.handle('update_list_index', async (event, ...todos) => {

    var response
    try {
        todos[0].forEach(async (item) => {
          await Task.updateById(item);
        });
    }

    catch(err) {
        return false
    }

    return true
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
      /**
      await axios.get('http://localhost:4545/google/tasks')
      await axios.get('http://localhost:4545/google/calendar')
      await axios.get('http://localhost:4545/google/emails')

     let response = await axios.get('http://localhost:4545/api')
     response.data.forEach(element => {
           if(element.date)
               element.date= new Date(element.date)
         });*/
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
          });
    }
    catch(err) {
      console.log(err);
      return null
    }
    return response;

  });
}
