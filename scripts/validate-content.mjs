import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();

const readJson = async (relativePath) => {
  const filePath = path.join(root, relativePath);
  return JSON.parse(await readFile(filePath, 'utf8'));
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const content = await readJson('public/portfolio_content.json');
assert(content.personal?.name, 'portfolio_content.json: personal.name is required.');
assert(Array.isArray(content.personal?.titles), 'portfolio_content.json: personal.titles must be an array.');
assert(content.profile?.description, 'portfolio_content.json: profile.description is required.');
assert(Array.isArray(content.projects), 'portfolio_content.json: projects must be an array.');
assert(Array.isArray(content.experience), 'portfolio_content.json: experience must be an array.');
assert(content.skills?.categories?.length, 'portfolio_content.json: skills.categories is required.');

for (const project of content.projects) {
  assert(project.title, 'Each project needs a title.');
  assert(project.description, `Project "${project.title}" needs a description.`);
  assert(Array.isArray(project.images), `Project "${project.title}" needs an images array.`);
}

const manifest = await readJson('public/resumes/manifest.json');
assert(Array.isArray(manifest.versions), 'resumes/manifest.json: versions must be an array.');

if (manifest.current) {
  const current = manifest.versions.find((version) => version.path === manifest.current);
  assert(current, 'resumes/manifest.json: current must point to an entry in versions.');
  await access(path.join(root, 'public', manifest.current));
}

console.log('Portfolio content and resume manifest are valid.');
