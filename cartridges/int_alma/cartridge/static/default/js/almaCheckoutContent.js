window.addEventListener('DOMContentLoaded',
    function () {

    var plans = [];

        /* Uses jQuery here because context.updateCheckoutEvent is triggered with jQuery */
        jQuery('body').on(almaContext.updateCheckoutEvent, async function() {
            var response = await fetch(almaContentContext.almaUrl.getPlansRefresh);
            var data = await response.json()
            plans = data.plans;


        });


        var paymentOptions = document.querySelectorAll(".payment-options");

        paymentOptions.forEach(function (paymentOption) {
            console.log(almaContentContext.paymentOptionID);
            // console.log(plans[almaContentContext.paymentOptionID]);
        });

    });
