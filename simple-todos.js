/* global Meteor, Mongo, Session, Template, Accounts, Tasks */
Tasks = new Mongo.Collection("tasks");

if (Meteor.isServer){
  //This code only runs on the server
  Meteor.publish("tasks", function(){
    return Tasks.find();
  })
}
if (Meteor.isClient) {
  //This code only runs on the client
  Meteor.subscribe("tasks");
  
  Template.body.helpers({
    tasks: function body_helper_tasks() {
      //Show newest tasks at the top
      if(Session.get("hideCompleted")){
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      }else{
        return Tasks.find({}, {sort: {createdAt: -1}}); 
      } 
    },
    hideCompleted: function body_helper_hideCompleted(){
      return Session.get("hideCompleted");
    },
    incompleteCount: function(){
      return Tasks.find({checked:{$ne: true}}).count();
    } 
  });
  
  Template.body.events({
    "submit .new-task": function onSubmitNewTask(event){
      //Prevent default browser form submit
      event.preventDefault();
      
      //Get valie from form element
      var text = event.target.text.value;
      
      //Insert a task into the collection
      Meteor.call("addTask", text);
      
      //Clear form
      event.target.text.value='';
    },
    "change .hide-completed input": function onChangeHideCompleted(event){
      Session.set("hideCompleted", event.target.checked);  
    }
  });

  Template.task.events({
    "click .toggle-checked": function onTaskToggleChecked() {
      //Set the checked property to the oppisite of its current value
      Meteor.call("setChecked", this._id, !this.checked); 
    },
    "click .delete": function onTaskDelete() {
      Meteor.call("deleteTask", this._id);
    }
  });

  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods({
  addTask: function(text){
    // Make sure the user is logged in before inserting a task
    if(!Meteor.userId()){
      throw new Meteor.Error("not-authorized");
    }
    
    Tasks.insert({
      text: text,
      createdAt: new Date(), //current time
      owner: Meteor.userId(),
      username: Meteor.user().username
    });
  },
  deleteTask: function(taskId){
      Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked){
    Tasks.update(taskId, { $set: {checked: setChecked} });     
  }
});
