# node.express.starter

An `Express.js` starter project, built using `Yarn2` and `Typescript`.

The starter project includes the following out of the box:

- Authorization middleware
- Error handling middleware
- Logger middleware
- Validation middleware
- Database integration (Sequelize + PostgreSQL)
- Containerization via Docker
- Unit tests (100% coverage)
- Integration tests (100% coverage)
- Complete CI workflow (build -> test -> publish)

## Test Coverage

![Coverage lines](https://raw.githubusercontent.com/nicolaspearson/node.express.starter/master/coverage/unit/badge-lines.svg?sanitize=true)
![Coverage functions](https://raw.githubusercontent.com/nicolaspearson/node.express.starter/master/coverage/unit/badge-functions.svg?sanitize=true)
![Coverage branches](https://raw.githubusercontent.com/nicolaspearson/node.express.starter/master/coverage/unit/badge-branches.svg?sanitize=true)
![Coverage statements](https://raw.githubusercontent.com/nicolaspearson/node.express.starter/master/coverage/unit/badge-statements.svg?sanitize=true)

## Getting Started

**1. Clone the application**

```bash
git clone https://github.com/nicolaspearson/node.express.starter.git
```

**2. Build and run the app**

### Run the app in development mode:

```bash
yarn start:dev
```

The app will start running at <http://localhost:3000>

### Run the app in release mode:

```bash
yarn start:docker
```

The app will start running at <http://localhost:3000>

## Migrations

To generate missing migrations:

```bash
yarn sequelize:migration:generate:missing InitialSchema
```

## Contribution Guidelines

Never commit directly to master, create a feature branch and submit a pull request.
