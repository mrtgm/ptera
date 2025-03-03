FROM mcr.microsoft.com/devcontainers/base:ubuntu

# PostgreSQLクライアントと開発用ツールのインストール
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends postgresql-client git curl unzip redis-tools

# バックエンド用ツールチェーン
ENV DENO_INSTALL=/usr/local
RUN curl -fsSL https://deno.land/install.sh | sh

# フロントエンド用ツールチェーン
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && apt-get install -y nodejs \
  && npm install -g npm@latest

WORKDIR /workspace

# Denoのキャッシュディレクトリ作成とパーミッション設定（不要かも）
RUN mkdir -p /workspace/.deno-cache \
  && chmod -R 777 /workspace/.deno-cache

RUN echo 'alias deno-run="deno run --allow-net --allow-read --allow-write --allow-env"' >> /home/vscode/.bashrc
RUN echo 'alias dev="bash /workspace/.devcontainer/start-dev.sh"' >> /home/vscode/.bashrc

# biome
RUN npm install -g @biomejs/biome

RUN deno --version && node --version && npm --version

USER vscode
