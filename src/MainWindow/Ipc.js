//const ipcRenderer = window.ipcRenderer
const { ipcRenderer } = require('electron')

export async function store_google_api_key(key){
  const result = await ipcRenderer.invoke('store_google_api_key',key);
  return result;
}

export async function get_google_todos(){
  const result = await ipcRenderer.invoke('get_google_todos');
  return result;
}

export function triggerGOOGLE_URL(){
  ipcRenderer.send('trigger-google-url');
}

export async function getGOOGLEURL(){
  const result = await ipcRenderer.invoke('url-google');
  return result;
}

export async function reset_credentials(){
  const result = await ipcRenderer.invoke('reset-token-storage');
  return result;
}

export async function add_weekly_pin(obj){
  const result = await ipcRenderer.invoke('add-weekly-pins',obj);
  return result;
}

export async function get_weekly_pinned(){
  const result = await ipcRenderer.invoke('get-weekly-pins');
  return result;
}

export async function add_task_routine(obj){
  const result = await ipcRenderer.invoke('add-task-routine',obj);
  return result;
}

export async function get_routine(){
  const result = await ipcRenderer.invoke('get-routine');
  return result;
}

export async function sync_google(){
  const result = await ipcRenderer.invoke('sync_google');
  return result;
}

export default {store_google_api_key,
                get_google_todos,
                triggerGOOGLE_URL,
                getGOOGLEURL,
                reset_credentials,
                add_weekly_pin,
                get_weekly_pinned,
                add_task_routine,
                get_routine,
                sync_google
              }
