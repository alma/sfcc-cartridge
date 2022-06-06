const merchantHasOnShipment = (plans) => {
  return plans.some((plan) => plan.deferred_trigger_limit_days !== null);
};
exports.merchantHasOnShipment = merchantHasOnShipment;
