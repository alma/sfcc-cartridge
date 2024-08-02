function getSfccVersion() {
    return '4.0.0';
}

function formatCustomerData() {
    return {
        first_name: "'shippingAddress.first_name'",
        last_name: 'shippingAddress.last_name',
        email: 'customerEmail',
        phone: 'shippingAddress.phone'
    };
}

function getMode() {
    return 'TEST';
}

module.exports = {
    getSfccVersion: getSfccVersion,
    formatCustomerData: formatCustomerData,
    getMode: getMode
};
