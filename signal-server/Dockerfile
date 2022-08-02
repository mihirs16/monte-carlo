# node image as base
FROM node:latest

# setup and start the signalling server
COPY . .
RUN npm install
CMD ["npm", "start"]
EXPOSE 4444

