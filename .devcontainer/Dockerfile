ARG VARIANT="20"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}
RUN npm install -g typescript eslint prettier ts-node-dev

COPY . .
