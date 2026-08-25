const TIERS = new Set(['all', 'agent', 'git']);

export function chosenTier(environment = process.env) {
  const chosen = (environment.SENSORS ?? 'all').toLowerCase();

  return TIERS.has(chosen) ? chosen : 'all';
}

export function agentTierFires(environment = process.env) {
  return chosenTier(environment) !== 'git';
}

export function gitTierRepeatsCheapSensors(environment = process.env) {
  return chosenTier(environment) !== 'agent';
}
