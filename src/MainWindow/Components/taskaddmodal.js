import $ from 'jquery';
import Vue from 'vue';
import Datepicker from 'vuejs-datepicker';

Vue.component('task-add-modal',{
  props: {
    submit: Function
  },
  data: function () {
    const cards = [];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    return {
      disableDate: {
        to: yesterday
      }
    }
  },
  methods: {
    getTime: function(){
      const date = new Date();
      var minutes = date.getMinutes();
      var hours = date.getHours();
      var str_date =  hours + ':' + minutes + ':00';
      return (str_date);
    }
  },
  template:`
    <div class="modal fade" id="task-add-modal" data-focus="true" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" style="-webkit-user-select: none;">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Add a new Task</h5>
          </div>
          <div class="modal-body">
            <form id="ADD-TASK-FORM">
              <div class="form-group">
                <label for="inputTitle">Title</label>
                <input name="title" type="text" class="form-control" id="inputTitle" maxlength="20" required>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="inputType">Content Type</label>
                  <select name="type" id="inputType" class="form-control">
                    <option>Text</option>
                    <option>List</option>
                  </select>
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
                  <label for="inputDate">Date</label>
                  <datepicker :bootstrap-styling="true" :disabled-dates="disableDate" :value="new Date()" name="date" id="inputDate" input-class="datepickerColor" required="true"></datepicker>
                </div>
                <div class="form-group col-md-6">
                  <label for="timepicker-valid">Choose a time</label>
                  <b-form-timepicker :value="getTime()" name="time" id="timepicker-valid" now-button required="true"></b-form-timepicker>
                </div>
              </div>
              <div class="form-group">
                <label for="inputContent">Content</label>
                <input name="content" type="text" class="form-control" id="inputContent" maxlength="200" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="submit" form="ADD-TASK-FORM" class="btn btn-dark">Send</button>
          </div>
        </div>
      </div>
    </div>
  `,
  mounted(){
    const func = async (obj) => {
      await this.submit(obj);
    }

    $('#ADD-TASK-FORM').on('submit',function(e){
      e.preventDefault();
      var obj = {};
      $('#ADD-TASK-FORM').serializeArray().forEach((item, i) => {
        obj[item.name] = item.value;
      });

      var pindate = new Date(obj.date);
      obj.date = pindate.toDateString() + ' ' + obj.time;
      delete obj.time;

      $('#ADD-TASK-FORM').trigger("reset");
      $('#task-add-modal').modal('hide');
      func(obj);
    })
  },
  components: {
    Datepicker
  },
})
