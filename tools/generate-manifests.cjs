/* Hash committed Git bytes, never checkout text. Default is read-only.
 * Empreintes des octets Git ; aucune écriture sans --write.
 */
const fs = require('node:fs');
const crypto = require('node:crypto');
const { execFileSync } = require('node:child_process');
const git = (args, encoding = 'utf8') => execFileSync('git', args, { encoding, maxBuffer: 64 * 1024 * 1024 });
function selectFiles(game, rule, entries) {
  const selected = [];
  for (const entry of entries) {
    const prefix = `Jeux/${game}/`;
    if (!entry.path.startsWith(prefix)) continue;
    const relative = entry.path.slice(prefix.length);
    if (relative === 'manifest.json' || rule.exclude.includes(relative)) continue;
    if (relative.split('/').some(part => part.startsWith('.') || ['node_modules', 'documentation', 'backups', 'archives', 'tests', 'dist'].includes(part.toLowerCase())) || /\.(md|rtf|log|tmp|bak)$/i.test(relative)) throw new Error(`Development file requires review: ${entry.path}`);
    if (!['100644', '100755'].includes(entry.mode)) throw new Error(`Unsupported file mode: ${entry.path}`);
    if (!rule.files.includes(relative) && !rule.directories.some(dir => relative.startsWith(`${dir}/`))) throw new Error(`Unclassified resource: ${entry.path}; review distribution-files.json`);
    selected.push({ path: relative, sha256: crypto.createHash('sha256').update(git(['cat-file', 'blob', entry.oid], null)).digest('hex') });
  }
  for (const file of rule.files) if (!selected.some(entry => entry.path === file)) throw new Error(`Missing required resource: ${game}/${file}`);
  return selected.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
}
function parseTree(raw) {
  return raw.split('\0').filter(Boolean).map(line => {
    const tab = line.indexOf('\t');
    const [mode, type, oid] = line.slice(0, tab).split(' ');
    if (type !== 'blob') throw new Error(`Unsupported Git entry: ${line}`);
    return { mode, oid, path: line.slice(tab + 1) };
  });
}
function main(args) {
  const value = flag => args[args.indexOf(flag) + 1];
  const revision = args.includes('--revision') ? value('--revision') : 'HEAD';
  const rules = JSON.parse(fs.readFileSync('distribution-files.json', 'utf8'));
  const entries = parseTree(git(['ls-tree', '-r', '-z', revision, '--', 'Jeux']));
  const games = [...new Set(entries.map(entry => entry.path.split('/')[1]))];
  for (const game of games) if (!Object.hasOwn(rules, game)) throw new Error(`Unconfigured game: ${game}`);
  let affected = games;
  if (args.includes('--game')) {
    if (!games.includes(value('--game'))) throw new Error('Unknown game');
    affected = [value('--game')];
  }
  // Prepare and validate all games before any writes / avant toute écriture.
  const prepared = games.map(game => {
    const files = selectFiles(game, rules[game], entries);
    const old = JSON.parse(git(['show', `${revision}:Jeux/${game}/manifest.json`]));
    if (typeof old.version !== 'string' || !/^\d+$/.test(old.version) || !Number.isSafeInteger(Number(old.version))) throw new Error(`Unsupported version: ${game}`);
    const ordered = [...old.files].sort((a,b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0);
    const changed = JSON.stringify(ordered) !== JSON.stringify(files);
    const update = affected.includes(game) && changed;
    const version = update ? String(Math.max(Date.now(), Number(old.version) + 1)) : old.version;
    return { game, files, changed, update, version };
  });
  for (const item of prepared) {
    console.log(JSON.stringify({ game: item.game, files: item.files.length, changed: item.changed, version: item.version, written: item.update && args.includes('--write') }));
    if (item.update && args.includes('--write')) fs.writeFileSync(`Jeux/${item.game}/manifest.json`, JSON.stringify({version:item.version,files:item.files}, null, 4) + '\n', 'utf8');
  }
}
module.exports = { selectFiles, parseTree };
if (require.main === module) main(process.argv.slice(2));
