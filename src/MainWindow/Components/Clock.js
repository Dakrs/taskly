import $ from 'jquery';
window.$ = $;
import Vue from 'vue';
const axios = require('axios');

Vue.component('time-clock',{
  props:{

  },
  methods:{
    updateTime: function(){
      const date = new Date();
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0' + minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;

      this.datestr = strTime;
    },
    updateweather: async function (){
      try{
        const res = await axios.get('https://api.openweathermap.org/data/2.5/weather?q=Braga,pt&appid=9a2f94c651eed859d52c48cd742ca9be');
        const weather = res.data.weather[0];
        console.log(weather);

        this.description = weather.description;
        var key = Math.floor(weather.id / 100);
        switch (key) {
          case 0:
            break;
          case 1:
            break;
          case 2:
            this.icon = "fa-poo-storm";
            break;

          case 3:
            this.icon = "fa-cloud-rain";
            break;

          case 4:
            this.icon = "fa-cloud-rain";
            break;

          case 5:
            this.icon = "fa-cloud-rain";
            break;

          case 6:
            this.icon = "fa-snowflake";
            break;

          case 7:
            this.icon = "fa-cloud";
            break;

          case 8:
            this.icon = "fa-sun";
            break;
          default:
        }
      }
      catch(e){
        console.log(e);
      }
    }
  },
  data: function(){
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;

    return {
      datestr: strTime,
      icon: null,
      description: null
    }
  },
  template:`
  <div class="clock-container">
    <h3 class="nomargin clock-hour-size">{{datestr}}</h3>
    <p v-if="this.description !== null" class="nomargin clock-weather">
      <i :class="['fas',this.icon]"></i>
      {{this.description}}
    </p>
  </div>
  `,
  async mounted(){
    setInterval(this.updateTime,1000);

    await this.updateweather();
    setInterval(this.updateweather,1000*60*60);
  }
})
