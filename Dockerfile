### Stage 0: Installing dependencies

FROM node:lts-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 AS dependencies

#Metadata
LABEL maintainer="Andrii Sych <asych@myseneca.ca>" \
      description="Fragments node.js microservice"

# Use /app as our working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY --chown=node:node package.json package-lock.json ./

# Install node dependencies defined in package-lock.json
RUN npm ci --only=production

################################################################################################

### Stage 1: Running the express server

FROM node:lts-alpine3.17@sha256:b45e71e98bd0eecd4b694c7fb0281e08e06a384de26a986d241d348926692318 AS running

# Install curl
RUN apk update && apk --no-cache add curl=8.5.0-r0

WORKDIR /app

# We default to use port 80 when using our service in production
ENV PORT=80 \
    NODE_ENV=production \
    NPM_CONFIG_LOGLEVEL=warn \
    NPM_CONFIG_COLOR=false

# Copy cached dependencies from previous stage so we don't have to download
COPY --from=dependencies \
     --chown=node:node /app /app

# Copy source code into the image
COPY --chown=node:node . .

USER node

# Start the serever
CMD ["npm", "start"]

# We run our service on port 80
EXPOSE 80

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl --verbose --fail localhost:80 || exit 1
