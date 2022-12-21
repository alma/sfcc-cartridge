window.addEventListener('DOMContentLoaded',
    function () {
        var fragments = new Alma.Fragments(context.merchantId, {
            mode: context.almaMode === 'LIVE' ? Alma.ApiMode.LIVE : Alma.ApiMode.TEST,
        });

        var checkoutEvents = [];

        function addCheckoutEvent(event) {
            document
                .querySelector(context.selector.submitPayment)
                .addEventListener('click', event)
        }

        function removeCheckoutEvents() {
            let lastEvent;
            let event = checkoutEvents.shift()
            while (event) {
                lastEvent = event;
                document
                    .querySelector(context.selector.submitPayment)
                    .removeEventListener('click', event)

                event = checkoutEvents.shift()
            }

            if (lastEvent) {
                checkoutEvents.push(lastEvent);
            }
        }

        var paymentOptions = document.querySelectorAll(context.selector.paymentOptions);

        for (const paymentOption of paymentOptions) {
            paymentOption.addEventListener('click', removeCheckoutEvents)
        }

        /**
         * Returns the data formatted for inpage payment
         * @param  {Object} data an alma plan
         * @param  {number} installments_count number of installments
         * @param  {number} deferred_days number of days before the 1st payment
         * @returns {Object}
         */
        function getPaymentData(data, installments_count, deferred_days) {
            return {
                payment: {
                    purchase_amount: Number(context.payment.purchaseAmount),
                    installments_count: installments_count,
                    deferred_days: deferred_days,
                    deferred_months: 0,
                    return_url: context.payment.returnUrl,
                    ipn_callback_url: context.payment.ipnCallbackUrl,
                    customer_cancel_url: context.payment.customerCancelUrl,
                    locale: data.locale.split("_")[0],
                    shipping_address: data.shipping_address,
                    deferred: data.isEnableOnShipment ? "trigger" : "",
                    deferred_description: data.isEnableOnShipment ? decodeHtml(context.payment.deferredDescription) : "",
                    custom_data: {
                        cms_name: context.payment.customData.cmsName,
                        cms_version:context.payment.customData.cmsVersion,
                        alma_plugin_version:context.payment.customData.almaPluginVersion
                    }
                },
                customer: data.customer
            };
        }

        /**
         * Build an inpage payment form to allow the customer to pay
         * This option is only available when installments_count is 2 or 3
         * @param  {string} container the div elem where the form will be built
         * @param  {number} installments_count number of installments
         * @param  {number} deferred_days number of days before the 1st payment
         */
        async function renderInPage(
            container,
            installments_count,
            deferred_days
        ) {
            const response = await fetch(context.almaUrl.dataUrl + '?installment=' + installments_count);
            const data = await response.json();

            var paymentData = getPaymentData(data, installments_count, deferred_days)

            const paymentForm = fragments.createPaymentForm(paymentData, {
                showPayButton: false,
                onSuccess: function (returnedData) {
                    window.location = returnedData.return_url;
                },
                onFailure: function (returnedData) {
                    addCheckoutEvent(checkoutEvents.at(-1));
                },
                onPopupClose: function (returnedData) {
                    addCheckoutEvent(checkoutEvents.at(-1));
                },
            })

            await paymentForm.mount(document.getElementById(container));
            return paymentForm;
        }

        /**
         * SFCC resource needs to be decoded to be given to Alma Fragment
         * @param {string} ressource the message to decode
         * @returns {string} the decoded string
         */
        function decodeHtml(ressource) {
            var txt = document.createElement("textarea");
            txt.innerHTML = ressource;
            return txt.value;
        }

        /*
         * Redirect to Alma website to allow the customer to pay
         * @param  {number} installments_count number of installments
         * @param  {number} deferred_days number of days before the 1st payment
         */
        async function redirectToPaymentPage(installments_count, deferred_days) {
            const response = await fetch(
                context.almaUrl.createPaymentUrl + '?deferred_days=' + deferred_days + '&installments=' + installments_count,
                { method: 'POST' }
            );
            const body = await response.json();
            window.location = body.url;
        }

        /**
         * Open a payment option and hide the others
         * @param  {Object} t a JS selector
         */
        async function toggle(t) {
            removeCheckoutEvents();
            const activeElt = document.querySelector("#" + t.id + " .fa");
            const isAlreadyOpen = activeElt.classList.contains("fa-chevron-down");

            const icons = document.querySelectorAll(".alma-payment-method .fa");
            [].forEach.call(icons, function (icon) {
                icon.classList.remove("fa-chevron-down");
            });

            if (!isAlreadyOpen) {
                activeElt.classList.add("fa-chevron-down");

                const installments_count = parseInt(t.getAttribute('data-installments'));
                const deferred_days = parseInt(t.getAttribute('data-deferred-days'));
                const alma_payment_method = t.getAttribute('data-alma-payment-method');
                const in_page = t.getAttribute('data-in-page') === 'true';

                document.body.style.cursor = 'wait';
                if (in_page) {
                    await renderInPage(t.id + "_fragment", installments_count, deferred_days)
                        .then((paymentForm) => {
                            var checkoutFragmentCall = async function () {
                                const ajaxResponse = await fetch(context.almaUrl.checkoutFragmentUrl + '?pid=' + paymentForm.currentPayment.id + '&amount=' + paymentForm.currentPayment.purchase_amount + '&alma_payment_method=' + alma_payment_method);
                                const orderFragment = await ajaxResponse.json();
                                if (ajaxResponse.status === 200) {
                                    paymentForm.pay();
                                    removeCheckoutEvents();
                                }
                                if (ajaxResponse.status === 400) {
                                    addMismatchMessage(orderFragment)
                                }
                                if (ajaxResponse.status === 500) {
                                    addPaymentMethodNotFound(orderFragment)
                                }
                            }

                            checkoutEvents.push(checkoutFragmentCall);

                            addCheckoutEvent(checkoutFragmentCall);
                        });
                } else {
                    activeElt.parentNode.innerHTML = '<div class="alma-lds-ring"><div></div><div></div><div></div><div></div></div>';
                    await redirectToPaymentPage(installments_count, deferred_days);
                }
                document.body.style.cursor = 'default';

            } else {
                await document.getElementById(t.id + "_fragment").firstChild.remove();
            }
        }

        /**
         * Add on click event callback
         * @param  {Object} event a JS event
         */
        async function handlePaymentMethodClick(event) {
            var t = event.target;
            while (t && !(t.classList && t.classList.contains("alma-payment-method"))) {
                t = t.parentNode;
            }

            await toggle(t);
        }

        const almaPaymentMethods = document.querySelectorAll(".alma-payment-method");
        for (let pm of almaPaymentMethods) {
            pm.addEventListener("click", async function (e) {
                 await handlePaymentMethodClick(e);
            });
        }

        function addMismatchMessage(orderFragment) {
            var errorMessagePosition = document.querySelectorAll(context.selector.fragmentErrors)[0];
            errorMessagePosition.before(createMismatchMessage(orderFragment));
        }

        function createMismatchMessage(orderFragment) {
            var errorLink = document.createElement('a');
            var errorLinkText = document.createTextNode("Please refresh the page to try to pay again.");
            errorLink.href = '';
            errorLink.appendChild(errorLinkText);


            var errorMismatchMessage = document.createTextNode(orderFragment.error);
            var errorDiv = document.createElement('div');
            errorDiv.classList.add('col-12', 'alma-error-message');
            errorDiv.id = 'mismatch-message';
            errorDiv.appendChild(errorMismatchMessage);
            errorDiv.appendChild(document.createElement('br'));
            errorDiv.appendChild(errorLink);
            return errorDiv;
        }

        function addPaymentMethodNotFound(orderFragment) {
            var errorMessagePosition = document.querySelectorAll(context.selector.fragmentErrors)[0];
            errorMessagePosition.before(createPaymentMethodNotFound(orderFragment));
        }

        function createPaymentMethodNotFound(orderFragment) {
            var errorMismatchMessage = document.createTextNode(orderFragment.error);
            var errorDiv = document.createElement('div');
            errorDiv.classList.add('col-12', 'alma-error-message');
            errorDiv.id = 'payment-method-not-found-message';
            errorDiv.appendChild(errorMismatchMessage);
            errorDiv.appendChild(document.createElement('br'));
            return errorDiv;
        }

    });
