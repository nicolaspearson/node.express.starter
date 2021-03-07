# Node + Express

A simple Node.js API, written using Typescript, and Express.

## Getting Started

**1. Clone the application**

```bash
git clone https://github.com/nicolaspearson/node.express.starter.git
```

**2. Start the database**

```bash
yarn db:start
```

**3. Build and run the app**

### Run the app in development mode:

```bash
yarn start:dev
```

The app will start running at <http://localhost:3000>

### Run the app in release mode:

```bash
yarn global add http-server
yarn build
http-server -p 3000 ./build
```

The app will start running at <http://localhost:3000>

## Migrations

To generate missing migrations:

```bash
yarn db:migration:generate:missing InitialSchema
```

## TODO

- Rework environment variable implementation
- Rework the request DTO implementation
- Add a response DTO implementation
- Work on migrations implementation
- Add fixtures

## Contribution Guidelines

Never commit directly to master, create a feature branch and submit a pull request.
