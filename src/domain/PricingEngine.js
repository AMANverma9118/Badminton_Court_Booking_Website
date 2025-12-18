class PricingEngine {
  static calculate(basePrice, startTime, courtType, rules, coachRate, equipmentFees) {
    let finalPrice = basePrice;
    const date = new Date(startTime);
    const hour = date.getHours();
    const day = date.getDay();

    rules.forEach(rule => {
      if (!rule.isActive) return;
      
      if (rule.ruleType === 'peak' && hour >= 18 && hour < 21) {
        finalPrice *= rule.multiplier;
      }
      if (rule.ruleType === 'weekend' && (day === 0 || day === 6)) {
        finalPrice *= rule.multiplier;
      }
      if (rule.ruleType === 'indoor_premium' && courtType === 'indoor') {
        finalPrice *= rule.multiplier;
      }
    });

    return finalPrice + coachRate + equipmentFees;
  }
}

module.exports = PricingEngine;