const {google} = require('googleapis');
import Credential from './Database/credential';
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/gmail.readonly'];
const readline = require('readline');
const path = require('path')
const fs = require('fs');
import CredJson from './static/credentials.json';
import Task from './Database/tasks';


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
    timeMax: new Date(new Date(start).setDate(start.getDate() + 365)),
    timeMin: start
  });

  return calendarios.data.items;
}

export async function sync_google(){
  const auth = await authorize(CredJson);
  if (auth !== null){
    const todoReg = new RegExp('^(\\[TODO\\])','i');
    var allTodos = await Task.findAll();
    allTodos = allTodos.filter(element => element.hasOwnProperty('idOrigin'));

    /**
    groupedTodos = allTodos.reduce((rv,x) => {
      (rv[x.origin] = rv[x.origin] || []).push(x);
      return rv;
    },{})
    console.log(groupedTodos);*/

    var calendars_ids = await getCalendarIds(auth);
    var cal_events = {}
    await Promise.all(calendars_ids.map(async (id) => {
      cal_events[id] = await listEvents(auth,id);
    }));

    var allEvents = [];
    for(var key in cal_events)
      allEvents = [...allEvents,...cal_events[key]];
    allEvents = allEvents.filter(e => todoReg.test(e.summary) && (allTodos.find(k => k.idOrigin === e.id) === undefined));


    await Promise.all(allEvents.map(async (e) => {
      var task = {}
      task.idOrigin = e.id;
      task.date= e.start.date;
      task.name = e.summary;

      if(e.description)
        task.description = e.description;

      task.origin = "Google Calendar";
      task.priority = 3;

      await Task.insert(task);
    }));
  }

  const todos = await Task.selectAll();
  return todos;
}

export default {
  url,
  postCode,
  sync_google
}
