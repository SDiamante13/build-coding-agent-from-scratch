export function indent(text) {
  return text
    .split('\n')
    .map((line) => (line === '' ? '' : `  ${line}`))
    .join('\n');
}

export function coach({ name, text, kernel }, coached) {
  if (coached.has(name)) return `  → ${name} (${kernel}), coached above`;

  coached.add(name);

  return `\n${indent(`${name.toUpperCase()}\n${text}`)}`;
}

export function pluralize(count, noun) {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

export function sensorReport(sensor, findings, total = findings.length) {
  if (total === 0) return `SENSOR ${sensor}: PASS (0 findings)\n`;

  return `SENSOR ${sensor}: FAIL (${pluralize(total, 'finding')})\n\n${findings.join('\n\n')}\n`;
}
