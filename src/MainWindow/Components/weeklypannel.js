import $ from 'jquery';
import Vue from 'vue';


Vue.component('weekly-pannel',{
  props: {},
  data: function () {
    const cards = [
      {
        title: "Call doctors for tests",
        icon: "fa-meteor",
        tag: "Personal",
        date: "15 Mar 2020 - 9:00 AM",
        description: "Ask for blood tests and GYM certificate"
      },
      {
        title: "Beatrice's bday",
        icon: "fa-meteor",
        tag: "",
        date: "22 Mar 2020",
        description: "Birthday of Beatrice, must call her"
      }
    ]

    return {
      cards: cards
    }
  },
  template: `
  <div>
    <table class="table table-borderless">
      <tbody>
        <tr>
          <td class="nopadding text-left">
            <h4 class="weeklypineed nomargin">Weekly Pinned</h4>
          </td>
          <td class="nopadding text-right mouse">
            <p class="viewall">View all</p>
          </td>
        </tr>
     </tbody>
    </table>
    <div class="weekly-card-container">
      <div v-if="cards.length > 0" class="card-weekly spaced">
        <div class="card-weekly-content">
          <div class="card-weekly-content-col1">
            <i :class="['fas ' + cards[0].icon]"></i>
          </div>
          <div class="card-weekly-content-col2">
            <b class="card-weekly-content-title">{{cards[0].title}}</b>
            <p class="card-weekly-content-date nomargin">{{cards[0].date}}</p>
            <div class="card-weekly-content-tag">
              <p class="nomargin">{{cards[0].tag}}</p>
            </div>
            <p class="card-weekly-content-description">{{cards[0].description}}</p>
          </div>
        </div>
      </div>
      <div v-if="cards.length > 1" class="card-weekly spaced">
        <div class="card-weekly-content">
          <div class="card-weekly-content-col1">
            <i :class="['fas ' + cards[1].icon]"></i>
          </div>
          <div class="card-weekly-content-col2">
            <b class="card-weekly-content-title">{{cards[1].title}}</b>
            <p class="card-weekly-content-date nomargin">{{cards[1].date}}</p>
          </div>
        </div>
      </div>
      <div class="card-weekly-add spaced">
        <div class="card-weekly-content">
          <div class="card-weekly-add-content-col1">
            <i style="color: white" class="fas fa-plus"></i>
          </div>
          <div class="card-weekly-add-content-col2">
            <b class="card-weekly-add-content-title">Add new weekly pin</b>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})

/**
<div class="weekly-card-container">
  <div class="card-weekly spaced">
    <div class="card-weekly-content">
      <div class="card-weekly-content-col1">
        <i class="fas fa-meteor"></i>
      </div>
      <div class="card-weekly-content-col2">
        <b class="card-weekly-content-title">Call doctors for tests</b>
        <p class="card-weekly-content-date nomargin">15 Mar 2020 - 9:00 AM</p>
        <div class="card-weekly-content-tag">
          <p class="nomargin">Personal</p>
        </div>
        <p class="card-weekly-content-description">Ask for blood tests and GYM certificate</p>
      </div>
    </div>
  </div>
  <div class="card-weekly spaced">
    <div class="card-weekly-content">
      <div class="card-weekly-content-col1">
        <i class="fas fa-meteor"></i>
      </div>
      <div class="card-weekly-content-col2">
        <b class="card-weekly-content-title">Beatrice's bday</b>
        <p class="card-weekly-content-date nomargin">22 Mar 2020</p>
      </div>
    </div>
  </div>
  <div class="card-weekly-add spaced">
    <div class="card-weekly-content">
      <div class="card-weekly-add-content-col1">
        <i style="color: white" class="fas fa-plus"></i>
      </div>
      <div class="card-weekly-add-content-col2">
        <b class="card-weekly-add-content-title">Add new weekly pin</b>
      </div>
    </div>
  </div>
</div>

*/
