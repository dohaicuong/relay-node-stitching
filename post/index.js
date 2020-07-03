const { ApolloServer, gql } = require('apollo-server')

const posts = [
  { id: 'Post:1', title: 'Fist post ever', content: 'First post on graphql' },
  { id: 'Post:2', title: 'GraphQL post', content: 'GraphQL is here' },
  { id: 'Post:3', title: 'Prisma post', content: 'DB bru' },
  { id: 'Post:4', title: 'Relay post', content: 'Relay is cool af' },
]

const typeDefs = gql`
  interface Node { id: ID! }

  type Query {
    node(id: ID!): Node
  }

  type Post implements Node {
    id: ID!

    title: String!
    content: String!
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
      const post = posts.find(post => post.id === id)
      return {
        __typename,
        ...post
      }
    }
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

const PORT = 4001
server.listen(PORT).then(() => console.log(`http://localhost:${PORT}`))