import { copyFile, mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = process.argv[2] || '../../../../Chirag/Personal/Resume-v1/ChiragKular_Resume.pdf';
const label = process.argv.slice(3).join(' ') || 'Chirag Kular Resume';
const resumesDir = path.join(root, 'public', 'resumes');
const manifestPath = path.join(resumesDir, 'manifest.json');

if (!source) {
  console.error('Usage: npm run resume:add -- /path/to/resume.pdf [optional label]');
  process.exit(1);
}

const sourcePath = path.resolve(source);
const ext = path.extname(sourcePath).toLowerCase();

if (!['.pdf', '.doc', '.docx'].includes(ext)) {
  console.error('Resume must be a .pdf, .doc, or .docx file.');
  process.exit(1);
}

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const filename = `chirag-kular-resume-${timestamp}${ext}`;
const destinationPath = path.join(resumesDir, filename);

await mkdir(resumesDir, { recursive: true });

let manifest = { current: null, versions: [] };
try {
  manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') {
    throw error;
  }
}

const fileStats = await stat(sourcePath);
await copyFile(sourcePath, destinationPath);

const entry = {
  label,
  path: `resumes/${filename}`,
  filename,
  sourceName: path.basename(sourcePath),
  uploadedAt: new Date().toISOString(),
  size: fileStats.size
};

manifest.current = entry.path;
manifest.versions = [entry, ...(manifest.versions || [])];

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`Added ${entry.path}`);
console.log(`Latest resume now points to ${manifest.current}`);
