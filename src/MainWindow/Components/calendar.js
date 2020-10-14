import $ from 'jquery';
import Vue from 'vue';

Vue.component('calendar-tasks',{
  props: {
    callback: Function,
    active: Number,
    set: Object,
  },
  data: function () {
    var date = new Date();
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);


    const firstrow = [];
    const secondrow = []

    for(var i = 0; i < 7; i++){
      firstrow.push(new Date(prevMonday));
      prevMonday.setDate(prevMonday.getDate() + 1);
    }
    for(var i = 0; i < 7; i++){
      secondrow.push(new Date(prevMonday));
      prevMonday.setDate(prevMonday.getDate() + 1);
    }

    const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];

    return {
      firstrow: firstrow,
      secondrow: secondrow,
      actual: date.getDate(),
      month: monthNames[date.getMonth()],
      year: date.getFullYear(),
      today: date.getDate()
    }
  },
  methods: {
    handleClick: function(day,index){
      index += 1;
      if (index > 6)
        index = 0;
      this.callback(day,index);
    }
  },
  template:`
  <div>
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td class="nopadding text-left">
            <h4 class="weeklypineed nomargin">{{month}}, {{year}}</h4>
          </td>
          <td class="nopadding text-right mouse">
            <p class="viewall">Two weeks</p>
          </td>
        </tr>
     </tbody>
    </table>
    <div class="calendar">
      <table class="table table-borderless spacing">
        <tbody>
          <tr>
            <td class="dayofweek">
              Mon
            </td>
            <td class="dayofweek">
              Tue
            </td>
            <td class="dayofweek">
              Wed
            </td>
            <td class="dayofweek">
              Thu
            </td>
            <td class="dayofweek">
              Fri
            </td>
            <td class="dayofweek">
              Sat
            </td>
            <td class="dayofweek">
              Sun
            </td>
          </tr>
          <tr>
            <template v-for="(i,index) in firstrow">
              <td v-if="(i.getDate() == active)" @click="handleClick(i,index)" class="cirle">{{i.getDate()}}</td>
              <td v-else-if="(set !== null && set[i.toDateString()] > 0)" class="active">
                <p @click="handleClick(i,index)" class="char nomargin mouse">{{i.getDate()}}</p>
              </td>
              <td v-else-if="(i.getDate() == today)" @click="handleClick(i,index)" class="notactive mouse">{{i.getDate()}}</td>
              <td v-else class="notactive">{{i.getDate()}}</td>
            </template>
          </tr>
          <tr>
            <template v-for="(i,index) in secondrow">
              <td v-if="(i.getDate() == active)" @click="handleClick(i,index)" class="cirle">{{i.getDate()}}</td>
              <td v-else-if="(set !== null && set[i.toDateString()] > 0)" class="active">
                <p @click="handleClick(i,index)" class="char nomargin mouse">{{i.getDate()}}</p>
              </td>
              <td v-else-if="(i.getDate() == today)" @click="handleClick(i,index)" class="notactive mouse">{{i.getDate()}}</td>
              <td v-else class="notactive">
                <p class="nomargin">{{i.getDate()}}</p>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  `
})

/**

<table class="table table-borderless">
  <tbody>
    <tr>
      <td class="nopadding text-left">
        <h4 class="weeklypineed nomargin">March, 2020</h4>
      </td>
      <td class="nopadding text-right mouse">
        <p class="viewall">Two weeks</p>
      </td>
    </tr>
 </tbody>
</table>
<div class="calendar">
  <table class="table table-borderless spacing">
    <tbody>
      <tr>
        <td class="dayofweek">
          Mon
        </td>
        <td class="dayofweek">
          Tue
        </td>
        <td class="dayofweek">
          Wed
        </td>
        <td class="dayofweek">
          Thu
        </td>
        <td class="dayofweek">
          Fri
        </td>
        <td class="dayofweek">
          Sat
        </td>
        <td class="dayofweek">
          Sun
        </td>
      </tr>
      <tr>
        <td class="notactive">1</td>
        <td class="active"><p class="char nomargin">2</p></td>
        <td class="active"><p class="char nomargin">3</p></td>
        <td class="active"><p class="char nomargin">4</p></td>
        <td class="notactive">5</td>
        <td class="notactive">6</td>
        <td class="notactive">7</td>
      </tr>
      <tr>
        <td class="notactive">8</td>
        <td class="active"><p class="char nomargin">9</p></td>
        <td class="active"><p class="char nomargin">10</p></td>
        <td class="active"><p class="char nomargin">11</p></td>
        <td class="notactive">12</td>
        <td class="notactive">13</td>
        <td class="cirle">
          <p class="cirleText">14</p>
        </td>
      </tr>
    </tbody>
  </table>
</div>

*/
