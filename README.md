# Monte Carlo

A lightweight and fully-featured code editor that can be embedded in web applications.

## Getting Started

### Run the Sample Client

- Fork and clone this repository.

```bash
git clone https://github.com/:your-username:/monte-carlo
cd monte-carlo
npm install
```

- Run the JSON-RPC proxy for language servers. It supports multiple language servers to be run simultaneously.

```bash
npm run dev -w jsonrpc-ws-proxy
```

- Run the sample client (built with svelte) concurrently.

```bash
npm run dev -w client
```

