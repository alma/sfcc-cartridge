window.addEventListener('DOMContentLoaded',
    function () {

        var purchase_amount = Number(almaContext.payment.purchaseAmount);

        function assignAlmaElementsValues(plan) {
            for (const [id, property] of Object.entries(plan.properties)) {
                if (id === 'img') {
                    var elementTabImg = document.getElementById(`${'alma-tab-' + plan.key + '-' + id}`);
                    if (elementTabImg) {
                        elementTabImg.textContent = property.toString();
                    }
                }

                if (id === 'credit') {
                    for (const [creditId, creditProperties] of Object.entries(property)) {
                        var elementCredit = document.getElementById(`${plan.key + '-' + creditId}`);
                        if (elementCredit) {
                            elementCredit.textContent = creditProperties.toString();
                        }
                    }
                    continue;
                }
                var element = document.getElementById(`${plan.key + '-' + id}`);
                if (element) {
                    element.textContent = property.toString();
                }
            }
        }

        /* Uses jQuery here because context.updateCheckoutViewEvent is triggered with jQuery */
        jQuery('body')
            .on(almaContext.updateCheckoutViewEvent, async function () {
                var checkoutBtn = document.querySelector(almaContext.selector.submitPayment);
                var nextStepButton = checkoutBtn.parentElement.parentElement;
                nextStepButton.classList.add('next-step-button');
                checkoutBtn.setAttribute('type', 'submit');


                var responseOrderAmount = await fetch(almaContext.almaUrl.orderAmountUrl);
                var dataOrderAmount = await responseOrderAmount.json();
                purchase_amount = dataOrderAmount.purchase_amount;

                var response = await fetch(almaContext.almaUrl.plans_url);
                var data = await response.json();
                almaPaymentMethods = data.plans;

                for (const [indexPaymentMethod, almaPaymentMethod] of Object.entries(almaPaymentMethods)) {
                    var name = almaPaymentMethod.name;
                    var plans = almaPaymentMethod.plans;

                    for (const [indexPlan, plan] of Object.entries(plans)) {
                        var icons = document.querySelectorAll(".alma-payment-method .fa");
                        [].forEach.call(icons, function (icon) {
                            icon.classList.remove("fa-chevron-down");
                        });

                        document.getElementById(`${plan.key + '-inpage'}`).innerHTML = "";

                        if (plan.payment_plans) {
                            document.getElementById(plan.key)
                                .removeAttribute('hidden');
                            document.getElementById(`${'alma-tab-' + plan.key + '-img'}`)
                                .removeAttribute('hidden');

                            assignAlmaElementsValues(plan);
                            continue;
                        }
                        document.getElementById(plan.key)
                            .setAttribute('hidden', 'hidden');
                        document.getElementById(`${'alma-tab-' + plan.key + '-img'}`)
                            .setAttribute('hidden', 'hidden');

                    }

                    if (almaPaymentMethod.hasEligiblePaymentMethod) {
                        document.getElementById(`${'alma-tab-' + name}`)
                            .removeAttribute('hidden');
                        continue;
                    }
                    document.getElementById(`${'alma-tab-' + name}`)
                        .setAttribute('hidden', 'hidden');

                }

            });

        var checkoutFragmentCallInProgress = false;

        var checkoutEvents = [];

        function addCheckoutEvent(event) {
            document
                .querySelector(almaContext.selector.submitPayment)
                .addEventListener('click', event);
        }

        function removeCheckoutEvents() {
            var lastEvent;
            var event = checkoutEvents.shift();
            while (event) {
                lastEvent = event;
                document
                    .querySelector(almaContext.selector.submitPayment)
                    .removeEventListener('click', event);

                event = checkoutEvents.shift();
            }

            if (lastEvent) {
                checkoutEvents.push(lastEvent);
            }
        }

        var paymentOptions = document.querySelectorAll(almaContext.selector.paymentOptions);

        paymentOptions.forEach(function (paymentOption) {
            paymentOption.addEventListener('click', removeCheckoutEvents);
        });

        /*
         * Redirect to Alma website to allow the customer to pay
         * @param  {number} installments_count number of installments
         * @param  {number} deferred_days number of days before the 1st payment
         */
        async function redirectToPaymentPage(installments_count, deferred_days) {
            var response = await fetch(
                almaContext.almaUrl.createPaymentUrl + '?deferred_days=' + deferred_days + '&installments=' + installments_count,
                { method: 'POST' }
            );
            var body = await response.json();
            window.location = body.url;
        }

        async function inPageInitialize(inPageContainer, payment) {
            const inPage = Alma.InPage.initialize(
                payment.id,
                {
                    environment: almaContext.almaMode,
                    showPayButton: false,
                    onUserCloseModal: function () {
                        addCheckoutEvent(checkoutEvents.at(-1));
                        checkoutInpageCallInProgress = false;
                    }
                });

            await inPage.mount("#" + inPageContainer);
            return inPage;
        }

        /**
         * Open a payment option and hide the others
         * @param  {Object} t a JS selector
         */
        async function toggle(t) {
            var inPages = document.querySelectorAll('[id$="-inpage"]');
            inPages.forEach(function (inPage) {
                if (inPage.firstChild) {
                    inPage
                        .firstChild
                        .remove();
                }
            });


            removeCheckoutEvents();
            var activeElt = document.querySelector("#" + t.id + " .fa");
            var isAlreadyOpen = activeElt.classList.contains("fa-chevron-down");

            var icons = document.querySelectorAll(".alma-payment-method .fa");
            [].forEach.call(icons, function (icon) {
                icon.classList.remove("fa-chevron-down");
            });

            if (!isAlreadyOpen) {
                activeElt.classList.add("fa-chevron-down");

                var installments_count = parseInt(t.getAttribute('data-installments'));
                var deferred_days = parseInt(t.getAttribute('data-deferred-days'));
                var alma_payment_method = t.getAttribute('data-alma-payment-method');
                var in_page = t.getAttribute('data-in-page') === 'true';

                document.body.style.cursor = 'wait';
                if (in_page) {
                    var response = await fetch(
                        almaContext.almaUrl.createPaymentUrl + '?deferred_days=' + deferred_days + '&installments=' + installments_count,
                        { method: 'POST' }
                    );
                    var payment = await response.json();
                    await inPageInitialize(t.id + "-inpage", payment)
                        .then(function (inPage) {
                            var checkoutInpageCall = async function () {
                                if (checkoutInpageCallInProgress) {
                                    return;
                                }
                                checkoutInpageCallInProgress = true;
                                var ajaxResponse = await fetch(almaContext.almaUrl.checkoutInpageUrl + '?pid=' + payment.id + '&amount=' + payment.purchase_amount + '&alma_payment_method=' + alma_payment_method);
                                var orderInpage = await ajaxResponse.json();
                                switch (ajaxResponse.status) {
                                    case 200:
                                        removeCheckoutEvents();
                                        inPage.startPayment();
                                        break;
                                    case 400:
                                        displayMismatchMessage(orderInpage);
                                        checkoutInpageCallInProgress = false;
                                        break;
                                    case 500:
                                        displayAlmaErrors(orderInpage.error, 'payment-method-not-found-message');
                                        checkoutInpageCallInProgress = false;
                                        break;
                                    default:
                                        displayAlmaErrors(ajaxResponse.status, 'payment-error');
                                        checkoutInpageCallInProgress = false;
                                }
                            };

                            checkoutEvents.push(checkoutInpageCall);

                            addCheckoutEvent(checkoutInpageCall);
                        });
                } else {
                    activeElt.parentNode.innerHTML = '<div class="alma-lds-ring"><div></div><div></div><div></div><div></div></div>';
                    await redirectToPaymentPage(installments_count, deferred_days);
                }
                document.body.style.cursor = 'default';

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

        var almaPaymentMethods = document.querySelectorAll(".alma-payment-method");
        almaPaymentMethods.forEach(function (pm) {
            pm.addEventListener("click", async function (e) {
                await handlePaymentMethodClick(e);
            });
        });

        function displayMismatchMessage(orderFragment) {
            var errorMessagePosition = document.querySelectorAll(almaContext.selector.fragmentErrors)[0];
            errorMessagePosition.after(createMismatchMessage(orderFragment));
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

        function displayAlmaErrors(message, divId) {
            var errorMessagePosition = document.querySelectorAll(almaContext.selector.fragmentErrors)[0];
            var errorMessage = document.createTextNode(message);
            var errorDiv = document.createElement('div');
            errorDiv.classList.add('col-12', 'alma-error-message');
            errorDiv.id = divId;
            errorDiv.appendChild(errorMessage);
            errorDiv.appendChild(document.createElement('br'));
            errorMessagePosition.after(errorDiv);
        }

    });
