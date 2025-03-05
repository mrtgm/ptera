FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:1-20
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends postgresql-client git curl unzip redis-tools zsh

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

# install zinit
RUN mkdir -p /home/node/.zinit \
  && git clone https://github.com/zdharma-continuum/zinit.git /home/node/.zinit/bin \
  && chown -R node:node /home/node/.zinit

RUN echo 'source /home/node/.zinit/bin/zinit.zsh' >> /home/node/.zshrc

RUN mkdir -p /home/node/.zshrc.d \
  && echo 'autoload -Uz _zinit' >> /home/node/.zshrc.d/zinit.zsh \
  && echo 'zinit light zdharma-continuum/fast-syntax-highlighting' >> /home/node/.zshrc.d/zinit.zsh \
  && echo 'zinit light zsh-users/zsh-autosuggestions' >> /home/node/.zshrc.d/zinit.zsh \
  && echo 'zinit light zsh-users/zsh-completions' >> /home/node/.zshrc.d/zinit.zsh \
  && echo 'source ~/.zshrc.d/zinit.zsh' >> /home/node/.zshrc \
  && chown -R node:node /home/node/.zshrc.d

# starship
RUN mkdir -p /home/node/.config && chown -R node:node /home/node/.config
COPY --chown=node:node .devcontainer/starship.toml /home/node/.config/starship.toml
RUN echo 'eval "$(starship init zsh)"' >> /home/node/.zshrc

# psqldef
RUN wget -O - https://github.com/sqldef/sqldef/releases/latest/download/psqldef_linux_amd64.tar.gz \
  | tar xvz

USER node

RUN bun install --global @biomejs/biome
RUN bun --version && node --version && npm --version
