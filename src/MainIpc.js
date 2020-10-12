const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid');
import { url, postCode, sync_google } from './authGoogle';
import Routine from './Database/routine';
import WeeklyPin from './Database/weeklypins';
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

  ipcMain.handle('get_google_todos', async (event, ...args) => {
    const todos = await sync_google();
    return todos;
  });

  ipcMain.handle('reset-token-storage', async (event, ...args) => {
    store.set('GOOGLE_API_KEY',false);
    const res = await drop();
    return res;
  })

  ipcMain.handle('get-weekly-pins', async (event,...args) => {
    const today = new Date();
    const start = new Date(today.setDate(today.getDate() - today.getDay()));
    const end = new Date(today.setDate(today.getDate() + 6));

    start.setHours(0,0,0,0);
    end.setHours(23,59,59,0);

    const weeklypins = await WeeklyPin.findAll();
    const res = weeklypins.filter((item) => {
      const pin_date = new Date(item.date);
      return ((pin_date.getTime() >= start.getTime()) && (pin_date.getTime() <= end.getTime()));
    })
    return res;
  })

  ipcMain.handle('add-weekly-pins', async (event,...args) => {
    const res = await WeeklyPin.insert(args[0]);
    return res;
  })

  ipcMain.handle('add-task-routine',async (event,...args) => {
    const res = await Routine.insert(args[0]);
    return res;
  })

  ipcMain.handle('get-routine',async (event,...args) => {
    const res = await Routine.findAll();

    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);


    const tasks_per_day = {};

    for(var i = 0; i < 14; i++){
      tasks_per_day[prevMonday.toDateString()] = [];
      prevMonday.setDate(prevMonday.getDate() + 1);
    }

    var dt_str;
    res.forEach((item, i) => {
      const date = new Date(item.date);
      dt_str = date.toDateString();
      if (dt_str in tasks_per_day){
        tasks_per_day[dt_str].push(item);
      }
    });

    for (const [key, value] of Object.entries(tasks_per_day)) {
      value.sort((a,b) => {
        return new Date(a.date) - new Date(b.date);
      })
    }

    return tasks_per_day;
  })
}
