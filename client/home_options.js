Template.home_options.events({
    'click #share_button_home' (event,template) {
        Router.go('/share');
    },
    'click #settings_button_home' (event,template) {
        Router.go('/users/' + Meteor.user().username);
    }
})