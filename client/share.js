Template.share.helpers({
    user() {
        return Meteor.user().username;
    }
})
Template.share.events({
    "click #back_button_share"() {
        Router.go('/')
    }
})