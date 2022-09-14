# Monte Carlo

A lightweight, browser-based code editor with a remote language server and peer-to-peer collaboration.

## Getting Started

- Fork and clone this repository.

```bash
git clone https://github.com/:your-username:/monte-carlo
git submodule update --init --recursive
cd monte-carlo
npm install
```

- This project uses `npm` workspaces. The endpoints used in the `client` are hosted at [projects.mihirsingh.dev](https://projects.mihirsingh.dev). 

```bash
# client
npm run dev -w client

# language servers
npm run dev -w jsonrpc-ws-proxy

# signal-server
npm run dev -w signal-server
```

- Or use Docker Compose to build and run all the images.

```bash
docker compose build
docker compose up --detach
```

## Deployment

1. Make sure local repository is up-to-date.

2. Install Docker (and Docker Compose, if Linux) on the hosting server.

3. Use Docker Compose to build and run all the images.

```bash
docker compose build
docker compose up --detach
```

4. (Optional) To issue a certificate, use `./cert-setup.sh`.

```bash
docker compose exec nginx ./cert-setup.sh
```

