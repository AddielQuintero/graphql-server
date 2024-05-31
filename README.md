# GraphQL Server
This project is an example of how to set up a GraphQL server using `apollo-server` and a local JSON database using `json-server`.

## Requirements
- Node.js (version 20.12.0)
- npm (Node.js package manager)

## Installation
1. Clone the repository:

```sh
git clone <REPOSITORY_URL>
cd graphql-Server
```

2. Install the project dependencies:

```bash
npm install
```

## Configuration
The db.json file contains the JSON database data. You can edit this file to add, modify, or delete persons.

## Usage
Start the GraphQL Server
To start the GraphQL server, run the following command:
```bash
npx nodemon index.js
```

The GraphQL server will be available at http://localhost:4000/, and you can use GraphQL Playground to interact with the API.

## Start the JSON Server
To start the JSON server, run the following command:
```bash
npm run json-server
```
The JSON server will be available at http://localhost:3000/persons.

## Endpoints
GraphQL Playground: http://localhost:4000/\
JSON Database: http://localhost:3000/persons
