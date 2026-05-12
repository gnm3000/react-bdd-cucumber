import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(new URL('..', import.meta.url).pathname);
const srcRoot = path.join(projectRoot, 'src');

const reactLibraries = new Set(['react', 'react-dom', 'react-router-dom', '@tanstack/react-query']);

const layerRules = [
  {
    layer: 'domain',
    prefix: 'domain/',
    forbiddenInternalPrefixes: ['app/', 'routes/', 'presentation/', 'application/', 'data/', 'generated/'],
    forbiddenExternal: reactLibraries
  },
  {
    layer: 'application',
    prefix: 'application/',
    forbiddenInternalPrefixes: ['app/', 'routes/', 'presentation/', 'data/', 'generated/'],
    forbiddenExternal: reactLibraries
  },
  {
    layer: 'presentation',
    prefix: 'presentation/',
    forbiddenInternalPrefixes: ['app/', 'routes/', 'data/', 'generated/'],
    forbiddenExternal: new Set()
  },
  {
    layer: 'data',
    prefix: 'data/',
    forbiddenInternalPrefixes: ['app/', 'routes/', 'presentation/', 'application/'],
    forbiddenExternal: reactLibraries
  }
];

function listSourceFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = path.join(directory, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) return listSourceFiles(fullPath);
    if (/\.(ts|tsx)$/.test(entry)) return [fullPath];

    return [];
  });
}

function importSpecifiers(source) {
  const specifiers = [];
  const importExportPattern = /(?:import|export)\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  const dynamicImportPattern = /import\(\s*['"]([^'"]+)['"]\s*\)/g;

  for (const pattern of [importExportPattern, dynamicImportPattern]) {
    let match;
    while ((match = pattern.exec(source)) !== null) {
      specifiers.push(match[1]);
    }
  }

  return specifiers;
}

function relativeSrcPath(filePath) {
  return path.relative(srcRoot, filePath).replaceAll(path.sep, '/');
}

function resolveInternalImport(filePath, specifier) {
  if (!specifier.startsWith('.')) return null;

  const resolved = path.resolve(path.dirname(filePath), specifier);
  const relative = path.relative(srcRoot, resolved).replaceAll(path.sep, '/');

  return relative.startsWith('..') ? null : relative;
}

const violations = [];

for (const filePath of listSourceFiles(srcRoot)) {
  const relativeFile = relativeSrcPath(filePath);
  if (relativeFile.startsWith('generated/')) continue;

  const rule = layerRules.find((candidate) => relativeFile.startsWith(candidate.prefix));
  if (!rule) continue;

  const source = readFileSync(filePath, 'utf8');

  for (const specifier of importSpecifiers(source)) {
    if (rule.forbiddenExternal.has(specifier)) {
      violations.push(`${relativeFile} imports ${specifier}, but ${rule.layer} must stay framework-agnostic.`);
      continue;
    }

    const internalImport = resolveInternalImport(filePath, specifier);
    if (!internalImport) continue;

    const forbiddenPrefix = rule.forbiddenInternalPrefixes.find((prefix) => internalImport.startsWith(prefix));
    if (forbiddenPrefix) {
      violations.push(`${relativeFile} imports ${internalImport}, but ${rule.layer} cannot depend on ${forbiddenPrefix}.`);
    }
  }
}

if (violations.length > 0) {
  console.error('Architecture boundary violations found:\n');
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log('Architecture boundaries are clean.');
