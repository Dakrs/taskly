import $ from 'jquery';
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';

const Ipc = window.API.Ipc;

Vue.component('weekly-pannel',{
  props: {},
  data: function () {
    const cards = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      cards: cards,
      disableDate: {
        to: yesterday
      }
    }
  },
  methods: {
    triggerModal: function (){
      $('#weekly-add-modal').modal('show');
    },
    triggerListWeekly: function (){
      $('#list-all-pins').modal('show');
    },
    rotate: function (direction){
      if (this.cards.length > 0){
        var arr = [...this.cards];
        if (direction) arr.unshift(arr.pop());
        else arr.push(arr.shift());
        this.cards = arr;
      }
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
          <td v-if="cards.length > 0" class="nopadding text-right mouse">
            <p @click="triggerListWeekly()" class="viewall">View all</p>
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
            <div class="card-weekly-tag-container">
              <div class="card-weekly-content-tag">
                <p class="nomargin">{{cards[0].tag}}</p>
              </div>
              <div :class="['card-weekly-content-tag-small', cards[0].importance === 'Low' ? 'green' : 'red']">
                <p class="nomargin">I</p>
              </div>
              <div :class="['card-weekly-content-tag-small', cards[0].urgency === 'Low' ? 'green' : 'red']">
                <p class="nomargin">U</p>
              </div>
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
      <div @click="triggerModal()" class="card-weekly-add">
        <div class="card-weekly-content">
          <div class="card-weekly-add-content-col1">
            <i style="color: white" class="fas fa-plus"></i>
          </div>
          <div class="card-weekly-add-content-col2">
            <b class="card-weekly-add-content-title">Add new weekly pin</b>
          </div>
        </div>
      </div>
      <table class="table table-borderless">
        <tbody>
          <tr>
            <td class="nopadding text-right">
              <span @click="rotate(true)" class="nomargin nopadding">
                <i class="fas fa-caret-left shift mouse"></i>
              </span>
            </td>
            <td class="nopadding text-left">
              <span @click="rotate(false)" class="nomargin nopadding">
                <i class="fas fa-caret-right shift mouse"></i>
              </span>
            </td>
          </tr>
       </tbody>
      </table>
    </div>
    <div class="modal fade" id="weekly-add-modal" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Add new Weekly Pin</h5>
          </div>
          <div class="modal-body">
            <form id="ADD-WEEKLY-FORM">
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputTitle">Title</label>
                  <input name="title" type="text" class="form-control" id="inputTitle" maxlength="20" required>
                </div>
                <div class="form-group col-md-6">
                  <label for="inputIcon">Icon</label>
                  <select name="icon" id="inputIcon" class="form-control">
                    <option>fa-meteor</option>
                    <option>fa-bolt</option>
                    <option>fa-dragon</option>
                    <option>fa-broom</option>
                    <option>fa-paper-plane</option>
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
                  <datepicker :bootstrap-styling="true" :disabled-dates="disableDate" :value="new Date()" name="date" id="inputDate" input-class="datepickerColor" required="true"></datepicker>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputUrgency">Urgency</label>
                  <select name="urgency" id="inputUrgency" class="form-control">
                    <option>Low</option>
                    <option>High</option>
                  </select>
                </div>
                <div class="form-group col-md-6">
                  <label for="inputImportance">Importance</label>
                  <select name="importance" id="inputImportance" class="form-control">
                    <option>Low</option>
                    <option>High</option>
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label for="inputDescription">Description</label>
                <input name="description" type="text" class="form-control" id="inputDescription" maxlength="200" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" form="ADD-WEEKLY-FORM" class="btn btn-dark">Send</button>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade bd-example-modal-lg" id="list-all-pins" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Weekly Pins</h5>
          </div>
          <div class="modal-body">
            <div class="modal-pin-container">
              <template v-for="(task,index) in cards">
                <div class="card-weekly spaced margin-right">
                  <div class="card-weekly-content">
                    <div class="card-weekly-content-col1">
                      <i :class="['fas ' + task.icon]"></i>
                    </div>
                    <div class="card-weekly-content-col2">
                      <b class="card-weekly-content-title">{{task.title}}</b>
                      <p class="card-weekly-content-date nomargin">{{task.date}}</p>
                      <div class="card-weekly-tag-container">
                        <div class="card-weekly-content-tag">
                          <p class="nomargin">{{task.tag}}</p>
                        </div>
                        <div :class="['card-weekly-content-tag-small', task.importance === 'Low' ? 'green' : 'red']">
                          <p class="nomargin">I</p>
                        </div>
                        <div :class="['card-weekly-content-tag-small', task.urgency === 'Low' ? 'green' : 'red']">
                          <p class="nomargin">U</p>
                        </div>
                      </div>
                      <p class="card-weekly-content-description">{{task.description}}</p>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  components: {
    Datepicker
  },
  async mounted(){

    const weeklypins = await Ipc.get_weekly_pinned();
    this.cards = weeklypins;

    const func = async (obj) => {
      const res = await Ipc.add_weekly_pin(obj);

      if(res){
        const today = new Date();
        const start = new Date(today.setDate(today.getDate() - today.getDay()));
        const end = new Date(today.setDate(today.getDate() + 6));

        start.setHours(0,0,0,0);
        end.setHours(23,59,59,0);
        const pin_date = new Date(res.date);
        if ((pin_date.getTime() >= start.getTime()) && (pin_date.getTime() <= end.getTime())){
          var new_Array = [...this.cards];
          new_Array.push(res);
          this.cards = new_Array;
        }
      }
    }

    $('#ADD-WEEKLY-FORM').on('submit', async function(e){
      e.preventDefault();
      var obj = {};
      $('#ADD-WEEKLY-FORM').serializeArray().forEach((item, i) => {
        obj[item.name] = item.value;
      });

      var pindate = new Date(obj.date);
      obj.date = pindate.toDateString();

      pindate.setDate(pindate.getDate() - pindate.getDay());

      obj.startday = pindate.toDateString();
      pindate.setDate(pindate.getDate() + 6);
      obj.endday = pindate.toDateString();

      $('#ADD-WEEKLY-FORM').trigger("reset");
      $('#weekly-add-modal').modal('hide');

      await func(obj);
    })
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
/**
<div class="modal fade" id="list-all-pins" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
  <div class="modal-dialog modal-dialog-centered" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalCenterTitle">Weekly Pins</h5>
      </div>
      <div class="modal-body">
        <div class="weekly-card-container">
          <template v-for="(task,index) in cards">
            <div class="card-weekly-content">
              <div class="card-weekly-content-col1">
                <i :class="['fas ' + task.icon]"></i>
              </div>
              <div class="card-weekly-content-col2">
                <b class="card-weekly-content-title">{{task.title}}</b>
                <p class="card-weekly-content-date nomargin">{{task.date}}</p>
                <div class="card-weekly-tag-container">
                  <div class="card-weekly-content-tag">
                    <p class="nomargin">{{task.tag}}</p>
                  </div>
                  <div :class="['card-weekly-content-tag-small', task.importance === 'Low' ? 'green' : 'red']">
                    <p class="nomargin">I</p>
                  </div>
                  <div :class="['card-weekly-content-tag-small', task.urgency === 'Low' ? 'green' : 'red']">
                    <p class="nomargin">U</p>
                  </div>
                </div>
                <p class="card-weekly-content-description">{{task.description}}</p>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="modal-footer">
        <button type="submit" form="ADD-WEEKLY-FORM" class="btn btn-dark">Send</button>
      </div>
    </div>
  </div>
</div>
*/
