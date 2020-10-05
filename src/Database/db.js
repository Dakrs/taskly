/**
var mongoose = require('mongoose');

const DATABASE_NAME = 'Access';

export default async function initDataBase(){
  var res;

  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/' + DATABASE_NAME, { useNewUrlParser: true, useUnifiedTopology: true });
    res = true;
    console.log('connected');
  } catch (e) {
    console.log(`Mongo: Error connecting to [${DATABASE_NAME}]: ${e}`);
    res = false;
  }

  return res;
}
*/

const { app } = require('electron');
var Datastore = require('nedb');

const dbFactory = (filename) => {
  return (new Datastore({
    filename: `${process.env.NODE_ENV === 'dev' ? '.' : app.getAppPath('userData')}/data/${filename}`,
    timestampData: true,
    autoload: true
  }))
}

const db = {
  credentials: dbFactory('credentials.db'),
  tasks: dbFactory('tasks.db')
};
module.exports = db;
