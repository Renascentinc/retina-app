import Ember from 'ember';
import config from '../config/environment';

export default Ember.Controller.extend({
    _status: null,

    _brand: null,

    _type: null,

    _userID: null,

    _query: Ember.computed(function() {
        return {
            status: this.getWithDefault('_status', ''),
            brand: this.getWithDefault('_brand', ''),
            type: this.getWithDefault('_type', ''),
            userID: this.getWithDefault('_userID', '')
        };
    }).volatile(),

    clearFilterParams() {
        this.set('_status', null);
        this.set('_brand', null);
        this.set('_type', null);
        this.set('_userID', null);
    },

    actions: {
        updateSearch(target) {
            Ember.$('.search-box').val('');

            if (target.getAttribute('name') === 'status') {
                this.set('_status', target.value);

            } else if (target.getAttribute('name') === 'brand') {
                this.set('_brand', target.value);

            } else if (target.getAttribute('name') === 'type') {
                this.set('_type', target.value);

            } else if (target.getAttribute('name') === 'owner') {
                this.set('_userID', (target.value !== '') ? parseInt(target.value) : target.value);
            }

            let set = this.set.bind(this, 'model.tools');
            Ember.$.getJSON(`${config.APP.API_URL}/${config.APP.API_NAMESPACE}/search`, this.get('_query')).then(set);
        },

        fuzzySearch(value) {
            this.clearFilterParams();
            let set = this.set.bind(this, 'model.tools');

            if (value !== '') {
                Ember.$.getJSON(`${config.APP.API_URL}/${config.APP.API_NAMESPACE}/search`, { parameter: value }).then(set);
            } else {
                Ember.$.getJSON(`${config.APP.API_URL}/${config.APP.API_NAMESPACE}/search?status=&userID=&type=&brand=`).then(set);
            }
        }
    }
});
