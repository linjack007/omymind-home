import { readFileSync, writeFileSync } from 'node:fs';
const documents = Object.fromEntries(['privacy', 'terms'].map(kind => [kind, Object.fromEntries(['en', 'zh'].map(locale => [locale, readFileSync(new URL(`../content/legal/${locale}/${kind}.md`, import.meta.url), 'utf8')]))]));
writeFileSync(new URL('../content/legal.json', import.meta.url), JSON.stringify(documents, null, 2) + '\n');
