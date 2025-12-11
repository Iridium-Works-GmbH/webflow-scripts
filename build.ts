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

    // Read the compiled JS and remove truncated sections
    const compiledJS = fs.readFileSync(jsOutFile, 'utf8');
    const processedJS = removeTruncatedSections(compiledJS);

    // Wrap in HTML
    const htmlContent = `<script>\n${processedJS}\n</script>\n`;
    fs.writeFileSync(htmlOutFile, htmlContent);

    console.log(`Built ${srcDir}.js and ${srcDir}.html`);
  } catch (error) {
    console.error(`Error building ${srcDir}:`, error);
  }
};

// removes sections required for mocking the `wf` webflow object
const removeTruncatedSections = (source: string): string => {
  const startDelimiter = '//build:TRUNCATE_START';
  const endDelimiter = '//build:TRUNCATE_END';

  let result = source;
  let startIndex = result.indexOf(startDelimiter);

  while (startIndex !== -1) {
    const endIndex = result.indexOf(endDelimiter, startIndex);
    if (endIndex === -1) {
      // TODO terminate build
      console.warn('Warning: Found TRUNCATE_START without matching TRUNCATE_END');
      break;
    }

    // Remove everything from start delimiter to end delimiter (inclusive)
    result = result.substring(0, startIndex) + result.substring(endIndex + endDelimiter.length);
    startIndex = result.indexOf(startDelimiter);
  }

  return result;
}

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