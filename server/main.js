import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
Meteor.startup(() => {
    Meteor.publish('ratings',function() {
        var ratings = UserRatings.find({
            $or : [
                { to: Meteor.user().username },
                { from: Meteor.user().username }
            ]
        });
        return ratings;
    });

    Meteor.publish('overview',function(param) {
        var username = param.username;
        var usernames = param.usernames;
        if(usernames && Object.prototype.toString.call(usernames) === '[object Array]') {
            var overview = UserOverview.find({
                $or: usernames
            })
            return overview;
        }
        var overview = UserOverview.find({
            username: username
        });
        return overview;
    })
});
