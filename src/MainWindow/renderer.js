import $ from 'jquery';
window.$ = $;

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import Vue from 'vue';

import './Components/calendar.js';
import './Components/weeklypannel.js';
import './Components/taskinfo.js';

Date.prototype.addHours = function(h) {
  this.setTime(this.getTime() + (h*60*60*1000));
  return this;
}

var date1 = new Date();
date1 = date1.addHours(3);

var date2 = new Date();
date2 = date2.addHours(-2);

var example_tasks = [
  {
    _id: "123",
    icon: "fa-meteor",
    title: "Wake up Buddy",
    date: date2,
  },
  {
    _id: "123",
    icon: "fa-meteor",
    title: "Wake up Buddy",
    content: "Zoom call, kick off with Elena and Jordan from Shift",
    date: date1,
  }
];

var main_comp = new Vue({
  el: '#MAIN_COMP',
  data: {
    tasks: example_tasks,
  },
  methods: {},
})
