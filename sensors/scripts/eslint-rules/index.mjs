import { namedArrange } from './named-arrange.mjs';
import { noAssertionFreeTest } from './no-assertion-free-test.mjs';
import { noBranchingTest } from './no-branching-test.mjs';
import { noCommentedOutCode } from './no-commented-out-code.mjs';
import { noLoopingTest } from './no-looping-test.mjs';
import { noInteractionAssertion } from './no-interaction-assertion.mjs';
import { noMysteryGuest } from './no-mystery-guest.mjs';
import { noMockingLibrary } from './no-mocking-library.mjs';
import { noSensorSuppression } from './no-sensor-suppression.mjs';
import { noStaleReference } from './no-stale-reference.mjs';
import { oneLineComment } from './one-line-comment.mjs';

export const sensorRules = {
  rules: {
    'named-arrange': namedArrange,
    'no-assertion-free-test': noAssertionFreeTest,
    'no-branching-test': noBranchingTest,
    'no-commented-out-code': noCommentedOutCode,
    'no-interaction-assertion': noInteractionAssertion,
    'no-looping-test': noLoopingTest,
    'no-mystery-guest': noMysteryGuest,
    'no-mocking-library': noMockingLibrary,
    'no-sensor-suppression': noSensorSuppression,
    'no-stale-reference': noStaleReference,
    'one-line-comment': oneLineComment,
  },
};
