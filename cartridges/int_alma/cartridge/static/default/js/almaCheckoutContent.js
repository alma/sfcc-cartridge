window.addEventListener('DOMContentLoaded',
    function () {

        /* Uses jQuery here because context.updateCheckoutEvent is triggered with jQuery */
        jQuery('body').on(almaContext.updateCheckoutEvent, async function() {
            var response = await fetch(almaContentContext.almaUrl.getPlansRefresh);
            var data = await response.json()
            var plans = data.plans;

            console.log(plans);
        });

    });
