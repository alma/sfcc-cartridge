var Site = require('dw/system/Site');

/**
 * return the deferred capture activation field value
 * @return {bool} the field value
 *
 */
function isDeferredCaptureEnable() {
    return Site.getCurrent()
        .getCustomPreferenceValue('ALMA_Deferred_Capture_Activation');
}

/**
 * return the deferred capture event title field value
 * @returns {string} event title
 */
function getDeferredCaptureEventTitle() {
    return Site.getCurrent()
        .getCustomPreferenceValue('ALMA_Deferred_Capture_Event_Title');
}

module.exports = {
    isDeferredCaptureEnable: isDeferredCaptureEnable,
    getDeferredCaptureEventTitle: getDeferredCaptureEventTitle
};
