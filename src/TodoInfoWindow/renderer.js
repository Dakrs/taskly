import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue';
import './index.css';
import './Components/todoinfo.js';

const API = window.API;

var api_controller = new Vue({
  el: '#TODO_INFO',
  data: {
    toggled: null,
  },
  async mounted(){
    var todo = await API.TODO_DATA();
    this.toggled = todo;
  },
  methods:{
    goback: function(){
      API.close_modal(0);
    },
    complete_toggle: async function(id){

      const result = await API.COMPLETE(id);
      if (result){
        API.close_modal(1);
      }
      else{
        alert('ERROR!');
      }
    },
    cancel_toggle: async function(id){

      const result = await API.CANCEL(id);
      if (result){
        API.close_modal(2);
      }
      else{
        alert('ERROR!');
      }
    }
  }
})
