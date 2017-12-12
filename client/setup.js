import { Accounts } from 'meteor/accounts-base'
import { ReactiveVar } from 'meteor/reactive-var';

Template.setup.onCreated(function() {
    this.noSetup = new ReactiveVar(true);
    this.existingUser = new ReactiveVar(false);
    this.newUser = new ReactiveVar(false);
})
Template.setup.helpers({
    newUser: function() {
        return Template.instance().newUser.get();
    },
    existingUser: function() {
        return Template.instance().existingUser.get();
    },
    noSetup: function() {
        return Template.instance().noSetup.get();
    }
});
Template.setup.events({
    "click #existing_user"(event,template) {
        template.existingUser.set(true);
        template.noSetup.set(false);
    },
    "click #new_user"(event,template) {
        // Router.go('userDetails', {uname: "john"});
        template.newUser.set(true);
        template.noSetup.set(false);
    },

    "click #back_button_setup"(event,template) {
        template.newUser.set(false);
        template.existingUser.set(false);
        template.noSetup.set(true);
    },
    "submit #signup_form"(event) {
        event.preventDefault();
        const target = event.target;
        const name = target.name.value;
        const uname = target.uname.value;
        const pass = target.pass.value;
        const attribute1 = target.attribute1.value || "Understanding";
        const attribute2 = target.attribute2.value || "Honest";
        const attribute3 = target.attribute3.value || "Cool";
        if(!/^\w+$/.test(uname)) {
            alert('Username must only contain letters, numbers and underscore');
            return;
        }
        if(Meteor.call('isUserNameTaken', uname)) {
            alert("Username already taken");
            return;
        }
        Accounts.createUser({
            username: uname,
            password: pass,
                    },function(err) {
            if(err) {
                alert(err.reason);
                target.uname.value = '';
                return;
            }
        });
        Meteor.call('createAppUser',{
            "name": name,
            "uname": uname,
            "pass": pass,
            "attribute1": attribute1,
            "attribute2": attribute2,
            "attribute3": attribute3,

        },function(err,res) {
            if(err) {
                alert(err);
                return;
            }
    });
    Template.setup.noSetup = false;
    },
    "submit #login_form"(event) {
        event.preventDefault();
        const target = event.target;
        const uname = target.uname.value;
        const pass = target.pass.value;
        Meteor.loginWithPassword(uname,pass,function(err) {
            alert(err.reason);
        })
        
    }
})