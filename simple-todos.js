/* global Mongo */
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  //This code only runs on the client

  Template.body.helpers({
    tasks: body_helper_tasks 
  });
  
  Template.body.events({
    "submit .new-task": onSubmitNewTask 
  });

  Template.task.events({
    "click .toggle-checked": onTaskToggleChecked,
    "click .delete": onTaskDelete
  });
      
  function body_helper_tasks() {
    //Show newest tasks at the top 
    return Tasks.find({}, {sort: {createdAt: -1}}); 
  }

  function onTaskToggleChecked() {
    //Set the checked property to the oppisite of its current value
    Tasks.update(this._id, {
      $set: {checked: !this.checked} 
    });
  }
  
  function onTaskDelete() {
    Tasks.remove(this._id);
  }

  function onSubmitNewTask(event){
    //Prevent default browser form submit
    event.preventDefault();
    
    //Get valie from form element
    var text = event.target.text.value;
    
    //Insert a task into the collection
    Tasks.insert({
      text: text,
      createdAt: new Date() //current time
    });
    
    //Clear form
    event.target.text.value='';
  }

}