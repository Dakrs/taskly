const { ipcRenderer,contextBridge } = require('electron')
import API_MODAL from './Ipc';


contextBridge.exposeInMainWorld(
  'API',
  {
    TODO_DATA: API_MODAL.get_todo_data,
    CANCEL: API_MODAL.cancel_todo_id,
    COMPLETE: API_MODAL.complete_todo_id,
    close_modal: (status) => ipcRenderer.send('close-modal',status),
  }
)
