const INWARD = 'Dependencies point inward. The domain never imports an adapter.';
const OUTSIDE =
  'The domain is pure. Reach the outside world through a port in src/ports.';

export const boundaryImports = {
  patterns: [
    { group: ['**/adapters/**', 'src/adapters/*'], message: INWARD },
    {
      group: ['node:*', 'fs', 'path', 'readline', 'http', 'https', 'crypto'],
      message: OUTSIDE,
    },
  ],
};

export const impureGlobals = [
  { name: 'process', message: OUTSIDE },
  {
    name: 'console',
    message: 'The domain does not print. Return a value and let an adapter render it.',
  },
  { name: 'fetch', message: OUTSIDE },
  { name: 'window', message: OUTSIDE },
  { name: 'document', message: OUTSIDE },
  { name: 'localStorage', message: OUTSIDE },
  { name: 'sessionStorage', message: OUTSIDE },
];

export const nondeterminism = [
  {
    selector: "CallExpression[callee.object.name='Math'][callee.property.name='random']",
    message:
      'The domain must be deterministic. Take a Random port instead of Math.random().',
  },
  {
    selector: "CallExpression[callee.object.name='Date'][callee.property.name='now']",
    message: 'The domain must be deterministic. Take a Clock port instead of Date.now().',
  },
  {
    selector: "NewExpression[callee.name='Date'][arguments.length=0]",
    message: 'The domain must be deterministic. Take a Clock port instead of new Date().',
  },
  {
    selector: 'CallExpression[callee.name=/^set(Timeout|Interval)$/]',
    message: 'The domain must be deterministic. Schedule through the Clock port.',
  },
];
