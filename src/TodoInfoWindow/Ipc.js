const { ipcRenderer } = require('electron')

export async function get_todo_data(){
  const result = await ipcRenderer.invoke('get_todo_data');
  return result;
}
export async function cancel_todo_id(id){
  const result = await ipcRenderer.invoke('cancel_todo_id', id);
  return result;
}

export async function complete_todo_id(id){
  const result = await ipcRenderer.invoke('complete_todo_id', id);
  return result;
}

export default {
  get_todo_data,
  complete_todo_id,
  cancel_todo_id
};
