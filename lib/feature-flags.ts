export const isFeatureEnabled = (flag: string): boolean => {
  const value = process.env[flag];
  return value === 'true' || value === '1';
};

export const MVP_LLM_INFRA_LEARNING = isFeatureEnabled('MVP_LLM_INFRA_LEARNING');
