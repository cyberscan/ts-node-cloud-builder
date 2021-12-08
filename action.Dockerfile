FROM ghcr.io/cyberscan/ts-node-cloud-builder:latest

COPY --chown=node:node entrypoint.sh .

ENTRYPOINT [ "entrypoint.sh" ]
