const shared = {
  argsIgnorePattern: '^_',
  varsIgnorePattern: '^_',
  caughtErrorsIgnorePattern: '^_',
  ignoreRestSiblings: false,
};

export const unusedVars = ['error', { ...shared, args: 'all' }];

// Args only: the red-green stub has a parameter its body does not use yet.
export const unusedVarsInLoop = ['error', { ...shared, args: 'none' }];
