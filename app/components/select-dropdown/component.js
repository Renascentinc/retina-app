import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-filter'],

    displayUsers: false,

    actions: {
        optionSelected(target) {
            this.get('onUpdate')(target);
        }
    }
});