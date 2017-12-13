import { Mongo } from "meteor/mongo";

Router.onBeforeAction(function() {
  if (!Meteor.userId()) {
    this.render('main');
  } else {
  Meteor.subscribe('ratings');
    this.next();
  }
});

Router.route('/', {
   name: "main",
   waitOn: function() {
     if(!Meteor.userId())
      return;
    return Meteor.subscribe('ratings', {
      onReady : function() {
        var transactions = UserRatings.find({
          to: Meteor.user().username
        });
        var usernames = [];
        transactions.forEach(transaction => {
            usernames.push({username : transaction.from});
        });
        Meteor.subscribe('overview',{usernames: usernames});
      }
    });    
   }
});

Router.route('/users/:name', {
  name: "user",
  data: function() {
    return {
      name: this.params.name
    };
  },
  waitOn: function() {
    if(!Meteor.userId())
      return;
    return Meteor.subscribe('overview',{username: this.params.name});
  }
});

Router.route('/share', {
  name: "sp"
});
