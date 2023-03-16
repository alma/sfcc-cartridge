'use strict';

var server = require('server');
var almaWidgetHelper = require('*/cartridge/scripts/helpers/almaWidgetHelper');

server.extend(module.superModule);

server.append('Show', function (req, res, next) {
    var viewData = almaWidgetHelper.getViewData(
        res,
        'product',
        'Product-ProductWidgetData'
    );
    res.setViewData(viewData);

    next();
});

server.get('ProductWidgetData', server.middleware.https, function (req, res, next) {
    var ProductFactory = require('*/cartridge/scripts/factories/product');
    var almaPlanHelper = require('*/cartridge/scripts/helpers/almaPlanHelper');
    var almaHelpers = require('*/cartridge/scripts/helpers/almaHelpers');

    var params = {
        method: 'GET',
        pid: req.querystring.pid
    };
    var product = ProductFactory.get(params);

    var isWidgetEnabled = almaHelpers.haveExcludedCategory([req.querystring.pid]) ? false : almaWidgetHelper.isWidgetEnabled('product');

    var productQte = req.querystring.qte;
    var amount = Math.round(product.price.sales.value * productQte * 100);
    res.json({
        isWidgetEnabled: isWidgetEnabled,
        paymentTypes: almaPlanHelper.getPlansForWidget(),
        amount: amount,
        product: product
    });
    return next();
});

module.exports = server.exports();
