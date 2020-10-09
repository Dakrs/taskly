import $ from 'jquery';
window.$ = $;
//require('bootstrap/js/dist/modal');
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import Vue from 'vue';
import Sortable from 'sortablejs';
import './Components/todoinfo.js';
import './Components/modal.js';
import {  sortByOrigin,
          sortByDate,
          sortByNormal,
          updateIndex
        } from './Sorting';
//import Ipc from './Ipc';
const Ipc = window.API.Ipc;
const API = window.API;

/**
<i class="fas fa-chart-line"></i>
Todo:
id: 1,
date: new Date(2017,1,1), !!!Pode ser null
name: 'Aula PSD',
origin: 'Outlook',
description: 'Aula que acontece todas as segundas feiras e é preciso aparecer para poder aprender.', !!! Pode ser null
priority: 2,
index:, !!!Pode ser null
*/

Vue.component('add-todo',{
  props: {
    callback: Function,
  },
  template: `
  <div class="modal fade" id="ADD_TOO_COMP" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">Add ToDo</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form id="ADDTODO-FORM">
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="inputName">Name</label>
                <input name="name" type="text" class="form-control" id="inputName" maxlength="20" required>
              </div>
              <div class="form-group col-md-6">
              <label for="inputPriority">Priority</label>
                <select name="priority" id="inputPriority" class="form-control">
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                </select>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="inputImportance">Urgency</label>
                <select name="importance" id="inputImportance" class="form-control">
                  <option>Low</option>
                  <option>High</option>
                </select>
              </div>
              <div class="form-group col-md-6">
                <label for="inputUrgency">Urgency</label>
                <select name="urgency" id="inputUrgency" class="form-control">
                  <option>Low</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label for="inputDescription">Description</label>
              <input name="description" type="text" class="form-control" id="inputDescription" maxlength="200">
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="submit" form="ADDTODO-FORM" value="Submit" class="btn btn-dark">Summit</button>
          <button type="button" data-dismiss="modal" class="btn btn-dark">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  `,
  mounted(){
    var func = this.callback;
    $('#ADDTODO-FORM').on('submit', function(e){
      e.preventDefault();
      var obj = {};
      $('#ADDTODO-FORM').serializeArray().forEach((item, i) => {
        obj[item.name] = item.value;
      });

      if (obj.description === "")
        delete obj.description;

      obj.priority = +obj.priority;
      obj.origin = 'metodo';

      console.log(obj);

      $('#ADDTODO-FORM').trigger("reset");
      func(obj);
    });
  }
})


var alltodos = new Vue({
  el: '#MAIN_COMP',
  data: {
    todos: [],
    toggled: null,
    sortedBy: 0,
    sortableJS: null,
    sync_status: API.getGOOGLE_KEY_STATUS(),
  },
  async mounted(){
    var todos = await Ipc.get_all_todos();
    //var todos = [];
    this.todos = sortByNormal(todos);
    //console.log(this.todos);
  },
  methods: {
    toggleInfo: async function (id) {
      const todo = this.todos.find(item => item._id === id);
      if (this.toggled !== null && this.toggled._id === id){
        this.toggled = null;
      }
      else{
        //this.toggled = todo;
        const res = await Ipc.toggle_todo_data(todo);
        if (res === 2 || res === 1){
          var todos = this.todos.filter(x => x._id !== id);
          this.todos = todos;
        }
      }
    },
    // botão complete todo main comp
    complete: async function (id){
      const result = await Ipc.complete_todo_id(id);
      if (result){
        if (this.toggled !== null && this.toggled._id === id){
          this.toggled = null;
        }
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // botão cancel todo main comp
    cancel: async function (id){

      const result = await Ipc.cancel_todo_id(id);
      if (result){
        if (this.toggled !== null && this.toggled._id === id){
          this.toggled = null;
        }
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    complete_toggle: async function(id){

      const result = await Ipc.complete_todo_id(id);
      if (result){
        this.toggled = null;
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    // para lidar com os botões do todo que está a ser mostrado nos details
    cancel_toggle: async function(id){

      const result = await Ipc.cancel_todo_id(id);
      if (result){
        this.toggled = null;
        this.todos = this.todos.filter((item) => item._id !== id);
      }
      else{
        alert('ERROR!');
      }
    },
    //metodo para atualizar a ordem da lista quando old_index é menor que new_index
    rev_DaD_update: async function(old_index,new_index){
      var new_Array = [];

      this.todos.forEach((item, i) => {
        new_Array.push(item);
      });

      var temp = this.todos[old_index];
      for(var i = old_index; i < new_index && i < this.todos.length; i++)
      {
          new_Array[i] = this.todos[i+1];
      }
      new_Array[new_index] = temp;
      updateIndex(new_Array);

      const res = await Ipc.update_list_index(new_Array);
      if (res)
        this.todos = new_Array;
      else
        console.log('ERROR');
    },
    //metodo para atualizar a ordem da lista quando old_index é maior que new_index
    nor_DaD_update: async function(old_index,new_index){
      var new_Array = [];
      this.todos.forEach((item, i) => {
        new_Array.push(item);
      });

      var temp = this.todos[old_index];
      for(var i = old_index; i > new_index && i > 0; i--)
      {
        new_Array[i] = this.todos[i-1];
      }
      new_Array[new_index] = temp;
      updateIndex(new_Array);

      const res = await Ipc.update_list_index(new_Array);
      if (res)
        this.todos = new_Array;
      else
        console.log('ERROR');

    },
    verifyProperty: function(data){
      return (typeof data !== 'undefined');
    },
    sortBy: function(type){
      this.sortedBy = type;
      var new_Array = [];
      if (type === 0){
        this.todos = sortByNormal(this.todos);
        this.sortableJS.option("disabled", false);
      }
      else if (type === 1) {
        this.todos = sortByDate(this.todos);
        this.sortableJS.option("disabled", true);
      }
      else {
        this.todos = sortByOrigin(this.todos);
        this.sortableJS.option("disabled", true);
      }

    },
    timeConversor: function (time){
      const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(time);
      const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(time);
      const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(time);

      return da + ' ' + mo + ' ' + ye;
    },
    // função para atualizar os items de um dado tipo: //0 - Github 1 - Google 2 - Outlook
    sync: async function(type){
      var length = this.todos.length;
      var new_todos = [];

      if (!this.sync_status){
        //GOOGLE-MODAL
        $('#GOOGLE-MODAL').modal('show');
      }
      else{
        new_todos = await Ipc.get_google_todos();

        switch (this.sortedBy) {
          case 0:
            this.todos = sortByNormal(new_todos);
            break;
          case 1:
            this.todos = sortByDate(new_todos);
            break;
          case 2:
            this.todos = sortByOrigin(new_todos);
            break;
          default:
        }
        alert((new_todos.length - length)  + ' new ToDos!');
      }
    },
    handleGoogleModal: async function(key,type){
      const res = await Ipc.store_google_api_key(key);

      if (res !== true){
        alert('Error saving Google API key');
      }
      else{
        this.sync_status = true;
        alert('Google API key validated');
      }
      $('#GOOGLE-MODAL').modal('hide');
    },
    // função que mostra o modal
    toggleAddTodo: function(){
      $('#ADD_TOO_COMP').modal('show');
    },
    // função para adicionar um todo.
    addTodo: async function (obj){

      const res = await Ipc.add_todo(obj);
      console.log(res);

      if (typeof res !== 'undefined'){
        this.todos.push(res);
        switch (this.sortedBy) {
          case 0:
            this.todos = sortByNormal(this.todos);
            break;
          case 1:
            this.todos = sortByDate(this.todos);
            break;
          case 2:
            this.todos = sortByOrigin(this.todos);
            break;
          default:
        }
        alert('Todo Added');
      }
      $('#ADD_TOO_COMP').modal('hide');
    },
    test: function(){
      alert('Wele');
    },
  },
})

/**
var el = document.getElementById('cards')
alltodos.sortableJS = Sortable.create(el,{
  animation: 150,
  onEnd: function (evt){
    if (evt.oldDraggableIndex < evt.newDraggableIndex){
      alltodos.rev_DaD_update(evt.oldDraggableIndex,evt.newDraggableIndex);
    }
    else if (evt.oldDraggableIndex > evt.newDraggableIndex) {
      alltodos.nor_DaD_update(evt.oldDraggableIndex,evt.newDraggableIndex);
    }
  },
});*/

console.log('👋 This message is being logged by "renderer.js", included via webpack');
