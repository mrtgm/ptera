FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:1-20

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends postgresql-client git curl unzip redis-tools

ENV BUN_INSTALL=/bun
ENV BUN_TMPDIR=/bun/tmp

RUN mkdir -p /bun /bun/tmp \
  && curl -fsSL https://bun.sh/install | bash \
  && chown -R node:node /bun \
  && chmod -R 755 /bun

ENV PATH=${BUN_INSTALL}/bin:${PATH} \
  BUN_DIR=${BUN_INSTALL}/.cache/bun \
  TMPDIR=${BUN_TMPDIR}

WORKDIR /workspace

USER node
RUN bun install --global @biomejs/biome
RUN bun --version && node --version && npm --version

USER root
