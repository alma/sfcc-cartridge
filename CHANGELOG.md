# CHANGELOG

## v4.10.0 - 2025-04-18

### Changes

### 🚀 New Features

- Update widget version from 3.x.x to 4.x.x (#159)

#### Contributors

@joyet-simon and [github-actions[bot]](https://github.com/apps/github-actions)

## v4.9.0 - 2025-04-16

### Changes

### 🚀 New Features

- feat: Set the IN_PAGE setting true by default (#153)

#### Contributors

@Benjamin-Freoua-Alma, @alma-renovate-bot[bot], @carine-bonnafous, @joyet-simon, @remi-zuffinetti, [alma-renovate-bot[bot]](https://github.com/apps/alma-renovate-bot) and [github-actions[bot]](https://github.com/apps/github-actions)

## v4.8.0 - 2024-12-02

### Changes

- Security update sfcc node version (#141)

### 🚀 New Features

- Change wording for in page configuration (#139)

#### Contributors

@FranceBe, @alma-renovate-bot, @alma-renovate-bot[bot], @gdraynz, @github-actions, @joyet-simon and @remi-zuffinetti

## v4.7.0 - 2024-10-07

### Changes

### 🚀 New Features

- Integrate credit for in page (#135)

#### Contributors

@alma-renovate-bot, @alma-renovate-bot[bot], @github-actions, @joyet-simon and @remi-zuffinetti

## v4.6.0 - 2024-09-16

### 🚀 New Features

- Add hmac verification on IPN (#129)
- Add test warning on Frontstore (#124)

#### Contributors

@CapMousse, @FranceBe, @Francois-Gomis, @alma-renovate-bot, @alma-renovate-bot[bot], @carine-bonnafous, @gdraynz, @github-actions, @hyahiaoui and @joyet-simon

## v4.5.2 - 2024-07-16

### Changes

- chore(deps): update lovetoknow/slackify-markdown-action action to v1.1.1 (#112)
- chore(deps): update npm dependencies (#106)
- [DEX-892] Add Taskfile, update pre-commits and release workflow (#101)
- Precommit message rule (#99)
- Gather cart data from pnx and deferred payments (#98)
- [Security] Update deprecated Aqua scanner options (#97)

#### Contributors

@FranceBe, @alma-renovate-bot, @alma-renovate-bot[bot], @carine-bonnafous, @joyet-simon and @remic-alma

## v4.5.1

* Feat: allow In-Page for deferred payment

## v4.5.0

* Feat: add Deferred Capture feature.
* Chore: add pre-commit tool.

## v4.4.0

* Feat: In Page checkout

## v4.3.1

* Feat: add Pay Now with credit card with Alma.
* Feat: add cart items in Alma payment payload for credit.

## v4.2.0

* Feat: Add contextual information for Alma logs
* Feat: Encrypt Alma API key in back-office
* Feat: Add possibility to exclude a product category for Alma payment

## v4.1.0

* Feat: manage errors when fragment's popup close
* Fix: update price and payment information on Alma payment method when shipping price changes
* Fix: display right Alma payment method for the current cart price
* Fix: manage events on next step button in checkout
* Fix: update custom data in Alma payload
* Fix: place customer guest information on shipping address onto fragment

## v4.0.0

* Extract payment button from in page
* Create SFCC order on payment only
* Manage errors from in page
* Move merchant_reference in Alma order

## v3.3.2

* Fixed creating alma plans ineligible case

## v3.3.1

* Fixed payment processor Alma

## v3.3.0

* Rebranding 2022

## v3.2.1

* Change version

## v3.2.0

* Added split payment methods feature
* Added unit tests

## v3.1.1

* Added PT translations

## v3.1.0

* Added refund feature
* Added a environment variable for toggle refund or not
* Added unit tests

## v3.0.3

* Repository is now public
* inpage payment can be activated when there's less than 4 installments
* p10x is now available
* removed model that conflicted with Stripe
* Export status now set properly upon payment success

## v3.0.2

* Fixed a faulty FR property
* Added a better way to offer onShipment payment

## v3.0.1

* added translations for ES, DE, BE, FR, IT, NL

## v3.0.0

* added package.json to pilot the project
  
* added npm commands :
  
  * `build:sitepref` (see below)
  * `lint` allow to lint css, js and isml for the cartridge
  * `uploadCartridge` upload cartridge to a sandbox
  
* refactored widget and fragment usage to use Alma plans
  
* refactored Alma controller
  
* refactored job for onShipment orders
  

## v2.3.0

* trans: init crowdin and update translations
* refactor: change const to var and update widget's cdn
* refactor: renaming functions and optimisation
* feat: add billing adress to payment payload and refactor

## v2.2.1

* refactor: use fee-plan instead of eligibility on checkout
* refactor: decrease complexity
* fix: remove forgotten js console output

## v2.2.0

* feat: add order.merchant_reference on payment creation
* fix: customer locale on payment creation
* refactor: extract inlined css into stylesheet file

## v2.1.0

* widget-v2 + i18n

## v2.0.2

* fix: multiple descriptions display on confirmation page

## v2.0.1

* fix: js ; eol
* fix: checkout without required payment plans
* refactor: remove .history directory from versionning

## v2.0.0

* feat: deferred payment (on shipping)
* feat: paylater (J+15)
* feat: monthly payment (p3x)

## v1.0.1

* fix: Checkout unrounded cents

## v1.0.0

* first release
