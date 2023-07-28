function getAddress() {
    return {
        firstName: 'Amanda',
        lastName: 'Jones',
        address1: '65 May Lane',
        address2: '',
        city: 'Allston',
        postalCode: '02135',
        countryCode: { value: 'us' },
        phone: '617-555-1234',
        stateCode: 'MA',

        setFirstName: function (firstNameInput) {
            this.firstName = firstNameInput;
        },
        setLastName: function (lastNameInput) {
            this.lastName = lastNameInput;
        },
        setAddress1: function (address1Input) {
            this.address1 = address1Input;
        },
        setAddress2: function (address2Input) {
            this.address2 = address2Input;
        },
        setCity: function (cityInput) {
            this.city = cityInput;
        },
        setPostalCode: function (postalCodeInput) {
            this.postalCode = postalCodeInput;
        },
        setStateCode: function (stateCodeInput) {
            this.stateCode = stateCodeInput;
        },
        setCountryCode: function (countryCodeInput) {
            this.countryCode.value = countryCodeInput;
        },
        setPhone: function (phoneInput) {
            this.phone = phoneInput;
        }
    };
}

function getCurrentBasket() {
    return {
        getDefaultShipment: function () {
            return getAddress();
        },
        getBillingAddress: function () {
            return getAddress();
        },
        getCustomer: function () {
            return {
                profile: 'profile_value'
            };
        },
        getCustomerEmail: function () {
            return 'email@email.com';
        },
        getAllProductLineItems: function () {
            return {
                toArray: function () {
                    return [];
                }
            };
        },
        totalGrossPrice: {
            value: 250.00,
            multiply: function () {
                return {
                    value: 25000
                };
            }
        }
    };
}

module.exports = {
    getCurrentBasket: getCurrentBasket
};
