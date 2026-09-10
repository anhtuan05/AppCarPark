import fs from 'node:fs';
import path from 'node:path';
import en from '../src/i18n/locales/en.js';
import vi from '../src/i18n/locales/vi.js';

function flattenKeys(value, prefix = '', output = new Set()) {
  Object.entries(value).forEach(([key, child]) => {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === 'object') flattenKeys(child, fullKey, output);
    else output.add(fullKey);
  });
  return output;
}

function findSourceFiles(directory, output = []) {
  fs.readdirSync(directory, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) findSourceFiles(fullPath, output);
    else if (/\.(js|jsx)$/.test(entry.name)) output.push(fullPath);
  });
  return output;
}

const localeKeys = {
  en: flattenKeys(en),
  vi: flattenKeys(vi),
};
const usedKeys = new Set();
const staticTranslationPattern = /\bt\(\s*['"]([^'"]+)['"]/g;

findSourceFiles(path.resolve('src')).forEach((filePath) => {
  const source = fs.readFileSync(filePath, 'utf8');
  let match = staticTranslationPattern.exec(source);
  while (match) {
    usedKeys.add(match[1]);
    match = staticTranslationPattern.exec(source);
  }
  staticTranslationPattern.lastIndex = 0;
});

const failures = [];

Object.entries(localeKeys).forEach(([language, keys]) => {
  const missingUsedKeys = [...usedKeys].filter((key) => !keys.has(key));
  if (missingUsedKeys.length) {
    failures.push(`${language} is missing used keys:\n- ${missingUsedKeys.join('\n- ')}`);
  }
});

const missingInEnglish = [...localeKeys.vi].filter((key) => !localeKeys.en.has(key));
const missingInVietnamese = [...localeKeys.en].filter((key) => !localeKeys.vi.has(key));
if (missingInEnglish.length) failures.push(`en is missing locale keys:\n- ${missingInEnglish.join('\n- ')}`);
if (missingInVietnamese.length) failures.push(`vi is missing locale keys:\n- ${missingInVietnamese.join('\n- ')}`);

if (failures.length) {
  console.error(failures.join('\n\n'));
  process.exitCode = 1;
} else {
  console.log(`i18n check passed: ${usedKeys.size} static keys, ${localeKeys.en.size} entries per locale.`);
}
