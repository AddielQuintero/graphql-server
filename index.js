import { gql, ApolloServer } from 'apollo-server'

import { persons } from './db.js'
import { v1 as uuid } from 'uuid'
// const persons = [
//   {
//     name: 'Midu',
//     phone: '034-1234567',
//     street: 'Calle Frontend',
//     city: 'Barcelona',
//     id: '1',
//   },
//   {
//     name: 'Youseff',
//     phone: '044-123456',
//     street: 'Avenida Fullstack',
//     city: 'Mataro',
//     id: '2',
//   },
//   {
//     name: 'Itzi',
//     street: 'Pasaje Testing',
//     city: 'Ibiza',
//     id: '3',
//   },
// ]

const typeDefs = gql`
  type Query {
    personCount: Int!
    persons: [Person]!
    person(id: ID!): Person
  }

  type Person {
    id: ID!
    name: String!
    phone: String!
    address: Address!
  }

  type Address {
    street: String!
    city: String!
  }

  type Mutation {
    addPerson(name: String!, phone: String!, street: String!, city: String!): Person!
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    persons: () => persons,
    person: (parent, args) => {
      return persons.find((person) => person.id === args.id)
    },
  },
  Person: {
    // address: (parent) => `${parent.street}, ${parent.city}`,
    address: (parent) => {
      return {
        street: parent.street,
        city: parent.city,
      }
    },
  },
  Mutation: {
    addPerson: (parent, args) => {
      const person = { ...args, id: uuid() }
      persons.push(person)
      return person
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`server ready at ${url}`)
})
