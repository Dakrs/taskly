const { ipcMain   } = require('electron');
const axios = require('axios');
var nanoid = require('nanoid');

const Store = require('electron-store');
const store = new Store();

export default function setIpc(){

  ipcMain.handle('url-google',async (event,arg) => {
    let response = await axios.get('http://localhost:4545/google/url');
    var url = response.data;
    return url
  });

  ipcMain.handle('store_google_api_key', async (event, ...args) => {
    var response=false
    try {
       var aux = await axios.post('http://localhost:4545/google/code',{
         code : args[0]
       })
       response = aux.data
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       store.set('GOOGLE_API_KEY',true);

       if(store.has('JWT_TOKEN')){
         var token = store.get('JWT_TOKEN');
         var resp2;
         try{
           resp2 = await axios.get('https://amcyni.herokuapp.com/google/credentials',{headers: {'x-access-token': token}});
           if (resp2.data.length === 0){
             resp2 = await axios.get('http://localhost:4545/api/googleToken');
             await axios.post('https://amcyni.herokuapp.com/api/google/token',{token: resp2.data.token},{headers: {'x-access-token': token}});
           }
         }
         catch(err){
           console.log(err);
         }
     }
    }
    catch(err) {
          console.error("Erro",err)
      }
    return response
  });

  ipcMain.handle('complete_todo_id', async (event, ...id) => {

    var response=false
    try {
       response = await axios.put('http://localhost:4545/api/state/'+id+'?state=1')
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response=true;

       if(store.has('JWT_TOKEN')){
         await sync();
       }
    }
    catch(err) {
      console.error("Erro",err)
      }

    return response;

  });

  ipcMain.handle('cancel_todo_id', async (event, ...id) => {

    var response =false
    try {
        await axios.put('http://localhost:4545/api/state/'+id+'?state=2')
       // 0 - por fazer // 1 - completa  // 2 - cancelada
       response =true

       if(store.has('JWT_TOKEN')){
         await sync();
       }
    }
    catch(err) {
          console.error("Erro",err)
    }

    return response;

  });

  ipcMain.handle('update_list_index', async (event, ...todos) => {

    var response
    try {
        response = await axios.put('http://localhost:4545/api',{
          todos
        }) // 0 - por fazer // 1 - completa  // 2 - cancelada
    }

    catch(err) {
           return false
       }

     return true
  });

  ipcMain.handle('get_all_todos', async (event, ...args) => {

    let response = await axios.get('http://localhost:4545/api')
    response.data.forEach(element => {
          if(element.date)
              element.date= new Date(element.date)
        });

    return response.data

  });

  ipcMain.handle('get_google_todos', async (event, ...args) => {

      await axios.get('http://localhost:4545/google/tasks')
      await axios.get('http://localhost:4545/google/calendar')
      await axios.get('http://localhost:4545/google/emails')

     let response = await axios.get('http://localhost:4545/api')
     response.data.forEach(element => {
           if(element.date)
               element.date= new Date(element.date)
         });
     return response.data
  });

  ipcMain.handle('add_todo', async (event, ...args) => {
    var response

    try {

          response = await axios.post('http://localhost:4545/api',{
          name : args[0].name,
          priority : args[0].priority,
          description : args[0].description,
          origin : "metodo"

          })
    }
    catch(err) {
           return null
       }
       return response.data;

  });
}
