# NOXEL LIBRARY — Knowledge Entry

## Term / Concept
npm vs Yarn

## In one sentence (simple)
npm and Yarn are tools that install and manage libraries for JavaScript projects.

## Plain-language explanation (vulgarized)
Imagine you are building a house:
- The house = your project (like NOXEL360).
- React, Vite, Express, etc. = building materials.

npm and Yarn are like two different delivery companies. They both deliver the materials you asked for.

In practice:
- You list what you need in `package.json`.
- The tool downloads dependencies into `node_modules`.
- It locks exact versions in a lock file (`package-lock.json` for npm, `yarn.lock` for Yarn).

Today, both are reliable. If your project uses npm, stick to npm.

## Why it matters
Most JavaScript projects depend on external libraries. A package manager keeps installs consistent and repeatable.

## Common mistakes
- Mixing npm and Yarn in the same repo (lockfile conflicts).
- Deleting the lock file without understanding the impact.
- Installing packages globally when they should be local to the project.

## Related concepts
- package.json
- package-lock.json
- node_modules
- npx
