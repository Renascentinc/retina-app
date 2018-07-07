import Ember from 'ember';

export default Ember.Component.extend({
    classNames: ['search-header'],

    showSelectTools: false,

    userOption: Ember.computed(function() {
        if (this.get('showSelectTools')) {
            return 'restricteduser';
        }

        return 'user';
    }),

    clearFilterParams() {
        this.set('query.status', '');
        this.set('query.brand', '');
        this.set('query.type', '');
        this.set('query.userID', '');
    },

    actions: {
        updateFilters(target) {
            this.set('usingFuzzySearch', false);

            if (target.getAttribute('name') === 'status') {
                this.set('query.status', target.value);

            } else if (target.getAttribute('name') === 'brand') {
                this.set('query.brand', target.value);

            } else if (target.getAttribute('name') === 'type') {
                this.set('query.type', target.value);

            } else if (target.getAttribute('name') === 'owner') {
                this.set('query.userID', parseInt(target.value));
            }
            this.get('onFilterChange')();
        }
    }
});