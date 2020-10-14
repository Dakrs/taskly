import $ from 'jquery';
window.$ = $;
import Vue from 'vue';
const Ipc = window.API.Ipc;

Vue.component('user-pannel',{
  props: {
    flag: Boolean,
  },
  methods: {
    toggleModal: function(){
      $('#GOOGLE-MODAL').modal('show');
    },
  },
  template:`
  <div class="userContainer">
    <div class="userContainer-col-left">
      <template v-if="!flag">
        <b @click="toggleModal()" class="userName userLogIn mouse">Log In</b>
      </template>
      <template v-else>
        <b class="userName">Diogo Sobral</b>
        <p class="settings">My Settings</p>
      </template>
    </div>
    <div class="userContainer-col-right">
      <span class="userIcon">
        <i class="fab fa-google"></i>
      </span>
    </div>
  </div>
  `
})
