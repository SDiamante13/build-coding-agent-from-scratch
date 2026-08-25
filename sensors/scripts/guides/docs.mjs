export const docs = {
  'stale-doc': [
    'The documentation names something that is not there. This is usually the first thing a reader does with the project, and it fails.',
    'Decide which side is wrong before you change either. If the thing was renamed, the doc is stale — fix the doc. If the doc describes something that was always meant to exist, it is a promise nobody kept: build it, or withdraw the promise until you do.',
    'Prose is the one artifact nothing else here checks. A type error dies in milliseconds; a README that lies survives every other sensor in this repo and is copied by everyone who clones it.',
    'Not this: deleting the line so the sensor goes quiet. If the command ought to exist, silence only moves the failure downstream to the reader.',
  ],
};
