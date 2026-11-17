# Hosted showcase (ADR-164). Runs the real dev server so the Test Playground
# works with its /__pg API; the game, the hub (/hub.html) and the mock boards
# (/mocks/**) come from the same process. Node 24 strips the .ts validators the
# playground calls, which Node 22.15 cannot do.
FROM node:24-slim

WORKDIR /app

# pnpm comes from packageManager; corepack so the lockfile is honoured.
RUN corepack enable

# Dependencies first, so a source edit doesn't re-install.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack pnpm install --frozen-lockfile

COPY . .

ENV NODE_ENV=production
# The platform sets PORT; vite.config.ts binds publicly and drops HMR when it sees it.
EXPOSE 10000

# `vite` (dev), not `vite preview`: the playground plugin is `apply: 'serve'`.
CMD ["corepack", "pnpm", "dev"]
