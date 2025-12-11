import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// repo structure
const SRC = './src';
const BUILD = './build';
const DIST = './dist';

// ++++++++++++++
// +++ STAGES +++
// ++++++++++++++
const setup = (): void => {
  const cleanupDirectories = [BUILD, DIST];

  for (const dir of cleanupDirectories) {
    fs.rmSync(dir, { force: true, recursive: true });
    fs.mkdirSync(dir, { recursive: true });
  }
};

const collectTargetScriptNames = (): string[] => {
  const contents = fs.readdirSync(SRC, { withFileTypes: true });
  const dirs = contents.filter(dirent => dirent.isDirectory());
  const names = dirs.map(dirent => dirent.name);
  return names;
};

const buildFile = async (srcDir: string): Promise<void> => {
  const entryPoint = path.join(SRC, srcDir, 'index.ts');

  // Check if index.ts exists
  if (!fs.existsSync(entryPoint)) {
    console.warn(`Warning: ${entryPoint} not found, skipping ${srcDir}`);
    return;
  }

  const jsOutFile = path.join(BUILD, `${srcDir}.js`);
  const htmlOutFile = path.join(DIST, `${srcDir}.html`);

  try {
    // Build JavaScript from original TypeScript source
    await esbuild.build({
      entryPoints: [entryPoint],
      bundle: true,
      outfile: jsOutFile,
      format: 'cjs',
      target: 'es2020',
      minify: process.argv.includes('--minify'),
      sourcemap: false,
      platform: 'browser',
      banner: {
        js: `// Iridium Webflow script \`${srcDir}\`\n`
      }
    });

    // Read the compiled JS and wrap in HTML
    const compiledJS = fs.readFileSync(jsOutFile, 'utf8');
    const htmlContent = `<script>\n${compiledJS}\n</script>\n`;
    fs.writeFileSync(htmlOutFile, htmlContent);

    console.log(`Built ${srcDir}.js and ${srcDir}.html`);
  } catch (error) {
    console.error(`Error building ${srcDir}:`, error);
  }
};

// --------------
// --- STAGES ---
// --------------

const build = async (): Promise<void> => {
  setup();
  const scriptsToBuild = collectTargetScriptNames();
  if (scriptsToBuild.length === 0) {
    console.log('No directories found in src/');
    return;
  }

  const buildPromises = scriptsToBuild.map(buildFile);
  await Promise.all(buildPromises);
}

build();