import { gql, ApolloServer } from 'apollo-server'
import { v1 as uuid } from 'uuid'
import axios from 'axios'

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    persons(phone: YesNo): [Person]!
    person(id: ID!): Person
  }

  type Person {
    id: ID!
    name: String!
    phone: String
    address: Address!
  }

  type Address {
    street: String!
    city: String!
  }

  input PersonInput {
    id: ID!
    name: String
    phone: String
    street: String
    city: String
  }

  type DeletePerson {
    success: String!
    message: String!
  }

  type Mutation {
    addPerson(name: String!, phone: String, street: String!, city: String!): Person!
    # editPerson(id: String, name: String, phone: String, street: String, city: String): Person!
    editPerson(person: PersonInput!): Person!
    deletePerson(id: ID!): DeletePerson!
    editPhone(id: ID!, phone: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: async () => {
      const { data: persons } = await axios.get(`http://localhost:3000/persons`)
      return persons.length
    },
    persons: async (parent, args) => {
      const { data: persons } = await axios.get(`http://localhost:3000/persons`)
      if (!args.phone) return persons

      const hasPhone = (person) => (args.phone === 'YES' ? person.phone : !person.phone)
      return persons.filter(hasPhone)
    },
    person: async (parent, args) => {
      const { data: persons } = await axios.get(`http://localhost:3000/persons`)
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
    addPerson: async (parent, args) => {
      try {
        const newPerson = { ...args, id: uuid() }
        const { data: person } = await axios.post(`http://localhost:3000/${'persons'}`, newPerson)
        return person
      } catch (error) {
        throw new Error(`Failed to update phone: ${error.message}`)
      }
    },
    editPerson: async (parent, args) => {
      try {
        // const updateFields = { ...args }
        // delete updateFields.id
        const { id, ...updateFields } = args.person
        const { data: updatePerson } = await axios.patch(`http://localhost:3000/persons/${id}`, updateFields)

        return updatePerson
      } catch (error) {
        throw new Error(`Failed to update phone: ${error.message}`)
      }
    },
    deletePerson: async (parent, args) => {
      try {
        const { data: existingPerson } = await axios.get(`http://localhost:3000/persons/${args.id}`)
        if (!existingPerson) {
          throw new Error('Person not found')
        }

        await axios.delete(`http://localhost:3000/persons/${args.id}`)
        return { success: true, message: 'Person deleted successfully' }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          return { success: false, message: 'Person not found' }
        }
        throw new Error(`Failed to delete person: ${error.message}`)
      }
    },
    editPhone: async (parent, args) => {
      try {
        const response = await axios.patch(`http://localhost:3000/persons/${args.id}`, {
          phone: args.phone,
        })
        return response.data
      } catch (error) {
        throw new Error(`Failed to update phone: ${error.message}`)
      }
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
