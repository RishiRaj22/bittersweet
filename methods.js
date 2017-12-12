import { Accounts } from 'meteor/accounts-base'
import { Meteor } from 'meteor/meteor';
Meteor.methods({
    'createAppUser'({name,uname,pass,attribute1,attribute2,attribute3}){
        UserOverview.insert({
            name: name,
            username: uname,
            rating : 0.0,
            star: 0.0,
            rater_count: 0.0,
            attribute_rates: [0.0,0.0,0.0],
            attribute_rater_counts: [0,0,0],
            attribute_rate_stars: [0.0,0.0,0.0],
            questions: [attribute1,attribute2,attribute3]
        });
    },


    'forceChangePassword'(password) {
        var userid = Meteor.userId();
        if(!userid)
            return;
        Accounts.setPassword(userid,password,);
    },


    'changeName'(newName) {
        var user = UserOverview.findOne({username: Meteor.user().username});
        console.log("[CHANGE_NAME]", "Name of" + user.username +" changed from " + user.name + " to " + newName);
        UserOverview.update(user._id, {$set: {name: newName}});
    },


    'forceChangePassword'(password) {
        var userid = Meteor.userId();
        if(!userid)
            return;
        Accounts.setPassword(userid,password,);
    },


    'deleteAccount'() {
        throw new Meteor.Error("Not supported");
        var user = Meteor.user();
        console.log("id",user._id);
        Meteor.users.remove(user._id);
        UserOverview.deleteOne({username: username});
        var givenTo = UserRatings.find({
            from: username
        });
        console.log(givenTo);
    },


    'addRating'({userToBeRated,rating}) {
        var userid = Meteor.userId();
        if(!userid)
            return;
        var me = Meteor.user();
        var from = me.username;
        var to = userToBeRated.username;
        if(typeof to != "string" || typeof rating != "number" || isNaN(rating) || rating < 0 || rating > 5) {
            throw new Meteor.Error("Invalid rating");
        }
       if(from == to) throw new Meteor.Error("Rating error","You can't rate yourself");
        var exists = UserRatings.findOne({
            from: from,
            to: to,
        })
        if(exists) {
            var oldRating = exists.rating;
            var diff = rating - oldRating; 

            var assumption = true;
            for(var i = 0; i < 3; i++) {
                if(exists.answers[i] != 0) {
                    assumption = false;
                    break;
                }
            }
            if(rating == 0 && assumption) {
                console.log("UserRatings :","[REMOVE]");                
                UserRatings.remove(exists._id)
            }
            else {
                console.log("UserRatings :","[SET] " + "rating: " + rating);                
                UserRatings.update(exists._id, {
                    $set: {
                        rating: rating,
                        timestamp: Date.now()
                    }
                })
            }
            var oldRatingFlag = oldRating === 0 ? 1 : 0;
            var newRatingFlag = rating === 0 ? 1 : 0;
            var rater_diff = oldRatingFlag - newRatingFlag;

            console.log("UserOverView :","[INCREMENT] " + "rating: " + diff + " rater_count: " + rater_diff);            
            UserOverview.update(userToBeRated._id, {
                $inc: {
                    rating: diff,
                    rater_count: rater_diff
                }
            });
        }
        else if(rating!= 0) {
            console.log("UserRatings :","[ADD]" + "from: " + from + " to: " + to + " rating: " + rating + " answers: [0,0,0]");                            
            UserRatings.insert({
                from: from,
                to: to,
                rating: rating,
                timestamp: Date.now(),
                answers: [0,0,0]
            });
            console.log("UserOverView :","[UPDATE] " + "rating: " + rating);                            
            UserOverview.update(userToBeRated._id, {
                $inc: {
                    rating: rating,
                    rater_count : 1
                }
            })
        }
        var updatedUser = UserOverview.findOne(userToBeRated._id);
        var star = updatedUser.rating/updatedUser.rater_count;
        if(updatedUser.rater_count === 0) {
            star = 0;
        }
        star = parseFloat(star.toFixed(1));       
        UserOverview.update(userToBeRated._id, {
            $set: {
                star: star
            }
        })
    },

    
    'addExtra'({userToBeRated,category,rating}) {
        var me = Meteor.user();
        var from = me.username;
        var to = userToBeRated.username;        
        if(me == false) {
            throw new Meteor.Error("not logged in")
        }
        if(typeof to != "string" || typeof category != "string" || typeof rating != "number" || isNaN(rating)|| rating < 0 || rating > 5) {
            throw new Meteor.Error("Invalid rating");
        }
        var choice = 0;
        if(category == userToBeRated.questions[1]) choice = 1;
        else if(category == userToBeRated.questions[2]) choice = 2;
       if(from == to) throw new Meteor.Error("Rating error","You can't rate yourself");
        var exists = UserRatings.findOne({
            from: from,
            to: to,
        })
        var erating = "attribute_rates." + choice
        var eanswers = "answers." + choice
        var erater_count = "attribute_rater_counts." + choice
        var estars = "attribute_rate_stars." + choice
        if(exists) {
            var oldRating = exists.answers[choice];
            var diff = rating - oldRating;
            var assumption = (exists.rating == 0);
            if(assumption) { 
                for(var i = 0; i < 3; i++) {
                    if(exists.answers[i] !== 0 && i!== choice) {
                        assumption = false;
                        break;
                    }
                }
            }
            if(rating == 0 && assumption) {
                console.log("UserRatings :","[REMOVE]");                
                UserRatings.remove(exists._id)
            }
            else {
                var tobj = {};
                tobj[eanswers] = rating;
                tobj.timestamp = Date.now();
                console.log("UserRatings :","[SET]",eanswers + ": " + tobj[eanswers]);                                     
                UserRatings.update(exists._id, {
                    $set : tobj
                });
            }
            var oldRatingFlag = oldRating === 0 ? 1 : 0;
            var newRatingFlag = rating === 0 ? 1 : 0;
            var rater_diff = oldRatingFlag - newRatingFlag;
            var tobj = {};
            tobj[erating] = diff;
            tobj[erater_count] = rater_diff;
            console.log("UserOverview :","[INCREMENT]",erating + ": " + tobj[erating] + " " + erater_count + ": " + tobj[erater_count]);
            UserOverview.update(userToBeRated._id, {
                $inc: tobj 
            })
        }
        else if(rating != 0){
            var arr = [0,0,0];
            arr[choice] = rating;
            console.log("UserRatings :","[INSERT] " + "from:" + from + " to:" + to + " rating:" + 0 + " answers" + arr);
            UserRatings.insert({
                from: from,
                to: to,
                rating: 0,
                timestamp: Date.now(),
                answers: arr
            });
            var tobj = {};
            tobj[erating] = rating;
            tobj[erater_count] = 1;
            UserOverview.update(userToBeRated._id, {
                $inc: tobj
            })
        }
        var updatedUser = UserOverview.findOne(userToBeRated._id);
        var star = updatedUser.attribute_rates[choice]/updatedUser.attribute_rater_counts[choice];
        if(updatedUser.attribute_rater_counts[choice] === 0) {
            star = 0;
        }
        star = parseFloat(star.toFixed(1));           
        var tobj = {};
        tobj[estars] = star;
        UserOverview.update(userToBeRated._id, {
            $set:  tobj
        })
    },


    'isUserNameTaken'(name) {
        var exists = Meteor.users.findOne({username: name})
        if(exists === undefined) {
            return true;
        }
        return false;
    }
})