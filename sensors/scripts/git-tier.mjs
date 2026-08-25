import { gitTierRepeatsCheapSensors } from './sensor-tier.mjs';

process.exitCode = gitTierRepeatsCheapSensors() ? 0 : 1;
