FROM node:18-alpine

# Add package file
COPY package.json ./

# Install deps
RUN yarn install

# Copy sources
COPY src ./src
COPY tsconfig.json ./tsconfig.json

# Build dist
RUN yarn build

# Expose port 4000
EXPOSE 4000

# start app
CMD ["yarn", "start:dev"]
