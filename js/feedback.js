'use strict';

const DOGFOOD_URL = 'http://owd.tid.es/feedback';

var Feedback = {  
  init: function fb_init() {
    var done = document.getElementById('done');
    done.addEventListener('click', this.send.bind(this));
  },

  reset: function fb_reset() {
    document.getElementById('feedback-textarea').value = '';
  },

  send: function fb_send() {
    if (!navigator.onLine) {
      window.alert(navigator.mozL10n.get('no-internet'));
      return;
    }

    var contact = document.getElementById('contact').value;

    var mozMobileConnection = navigator.mozMobileConnection;
    if (!mozMobileConnection) { 
      window.alert(navigator.mozL10n.get('error'));
      return;
    }

    var req = mozMobileConnection.sendMMI('*#06#');
    req.onsuccess = (function onIMEI() {      
      var formData = new FormData();
      formData.append('build_id', navigator.buildID);

      var comment = document.getElementById('feedback-textarea');
      formData.append('comment', comment.value);

      var imei = req.result;
      if (imei) {
        formData.append('imei', imei);
      }

      if (contact) {
        formData.append('contact', contact);
      }

      var xhr = new XMLHttpRequest();
      xhr.open('POST', DOGFOOD_URL);
      xhr.send(formData);

      this.reset();
    }).bind(this);
    req.onerror = function onerror() {
      window.alert(navigator.mozL10n.get('error'));
      return;
    }
  }
};

window.addEventListener('load', function fbLoad(evt) {
  window.removeEventListener('load', fbLoad);
  Feedback.init();
});
