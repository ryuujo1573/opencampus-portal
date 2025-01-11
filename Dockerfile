FROM oven/bun:1.1.43-debian

WORKDIR /app/portal

ENV PATH /app/portal/node_modules/.bin:$PATH

COPY package.json .
COPY bun.lockb .

RUN bun install
