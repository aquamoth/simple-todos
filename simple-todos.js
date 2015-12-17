/* global Meteor, Mongo, Session, Template, Tasks */
Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  //This code only runs on the client

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
    } 
  });
  
  Template.body.events({
    "submit .new-task": function onSubmitNewTask(event){
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
    },
    "change .hide-completed input": function onChangeHideCompleted(event){
      Session.set("hideCompleted", event.target.checked);  
    }
  });

  Template.task.events({
    "click .toggle-checked": function onTaskToggleChecked() {
      //Set the checked property to the oppisite of its current value
      Tasks.update(this._id, {
        $set: {checked: !this.checked} 
      });
    },
    "click .delete": function onTaskDelete() {
      Tasks.remove(this._id);
    }
  });
      
  
  
  

}