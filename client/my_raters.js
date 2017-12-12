import { Meteor } from "meteor/meteor";
import { userInfo } from "os";
import { ReactiveVar } from "meteor/reactive-var";

Template.my_raters.onCreated(function onCreated() {
    Meteor.subscribe('ratings');
    Meteor.subscribe('overview',{username: Meteor.user().username})
    this.raters = new ReactiveVar(null);
})
Template.my_raters.helpers({
    raters: function() {
        var uname = Meteor.user().username;
        var transactions = UserRatings.find({
            to: uname
        },{sort: {timestamp: -1}});
        var myself = UserOverview.findOne({
            username: uname
        });
        var i = 0;
        var humans = [];
        transactions.forEach(transaction => {
            var raterOverview = UserOverview.findOne({
                username: transaction.from
            })
            given_answers = [];
            for(var i = 0; i < 3; i++) {
                var temp = {
                    question: myself.questions[i],
                    answer: transaction.answers[i]
                };
                given_answers.push(temp);
            }
            var human = {
                his_star : raterOverview.star,
                his_username: raterOverview.username,
                his_name: raterOverview.name,
                given_rating: transaction.rating,
                given_answers: given_answers,
                timestamp: transaction.timestamp
            };
            humans.push(human);
        });
        if(Template.instance().raters.get() != humans) {
            return humans;
        }
        return null;
    }
});