FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

# Install Node.js and npm
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get -y install --no-install-recommends nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
