import path from 'node:path';

import { guideForRule } from './sensor-guides.mjs';
import { coach, sensorReport } from './sensor-report.mjs';

function formatLocation(message) {
  return `${message.line ?? 0}:${message.column ?? 0}`;
}

function formatMessage(filePath, message, coached) {
  const severity = message.severity === 2 ? 'ERROR' : 'WARN';
  const ruleId = message.ruleId ?? 'parser';
  const finding = `${filePath}:${formatLocation(message)} ${severity} ${ruleId}\n  ${message.message}`;

  return `${finding}\n${coach(guideForRule(ruleId), coached)}`;
}

function formatResult(result, coached) {
  const filePath = path.relative(process.cwd(), result.filePath);

  return result.messages.map((message) => formatMessage(filePath, message, coached));
}

export default function format(results) {
  const coached = new Set();

  return sensorReport(
    'eslint',
    results.flatMap((result) => formatResult(result, coached)),
  );
}
