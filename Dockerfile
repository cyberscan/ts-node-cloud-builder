ARG NODE_VERSION=14

FROM node:${NODE_VERSION}-buster-slim

ARG TYPESCRIPT_VERSION=4.x
ARG LERNA_VERSION=3.x
ARG VUE_CLI_VERSION=next

# https://github.com/nodejs/docker-node/blob/master/docs/BestPractices.md#global-npm-dependencies
ARG NPM_CONFIG_PREFIX=/home/node/.npm-global

ENV LANG=C.UTF-8 \
    LANGUAGE=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    DEBIAN_FRONTEND=noninteractive \
    NODE_ENV=production \
    NPM_CONFIG_PREFIX="$NPM_CONFIG_PREFIX" \
# https://github.com/yarnpkg/yarn/issues/3287#issuecomment-298987967
    PREFIX="$NPM_CONFIG_PREFIX" \
    PATH="$NPM_CONFIG_PREFIX/bin:/workspace/node_modules/.bin:$PATH"

COPY --chown=node:node entrypoint.sh /home/node/entrypoint.sh
COPY --chown=node:node lerna-resolver /home/node/lerna-resolver

RUN set -eux; \
    apt-get update; \
    apt-get upgrade -y; \
    apt-get install -y --no-install-recommends bzip2; \
    apt-get clean -y; \
    rm -rf /var/lib/apt/lists/*; \
# Add lerna-resolver
    cd /home/node/lerna-resolver; \
      yarn pack lerna-resolver ; \
    cd - ; \
    yarn global add \
      "file:///home/node/lerna-resolver/lerna-resolver-v0.0.1.tgz" \
      "typescript@${TYPESCRIPT_VERSION}" \
      "lerna@${LERNA_VERSION}" \
      "@vue/cli@${VUE_CLI_VERSION}" \
      "@vue/cli-service-global@${VUE_CLI_VERSION}" \
    ; \
    yarn cache clean --all; \
    rm -f lerna-resolver/lerna-resolver-v0.0.1.tgz;

# https://cloud.google.com/build/docs/build-config#dir
WORKDIR /workspace

ENTRYPOINT [ "yarn" ]
CMD []
