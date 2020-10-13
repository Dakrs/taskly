import $ from 'jquery';
window.$ = $;

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Vue from 'vue';
import { BootstrapVue } from 'bootstrap-vue'

import './Components/calendar.js';
import './Components/weeklypannel.js';
import './Components/taskinfo.js';
import './Components/taskaddmodal.js';
import './Components/Clock.js';
import './Components/googlemodal.js';
import './Components/UserPannel.js';

const Ipc = window.API.Ipc;
const API = window.API;

Vue.use(BootstrapVue)

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}


var date_actual = new Date();
var day_of_week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday','Thursday','Friday','Saturday']

var main_comp = new Vue({
  el: '#MAIN_COMP',
  data: {
    tasks: [],
    allTasks: null,
    isLoading: true,
    active: date_actual.getDate(),
    key: date_actual.toDateString(),
    day_of_week: day_of_week[date_actual.getDay()],
    set_ocu: null,
    loggedIn: API.getGOOGLE_KEY_STATUS(),
  },
  methods: {
    changeActive: function(day,index){
      this.active = day.getDate();
      this.day_of_week = day_of_week[index];
      if (this.allTasks !== null){
        this.key = day.toDateString();
        this.tasks = this.allTasks[this.key];
      }
    },
    triggerAddModal: function(){
      $('#task-add-modal').modal('show');
    },
    submitTask: async function(obj){
      const res = await Ipc.add_task_routine(obj);
      const res2 = await Ipc.get_routine();
      this.allTasks = res2;
      this.tasks = this.allTasks[this.key];
      this.computedOcurrences();
    },
    computedOcurrences: function(){
      var prevMonday = new Date();
      prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);

      const task_info = {};

      var str;
      for(var i = 0; i < 14; i++){
        str = prevMonday.toDateString();
        if (str in this.allTasks){
          task_info[str] = this.allTasks[str].length;
        }
        else{
          task_info[str] = 0;
        }
        prevMonday.setDate(prevMonday.getDate() + 1);
      }

      this.set_ocu = task_info;
    },
    handleGoogleModal: async function(key,type){
      const res = await Ipc.store_google_api_key(key);

      if (res !== true){
        alert('Error saving Google API key');
      }
      else{
        this.loggedIn = true;
        alert('Google API key validated');
      }
      $('#GOOGLE-MODAL').modal('hide');
    },
    handleSync: async function(){
      const update_task = await Ipc.sync_google();
      this.allTasks = update_task;
      this.tasks = this.allTasks[this.key];
      alert('Sync completed');
    }
  },
  async mounted(){
    const res2 = await Ipc.get_routine();
    this.allTasks = res2;
    this.tasks = this.allTasks[this.key];
    this.isLoading = false;
    this.computedOcurrences();
  }
})
