'use strict';

var server = require('server');

/**
 * Fetch merchant related infos
 * @returns {Object} merchant data
 */
function getAlmaInfo() {
    var almaHelpers = require('*/cartridge/scripts/helpers/almaHelpers');

    return {
        merchantId: almaHelpers.getMerchantId(),
        mode: almaHelpers.getMode(),
        isAlmaEnable: almaHelpers.isAlmaEnable(),
        isEnableOnShipment: almaHelpers.isAlmaOnShipment()
    };
}


/**
 * Fetch all the Alma URL needed by frontend
 * @returns {Object} string urls
 */
function getAlmaUrls() {
    var URLUtils = require('dw/web/URLUtils');

    return {
        return_url: URLUtils.http('Alma-PaymentSuccess').toString(),
        ipn_callback_url: URLUtils.http('Alma-IPN').toString(),
        customer_cancel_url: URLUtils.https('Alma-CustomerCancel').toString(),
        data_url: URLUtils.http('Alma-BasketData').toString(),
        create_payment_url: URLUtils.https('Alma-CreatePaymentUrl').toString(),
        order_amount_url: URLUtils.http('Alma-OrderAmount').toString(),
        checkout_fragment_url: URLUtils.http('Alma-FragmentCheckout').toString(),
        plans_url: URLUtils.http('Alma-Plans').toString()
    };
}

server.extend(module.superModule);

server.append('Begin', function (req, res, next) {
    var Resource = require('dw/web/Resource');
    var getLocale = require('*/cartridge/scripts/helpers/almaHelpers').getLocale;
    var almaPlanHelper = require('*/cartridge/scripts/helpers/almaPlanHelper');
    var almaConfigInfo = getAlmaInfo();

    var BasketMgr = require('dw/order/BasketMgr');
    var currentBasket = BasketMgr.getCurrentBasket();

    // if alma isn't activated don't even bother to call any API
    if (!almaConfigInfo.isAlmaEnable) {
        next();
        return;
    }

    var viewData = Object.assign(
        res.getViewData(),
        almaConfigInfo,
        getAlmaUrls(),
        {
            currencyCode: currentBasket.currencyCode,
            purchase_amount: Math.round(currentBasket.totalGrossPrice.multiply(100).value),
            plans: almaPlanHelper.getPlansForCheckout(getLocale(req), currentBasket),
            fragment_on_close_message: Resource.msg('alma.fragment_on_close_message', 'alma', null),
            fragment_on_failure_message: Resource.msg('alma.fragment_on_failure_message', 'alma', null)
        }
    );

    res.setViewData(viewData);
    next();
});


module.exports = server.exports();
