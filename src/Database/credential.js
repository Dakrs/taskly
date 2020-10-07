const db = require('./db')

export async function get(type){
  const res = new Promise((resolve,reject) => {
   db.credentials.find({type:type},function(err, docs){
      if (err){
        resolve(null);
      }
      else
        resolve(docs);
    })
  });
  return res;
}

export function insert(t){
  const res = new Promise((resolve,reject) => {
    db.credentials.insert(t,function(err, newDoc){
      if (err){
        resolve(null);
      }
      else
        resolve(newDoc);
    })
  })
  return res;
}

export function update(type,token){
  const res = new Promise((resolve,reject) => {
    db.credentials.update({type : type},{$set :{token : token}},{},function(err,nedit){
      if (err){
        resolve(-1);
      }
      else
        resolve(numReplaced);
    })
  })
  return res;
}

export function drop(){
  const res = new Promise((resolse,reject) => {
    db.credentials.remove({},{multi: true}, (err,numRemoved) => {
      if (err){
        resolse(-1);
      }
      else{
        resolse(numRemoved);
      }
    })
  })
  return res;
}

export default {
  get,
  insert,
  update,
  drop
}
