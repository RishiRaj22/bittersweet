import { ReactiveVar } from "meteor/reactive-var";
import { Template } from "meteor/templating";
import { Meteor } from "meteor/meteor";


Template.user.onCreated(function() {
    this.isPWChanging = new ReactiveVar(false);
    this.isNameChanging = new ReactiveVar(false);
})
Template.user.events({
    "click .overall_rating > .rating" (event,template) {
        const value = Number.parseFloat($(event.target).val());
        const userToBeRated = Template.user.__helpers.get('user').call()
        Meteor.call('addRating', {
            userToBeRated: userToBeRated,
            rating: value
        },
        (err,res) => {
            if(err){
                alert(err);
            }
        });
    },
    "click #change_password_button" (event,template) {
        template.isPWChanging.set(true);
    },
    "submit #password_form" (event,template) {
        event.preventDefault();
        const target = event.target;
        const password = target.pass.value;
        Meteor.call('forceChangePassword',password);
        template.isPWChanging.set(false);
    },
    "click #cancel_change_password" (event,template) {
        event.preventDefault();
        template.isPWChanging.set(false);
    },
    "click #logout_button" (event,template) {
        if(confirm("Are you sure you want to logout")) {
            Meteor.logout();
        }
    },
    "click #change_name_button" (event,template) {
        template.isNameChanging.set(true);
    },
    "submit #change_name_form" (event,template) {
        event.preventDefault();
        const target = event.target;
        const newName = target.name.value;
        Meteor.call('changeName',newName);
        template.isNameChanging.set(false);        
    },
    "click #cancel_change_name" (event,template) {
        event.preventDefault();
        template.isNameChanging.set(false);
    },
    "click .question > .rating" (event,template) {
        const target = $(event.target);
        const value = Number.parseFloat(target.val());
        const me = UserOverview.findOne({
            username: Meteor.user().username
        });
        const userToBeRated = Template.user.__helpers.get('user').call()
        const parents = target.parents();
        for(var i = 0; i < parents.length; i++) {
            var parent = parents.get(i);
            var classList = parent.className.split(/\s+/);
            var suffix = "_question";
            for (var j = 0; j < classList.length; j++) {
                var pos = classList[j].indexOf(suffix, this.length - suffix.length);
                if(pos != -1) {
                    var prop = classList[j].substring(0,pos);
                    Meteor.call('addExtra', {
                        userToBeRated: userToBeRated,
                        category: prop,
                        rating: value
                    },
                    (err,res) => {
                        if(err) {
                            alert(err);
                        }
                    });
                }
            }
        }
    },
    "click #back_button_user" (event) {
        Router.go('/');
    }
});
Template.user.helpers({
    user:function() {
        var name = Template.instance().data.name;
        return UserOverview.findOne({username: Template.instance().data.name})
    },
    rated: function() {
        var name = Template.instance().data.name;
        var person = UserOverview.findOne({ username : name});
        q0 = person.questions[0];
        q1 = person.questions[1];
        q2 = person.questions[2];
        var obj = {};
        obj.isDisabled = false;
        var mypage = Meteor.user().username === Template.instance().data.name;
        if(mypage) {
            obj.rating = person.star;
            obj[q0] = person.attribute_rate_stars[0];
            obj[q1] = person.attribute_rate_stars[1];
            obj[q2] = person.attribute_rate_stars[2];
            obj.isDisabled = true;
            return obj;
        }
        else {
            var to = person.username;
            var rate = UserRatings.findOne({
                from: Meteor.user().username,
                to: to,
            })
            obj.rating = rate.rating || 0.0
            obj[q0] = rate.answers[0] || 0.0
            obj[q1] = rate.answers[1] || 0.0
            obj[q2] = rate.answers[2] || 0.0
        }
        return obj;
    },
    mypage: function() {
        return Meteor.user().username == Template.instance().data.name;
    },
    password_editing: function() {
        return Template.instance().isPWChanging.get();
    },
    name_changing: function() {
        return Template.instance().isNameChanging.get();
    }

})
Template.rating_hack.helpers({
    hack() {
        var data = Template.instance().data;
        if(data.for) {
            return data.obj[data.for];
        }
        else return data.obj.rating;
    },
    isDisabled() {
        return Template.instance().data.obj.isDisabled;
    }
})