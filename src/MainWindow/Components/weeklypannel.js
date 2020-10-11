import $ from 'jquery';
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';


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
  methods: {
    triggerModal: function (){
      $('#weekly-add-modal').modal('show');
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
      <div @click="triggerModal()" class="card-weekly-add spaced">
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
    <div class="modal fade" id="weekly-add-modal" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Add new Weekly Pin</h5>
          </div>
          <div class="modal-body">
            <form id="ADDTODO-FORM">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputTitle">Title</label>
                  <input name="title" type="text" class="form-control" id="inputTitle" maxlength="20" required>
                </div>
                <div class="form-group col-md-6">
                  <label for="inputIcon">Icon</label>
                  <select name="icon" id="inputIcon" class="form-control">
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
                  <label for="inputTag">Tag</label>
                  <select name="tag" id="inputTag" class="form-control">
                    <option>Low</option>
                    <option>High</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div class="form-group col-md-6">
                  <label for="inputDate">Date</label>
                  <datepicker :bootstrap-styling="true" name="date" id="inputDate" input-class="datepickerColor" required></datepicker>
                </div>
              </div>
              <div class="form-group">
                <label for="inputDescription">Description</label>
                <input name="description" type="text" class="form-control" id="inputDescription" maxlength="200">
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-dark">Send</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  components: {
    Datepicker
  }
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
