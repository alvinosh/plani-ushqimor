// Daily update: fetch the latest prices, commit them and push, which triggers
// the GitHub Pages deploy.
//
//   npm run update             fetch, commit, push
//   npm run update -- --no-push   fetch and commit only

import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: root, encoding: 'utf8', ...opts })
const push = !process.argv.includes('--no-push')

try {
  run(process.execPath, ['scripts/fetch-prices.mjs'], { stdio: 'inherit' })
} catch {
  console.error('\nFetching prices failed; nothing was changed.')
  process.exit(1)
}

if (!run('git', ['status', '--porcelain', '--', 'public/data']).trim()) {
  console.log('No changes since the last update.')
  process.exit(0)
}

const today = new Date().toISOString().slice(0, 10)
run('git', ['add', '--', 'public/data'])
// Commit only the data files, even if other work is staged.
run('git', ['commit', '-m', `Update prices ${today}`, '--', 'public/data'], { stdio: 'inherit' })

if (push) {
  try {
    run('git', ['push'], { stdio: 'inherit' })
  } catch {
    console.error('\nCommitted, but the push failed. Check the GitHub remote (see README) and run `git push`.')
    process.exit(1)
  }
  console.log('\nPushed. GitHub Pages will redeploy in a minute or two.')
} else {
  console.log('\nCommitted locally (not pushed).')
}
