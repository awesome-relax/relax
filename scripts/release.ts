import { type SpawnSyncOptions, spawnSync } from 'child_process';

type RunOptions = SpawnSyncOptions & { allowFail?: boolean };

const run = (command: string, args: string[], options: RunOptions = {}) => {
  const { allowFail = false, ...spawnOptions } = options;
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    ...spawnOptions,
  });
  if (result.status !== 0 && !allowFail) {
    process.exit(result.status == null ? 1 : result.status);
  }
  return result;
};

const runCapture = (command: string, args: string[]) => {
  const result = spawnSync(command, args, { stdio: 'pipe', encoding: 'utf-8' });
  if (result.status !== 0) {
    const code = result.status == null ? 1 : result.status;
    throw new Error(
      `Command failed: ${command} ${args.join(' ')} (exit ${code})\n${result.stderr ?? ''}`
    );
  }
  return result.stdout ?? '';
};

const hasPendingReleases = (): boolean => {
  try {
    const stdout = runCapture('pnpm', ['-w', 'exec', 'changeset', 'status', '--output=json']);
    const parsed = JSON.parse(stdout) as { releases?: unknown[] };
    const count = Array.isArray(parsed.releases) ? parsed.releases.length : 0;
    return count > 0;
  } catch (_err) {
    // If status fails (e.g. first run), fall back to attempting versioning
    return true;
  }
};

const release = () => {
  if (!hasPendingReleases()) {
    // eslint-disable-next-line no-console
    console.log('No unreleased changesets found. Nothing to publish.');
    return;
  }

  // Version packages based on changesets
  run('pnpm', ['-w', 'exec', 'changeset', 'version']);

  // Build packages
  run('pnpm', ['-w', 'run', 'build']);

  // Commit version and changelog changes
  run('git', ['add', '-A']);
  run('git', ['commit', '-m', 'chore(release): version packages'], { allowFail: true });

  // Publish to npm (will create git tags)
  run('pnpm', ['-w', 'exec', 'changeset', 'publish']);

  // Push commit and tags
  run('git', ['push']);
  run('git', ['push', '--follow-tags']);
};

if (require.main === module) {
  release();
}
