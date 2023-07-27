var Site = require('dw/system/Site');

/**
 * return the deferred capture activation field value
 * @return {bool} the field value
 *
*/
function isDeferredCaptureEnable() {
    return Site.getCurrent().getCustomPreferenceValue('ALMA_Deferred_Capture_Activation');
}

module.exports = {
    isDeferredCaptureEnable: isDeferredCaptureEnable
};
