const {google} = require('googleapis');
import Credential from './Database/credential';
const SCOPES = ['https://www.googleapis.com/auth/tasks.readonly','https://www.googleapis.com/auth/calendar.readonly','https://www.googleapis.com/auth/gmail.readonly'];
const readline = require('readline');
const path = require('path')
const fs = require('fs');


export function authorize(credentials,callback){
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);
      Credential.get("GOOGLE")
      .then(dados =>{
           if (dados.length >0){
                oAuth2Client.setCredentials(dados[0].token)
                return callback(oAuth2Client)
           }

  })
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
      console.log(token)
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

  var file = await readFile();
  if(file){
    url = await getURL_to_access(JSON.parse(file))
  }

  return url;
}

async function readFile(){
  var content
  try {
    console.log(__dirname)
    content = fs.readFileSync(path.resolve(__dirname, '../credentials.json'))
 }
 catch(err) {
   return console.log('Error loading client secret file:', err);
     }
   return content
}

export default {
  authorize,
  getURL_to_access,
  getNewToken,
  insertToken,
  url
}
