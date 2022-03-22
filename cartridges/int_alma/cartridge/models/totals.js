'use strict';

var base = module.superModule;

/**
 * totals
 * @param {Object} lineItemContainer lineItemContainer param
 */
function totals(lineItemContainer) {
    base.call(this, lineItemContainer);

    this.grandTotalValue = lineItemContainer.totalGrossPrice.value;
}

module.exports = totals;
