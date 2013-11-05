'use strict';

const DOGFOOD_URL = 'http://openwebdevice.com:9000';

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

    // @type: error || success
    var message = function(type) {
        var status = document.getElementById(type+'Msg');
        status.classList.remove('hidden');
        var delay = setTimeout(function() {
         status.classList.add('hidden');
        }, 2000);
    }

    var xhr = new XMLHttpRequest({mozSystem: true});
    xhr.open('POST', DOGFOOD_URL);
    xhr.addEventListener('load', function() {
      if (xhr.status === 200 || xhr.status === 0) {
        message("success");
      } else {
        message("error");
      }
    });
    xhr.onerror = function () {
      if (xhr.status === 0) {
        message("success");
        return;
      }
      message("error");
    };
    var formData = new FormData();
      formData.append('build_id', navigator.buildID);
        if (contact) {
          formData.append('contact', contact);
        }
      var comment = document.getElementById('feedback-textarea');
      formData.append('comment', comment.value);

    xhr.send(formData);
    this.reset();
  }
}

window.addEventListener('load', function fbLoad(evt) {
  window.removeEventListener('load', fbLoad);
  Feedback.init();
});
