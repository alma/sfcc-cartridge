'use strict';

var server = require('server');
var almaWidgetHelper = require('*/cartridge/scripts/helpers/almaWidgetHelper');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var viewData = almaWidgetHelper.getViewData(
        res,
        'cart',
        'Cart-BasketWidgetData'
    );
    res.setViewData(viewData);

    next();
});

server.get('BasketWidgetData', server.middleware.https, function (req, res, next) {
    var BasketMgr = require('dw/order/BasketMgr');
    var almaPlanHelper = require('*/cartridge/scripts/helpers/almaPlanHelper');

    var currentBasket = BasketMgr.getCurrentBasket();
    var amount = Math.round(currentBasket.totalGrossPrice.multiply(100).value);

    res.json({
        isWidgetEnabled: almaWidgetHelper.isWidgetEnabled('product'),
        paymentTypes: almaPlanHelper.getPlansForWidget(),
        amount: amount
    });

    return next();
});

module.exports = server.exports();
