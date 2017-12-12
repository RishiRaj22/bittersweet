Template.searchbar.events({
    "submit #user_search"(event) {
        event.preventDefault();
        const name = event.target.name.value;
        Router.go('/users/' + name);
    }
})