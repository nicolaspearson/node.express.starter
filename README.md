# Node + Express

A simple Node.js API, written using Typescript, and Express.

## Getting Started

**1. Clone the application**

```bash
git clone https://github.com/nicolaspearson/node.express.starter.git
```

**2. Start the database**

```bash
cd docker
docker-compose  up
```

**3. Build and run the app**

#### Run the app in development mode:

```bash
yarn start
```

The app will start running at <http://localhost:3000>

#### Run the app in release mode:

```bash
yarn global add http-server
yarn build
http-server -p 3000 ./build
```

The app will start running at <http://localhost:3000>

## Migrations

```
npm run typeorm:cli -- migration:create -n Initial
```

## Contribution Guidelines

Never commit directly to master, create a feature branch and submit a pull request.
