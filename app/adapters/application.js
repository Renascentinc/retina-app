import DS from 'ember-data';
import config from '../config/environment';
import LFAdapter from 'ember-localforage-adapter/adapters/localforage';

export default DS.JSONAPIAdapter.extend({
// 	host: config.APP.api_url,
  host: 'https://retina-api-testing.azurewebsites.net',
	namespace: config.APP.api_namespace,
    authorizer: 'authorizer:oauth2',

    ajaxOptions: function ajaxOptions() {
      let hash = this._super.apply(this, arguments);

      if (hash.contentType) {
        hash.contentType = 'application/json';
      }

      let beforeSend = hash.beforeSend;
      hash.beforeSend = function (xhr) {
        xhr.setRequestHeader('Accept', 'application/json');
        if (beforeSend) {
          beforeSend(xhr);
        }
      };

      return hash;
    }
});
