FROM node:argon


# Create app directory
RUN mkdir -p /usr/src/app
# Set directory for commands to be executed within
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app


EXPOSE 3000
CMD ["npm", "run", "dev"]

