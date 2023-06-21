'use strict';

/**
 * Get product id
 * @param {Object} product product
 * @returns {string} id
 */
function getProductId(product) {
    var productId = '';

    if (product.isMaster()) {
        productId = product.getID();
    } else {
        productId = product.getMasterProduct().getID();
    }

    return productId;
}

/**
 * Get categories for a product
 * @param {Object} product product
 * @returns {array} categories
 */
function getProductCategories(product) {
    var productsCategories = [];

    if (product.isMaster()) {
        productsCategories = product.getAllCategories().toArray();
    } else {
        productsCategories = product.getMasterProduct().getAllCategories().toArray();
    }

    return productsCategories;
}

module.exports = {
    getProductId: getProductId,
    getProductCategories: getProductCategories
};
