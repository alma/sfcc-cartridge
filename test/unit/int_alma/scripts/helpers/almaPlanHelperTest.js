// planHelpers.js unit tests

var expect = require('chai').expect;

var almaPlanHelperMock = require('../../../../mocks/helpers/almaPlanHelperMock').almaPlanHelperMock;
var setIsDeferredCaptureEnable = require('../../../../mocks/helpers/almaPlanHelperMock').setIsDeferredCaptureEnable;
var formattedPlansForCheckoutExpected = require('../../../../mocks/data/plans').formattedPlansForCheckoutExpected;
var plansForCheckout = require('../../../../mocks/data/plans').plansForCheckout;


describe('almaPlanHelper', function () {
    describe('Format plan Helper', function () {
        it('should return an array for a given plans', function () {
            setIsDeferredCaptureEnable(false);
            var formattedPlans = almaPlanHelperMock.getFormattedPlans(plansForCheckout);
            expect(formattedPlans).to.deep.equal(formattedPlansForCheckoutExpected);
        });

        it('should return have a captureMethod property for deferred capture', function () {
            setIsDeferredCaptureEnable(true);
            var formattedPlans = almaPlanHelperMock.getFormattedPlans(plansForCheckout);
            var captureMethod = '';
            formattedPlans.forEach(function (formattedPlan) {
                switch (formattedPlan.name) {
                    case 'ALMA_PNX':
                    case 'ALMA_PAY_NOW':
                        captureMethod = 'manual';
                        break;
                    default:
                        captureMethod = 'automatic';
                }
                expect(formattedPlan.plans[0]).to.have.deep.property('captureMethod', captureMethod);
            });
        });
    });
});

