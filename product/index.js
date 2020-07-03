const { ApolloServer, gql } = require('apollo-server')

const products = [
  { id: 'Product:1', name: 'Sandals', price: 10 },
  { id: 'Product:2', name: 'Shirt', price: 20 },
  { id: 'Product:3', name: 'Hat', price: 15 },
  { id: 'Product:4', name: 'Pant', price: 50 },
]

const typeDefs = gql`
  interface Node { id: ID! }

  type Query {
    node(id: ID!): Node
  }

  type Product implements Node {
    id: ID!

    name: String!
    price: String!
  }
`

const resolvers = {
  Node: {
    __resolveType(object) {
      return object.__typename
    }
  },
  Query: {
    node: (_, { id }) => {
      const [__typename] = id.split(':')
      const product = products.find(product => product.id === id)
      return {
        __typename,
        ...product
      }
    }
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

const PORT = 4002
server.listen(PORT).then(() => console.log(`http://localhost:${PORT}`))