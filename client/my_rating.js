import { Meteor } from 'meteor/meteor'
Template.my_rating.onCreated(function () {
    Meteor.subscribe('overview',{username: Meteor.user().username})
})
Template.my_rating.helpers({
    profile : function() {
        var a = UserOverview.findOne({username: Meteor.user().username});
        return a;
    }
});
Template.my_rating.events({
    'click #my_rating_parent'() {
        Router.go('/users/' + Meteor.user().username)
    }
});