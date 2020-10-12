const db = require('./db')
var nanoid = require('nanoid')

export function insert(obj){
  obj._id = nanoid();

  const res = new Promise((resolve, reject) => {
    db.weeklypins.insert(obj, (err, newDoc) => {
      if (err){
        resolve(null);
      }
      else
        resolve(newDoc);
    })
  });

  return res;
}

export function findAll(){
  const res = new Promise((resolve,reject) => {
    db.weeklypins.find({},function(err,docs){
      if(err)
        return resolve([]);
      return resolve(docs);
    })
  });

  return res;
}

export default {
  insert,
  findAll
}
