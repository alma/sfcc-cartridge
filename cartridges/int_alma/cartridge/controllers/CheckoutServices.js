'use strict';

var server = require('server');
var csrfProtection = require('*/cartridge/scripts/middleware/csrf');
var Logger = require('dw/system/Logger').getLogger('alma');

server.extend(module.superModule);

server.append(
    'SubmitPayment',
    server.middleware.https,
    csrfProtection.validateAjaxRequest,
    function (req, res, next) {
        var BasketMgr = require('dw/order/BasketMgr');
        var currentBasket = BasketMgr.getCurrentBasket();
        Logger.warn('GetViewData {0}', [JSON.stringify(res.getViewData())]);
        var viewData = Object.assign(
            res.getViewData(),
            {
                basketID: currentBasket.getUUID()
            }
        );
        // Logger.warn('submit payment append {0}', [currentBasket]);
        res.setViewData(viewData);

        next();
    }
);

module.exports = server.exports();
