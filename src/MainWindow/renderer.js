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
import './Components/taskaddmodal.js'

const Ipc = window.API.Ipc;

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
    day_of_week: day_of_week[date_actual.getDay()]
  },
  methods: {
    changeActive: function(day,index){
      this.active = day;
      this.day_of_week = day_of_week[index];
    },
    triggerAddModal: function(){
      $('#task-add-modal').modal('show');
    },
    submitTask: async function(obj){
      const res = await Ipc.add_task_routine(obj);
      const res2 = await Ipc.get_routine();
      this.allTasks = res2;
      this.tasks = this.allTasks[this.key];
    }
  },
  async mounted(){
    const res2 = await Ipc.get_routine();
    this.allTasks = res2;
    this.tasks = this.allTasks[this.key];
    this.isLoading = false;
  }
})
