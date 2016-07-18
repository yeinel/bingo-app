var messages = {
    messageWarning: "",
    messageSuccess: "",
    listMessages: [],
    snackbarContainer: document.querySelector('#snackbar-messages')
};

messages.getMessageWarning = function () {
    return messages.messageWarning;
};
messages.setMessageWarning = function (object) {
    messages.messageWarning = "El cart&oacute;n " + object.cartonName + " est&aacute; por ganar en: " + object.cartonFila + object.cartonColumna;
};

messages.showMessageWarning = function (contentAlert, messageId) {

    var htmlAlert = '<div id="' + messageId + '" class="alert-general alert alert-dismissable alert-warning mtop10">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
            '<img src="img/icons/ic_close_black_24px.svg"/></button>' +
            '<strong>' + messages.getMessageWarning() + '</strong>' +
            '</div>';
    if (jQuery.inArray(messageId, messages.listMessages) === -1) {
        contentAlert.append(htmlAlert);
        messages.listMessages.push(messageId);
    }
//    setTimeout(function () {
//         $("#"+messageId).fadeOut("slow");
//    }, 6000);
    return htmlAlert;
};

messages.getMessageSuccess = function () {
    return messages.messageSuccess;
};
messages.setMessageSuccess = function (object) {
    messages.messageSuccess = "!Bingooo, el cart&oacute;n " + object.cartonName + " gan&oacute; en: " + object.cartonFila + object.cartonColumna;
};


messages.showMessageSuccess = function (contentAlert, messageId) {
    var htmlAlert = '<div class="alert-general alert alert-dismissable alert-success mtop10">' +
            '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">' +
            '<img src="img/icons/ic_close_black_24px.svg"/></button>' +
            '<strong>' + messages.getMessageSuccess() + '</strong>' +
            '</div>';
    if (jQuery.inArray(messageId, messages.listMessages) === -1) {
        contentAlert.append(htmlAlert);
        messages.listMessages.push(messageId);
    } else {
        contentAlert.append(htmlAlert);
    }
    return htmlAlert;
};

(function() {
  'use strict';
//  var snackbarContainer = document.querySelector('#demo-snackbar-example');
//  var showSnackbarButton = document.querySelector('#demo-show-snackbar');
//  var handler = function(event) {
//    showSnackbarButton.style.backgroundColor = '';
//  };
//  showSnackbarButton.addEventListener('click', );
}());

messages.showSnackbar = function(message,timeout,actiontext,handler) {
    'use strict';
    var data = {
      message: message,
      timeout: timeout,
      actionHandler: handler,
      actionText: actiontext
    };
    messages.snackbarContainer.MaterialSnackbar.showSnackbar(data);
  };