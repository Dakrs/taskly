const {google} = require('googleapis');
import Credential from './Database/credential';
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/gmail.readonly'];
const readline = require('readline');
const path = require('path')
const fs = require('fs');
import CredJson from './static/credentials.json';
import Routine from './Database/routine';


async function authorize(credentials){
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
  const data_token = await Credential.get("GOOGLE");
  if (data_token.length > 0){
    oAuth2Client.setCredentials(data_token[0].token);
    return oAuth2Client;
  }
  return null;
}


async function insertToken(code,file) {
  const {client_secret, client_id, redirect_uris} = file.installed;
  const oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]);
  var response = await getTokenFromCode(oAuth2Client,code)
  return response;
}


async function getTokenFromCode(oAuth2Client,code){
  var creden ={}
  var response = false
  try {
      var token = await oAuth2Client.getToken(code)
      creden.type = "GOOGLE"
      creden.owner = "me"
      creden.token = token.tokens
      await Credential.insert(creden)
      response = true;

  }
  catch(err){
     console.error('Error retrieving access token', err);
  }

  return response;
}

async function getURL_to_access(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
  client_id, client_secret, redirect_uris[0]
  );
  var url = await getNewToken(oAuth2Client)
  return url
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
  return authUrl
}

export async function url(){
  var url
  url = await getURL_to_access(CredJson);

  return url;
}

export async function postCode(code){
  var response = await insertToken(code,CredJson);
  return response;
}

async function getCalendarIds(auth){
  var calendars_ids = [];
  const service = google.calendar({version : 'v3',auth});
  var calendars = await service.calendarList.list({});

  calendars.data.items.forEach((cal) => {
    if (cal.accessRole === "owner"){
      calendars_ids.push(cal.id);
    }
  });

  return calendars_ids;
}

async function listEvents(auth,idCalendario){
  const start = new Date(new Date().setHours(0,0,0));
  const calendar = google.calendar({version: 'v3', auth});

  const calendarios = await calendar.events.list({
    calendarId: idCalendario,
    timeMax: new Date(new Date(start).setDate(start.getDate() + 14)),
    timeMin: start
  });

  return calendarios.data.items;
}

export async function sync_google(){
  const auth = await authorize(CredJson);
  if (auth !== null){
    var allTodos = await Routine.findAll();
    allTodos = allTodos.filter(element => element.hasOwnProperty('idOrigin'));

    var calendars_ids = await getCalendarIds(auth);
    var cal_events = {}
    await Promise.all(calendars_ids.map(async (id) => {
      cal_events[id] = await listEvents(auth,id);
    }));

    var allEvents = [];
    for(var key in cal_events)
      allEvents = [...allEvents,...cal_events[key]];
    console.log(allEvents);
    /**
    allEvents = allEvents.filter(e => {
      const at_eve = allTodos.find(k => k.idOrigin === e.id);
      const cond1 = (at_eve === undefined);
      if (cond1){
        return true;
      }

      const date_eve = new Date(at_eve.date);
      var date_e2;
      if (e.start.dateTime)
        date_e2 = new Date(e.start.dateTime);
      else
        date_e2 = new Date(e.start.date);

      if(date_e2.toDateString() === date_eve.toDateString()){
        return true;
      }
      return false;
    });*/
    allEvents = allEvents.filter(e => allTodos.find(k => k.idOrigin === e.id) === undefined);

    await Promise.all(allEvents.map(async (e) => {
      var task = {}
      task.idOrigin = e.id;
      var date;
      if (e.start.dateTime)
        date = new Date(e.start.dateTime);
      else
        date = new Date(e.start.date);

      const minutes = date.getMinutes();
      const hours = date.getHours();
      const sec = date.getSeconds();
      task.date= date.toDateString() + ' ' + hours + ':' + minutes + ':' + sec;
      task.title = e.summary;

      if(e.description && e.description.length < 200)
        task.content = e.description;

      task.icon = 'fa-google';

      await Routine.insert(task);
    }));
  }
}

export default {
  url,
  postCode,
  sync_google
}
