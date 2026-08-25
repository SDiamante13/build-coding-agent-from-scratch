export const mechanical = {
  'unused-binding': [
    'Dead Code — delete it; version control remembers. If it is a parameter fixed by an interface you do not control, prefix it with an underscore so the intent is on the page.',
  ],
  'as-const': [
    'as const is the narrower claim: the value is exactly this literal, where an annotation only says it is of that kind. Drop the annotation and the precision survives every assignment downstream.',
  ],
  'default-export': [
    'A default export has no name, so every call site invents one and grep stops finding it. Export it by name — and if naming it is hard, that is the finding underneath this one.',
  ],
  'import-order': [
    'Builtin, external, internal, then local, one blank line between groups. Mechanical — run the fixer rather than hand-editing.',
    'A grouped block is also where a boundary violation becomes visible to a reader — an adapter import sitting in a domain file has nowhere to hide.',
  ],
  'sensor-contract': [
    'Fix the cause the message names, in this file, now.',
    'Do not disable the rule, add a suppression comment, or weaken the config to clear it. The sensor is the contract, and changing the contract to pass it needs explicit approval.',
  ],
};
