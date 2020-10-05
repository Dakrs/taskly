const db = require('./db')
var nanoid = require('nanoid')

export function insert(task){
  task._id = nanoid();
  task.owner = "me"
  task.state = 0

  const res = new Promise((resolve,reject) => {
    db.tasks.insert(task,function(err, newDoc){
      if (err){
        resolve(null);
      }
      else
        resolve(newDoc);
    })
  });
  return res;
}

export function selectAll(){
  const res = new Promise((resolve,reject) => {
    db.tasks.find({state: 0},function(err,docs){
      if(err)
        return resolve([]);
      return resolve(docs);
    })
  });
  return res;
}

export function updateState(idTask,state){
  const res = new Promise((resolve,reject) => {
    db.tasks.update({_id : idTask},{$set : {state : state}},{},function(err, numReplaced){
      if (err){
        resolve(-1);
      }
      else
        resolve(numReplaced);
    })
  });
  return res;
}

export function updateById(task){
  const res = new Promise((resolve,reject) => {
    db.tasks.update({_id:task._id},task,{},function(err, numReplaced){
      if (err){
        resolve(-1);
      }
      else
        resolve(numReplaced);
    })
  })
  return res;
}

export default{
  insert,
  selectAll,
  updateState,
  updateById
}
