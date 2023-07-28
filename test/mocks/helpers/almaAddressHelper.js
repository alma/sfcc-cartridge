function formatAddress() {
    return {
        title: 'address.jobTitle',
        first_name: 'address.lastName',
        last_name: 'address.firstName',
        company: 'address.companyName',
        line1: 'address.address1',
        line2: 'address.address2',
        postal_code: 'address.postalCode',
        city: 'address.city',
        country: 'address.countryCode.value',
        state_province: 'address.stateCode',
        phone: 'address.phone'
    };
}

module.exports = {
    formatAddress: formatAddress
};
