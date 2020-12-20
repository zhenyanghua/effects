import esbuild from 'esbuild';
import fs from 'fs';
import { join } from 'path';

const buildDir = 'dist';
// clear the build folder
fs.rmSync(buildDir, { recursive: true, force: true });

// generate global Snow
const globalOut = join(buildDir, 'snow.min.js');
esbuild.build({
  entryPoints: ['src/Snow.js'],
  bundle: true,
  outfile: globalOut,
  minify: true,
  target: 'es2017',
  globalName: 'Snow',
}).then(() => {
  if (fs.existsSync(globalOut)) {
    fs.writeFileSync(globalOut, 'window.Snow=Snow.default;\n', {flag: 'a'});
  }
}).then(() => console.log(`Output: ${globalOut}`)).catch(() => process.exit(1));

// generate esm
const esmOutput = join(buildDir, 'snow.esm.js');
esbuild.build({
  entryPoints: ['src/Snow.js'],
  bundle: true,
  outfile: esmOutput,
  sourcemap: true,
  target: 'es2017',
  format: 'esm'
}).then(() => console.log(`Output: ${esmOutput}`)).catch(() => process.exit(1));
