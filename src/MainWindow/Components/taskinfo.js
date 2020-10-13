import $ from 'jquery';
import Vue from 'vue';

Vue.component('task-info',{
  props: {
    task: Object,
  },
  data: function () {
    return {
      extended: false,
    }
  },
  methods: {
    getHour: function(str_date){
      const date = new Date(str_date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    },
    completed: function(str_date){
      const date = new Date(str_date);
      const now = new Date();
      return (now.getTime() > date.getTime());
    },
    extend: function(){
      this.extended = !this.extended;
    }
  },
  template: `
  <li :key="task._id">
    <div @click="extend()" :class="['card-task', completed(task.date) ? 'card-task-completed' : '', task.hasOwnProperty('content') ? 'mouse' : '']">
      <div class="card-task-col-left">
        <i :class="[ task.icon === 'fa-google' ? 'fab ' + task.icon : 'fas ' + task.icon ,'rotationIcon']"></i>
      </div>
      <div class="card-task-col-middle">
        <b class="card-task-title">{{task.title}}</b>
        <p v-if="task.hasOwnProperty('content') && this.extended" class="card-task-content">
          {{task.content}}
        </p>
      </div>
      <div class="card-task-col-right">
        <p class="card-task-col-right-text">{{getHour(task.date)}}</p>
      </div>
    </div>
  </li>
  `
})


/**
task: {
  _id:,
  icon: String,
  title: String,
  content: String,
  date: Date,
}
*/

/**
<li>
  <div class="card-task card-task-completed">
    <div class="card-task-col-left">
      <i class="fas fa-clock"></i>
    </div>
    <div class="card-task-col-middle">
      <b class="card-task-title">Wake up Buddy</b>
    </div>
    <div class="card-task-col-right">
      <p class="card-task-col-right-text"> 7:00 AM</p>
    </div>
  </div>
</li>
<li>
  <div class="card-task">
    <div class="card-task-col-left">
      <i class="fas fa-clock"></i>
    </div>
    <div class="card-task-col-middle">
      <b class="card-task-title">Wake up Buddy</b>
      <p class="card-task-content">
        Zoom call, kick off with Elena and Jordan from Shift
      </p>
    </div>
    <div class="card-task-col-right">
      <p class="card-task-col-right-text"> 7:00 AM</p>
    </div>
  </div>
</li>
*/
