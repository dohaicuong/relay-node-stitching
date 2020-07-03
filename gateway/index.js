const getRemoteSchema = require('./libs/getRemoteSchema')
const { ApolloServer, transformSchema } = require('apollo-server')
const { delegateToSchema, FilterRootFields, stitchSchemas } = require('graphql-tools')

// TODO: clean up and write specs
;(async () => {
  const postSchema = await getRemoteSchema({
    uri: 'http://localhost:4001',
    prefixNode: 'posts',
    prefixTypes: 'Posts',
  })

  const productSchema = await getRemoteSchema({
    uri: 'http://localhost:4002',
    prefixNode: 'products',
    prefixTypes: 'Products',
  })

  const stitchedSchema = stitchSchemas({
    subschemas: [
      { schema: postSchema },
      { schema: productSchema },
    ],
    typeDefs: `
      extend type Query {
        node(id: ID!): Node
        nodes(ids: [ID!]!): [Node]!
      }
    `,
    resolvers: {
      Query: {
        node: {
          resolve: (root, args, context, info) => {
            const [schemaName, id] = args.id.split('::')

            const allowedSchema = ['posts', 'products']
            if (!allowedSchema.includes(schemaName)) throw new Error(`Invalid schema provided ${schemaName}`)

            const fieldName = `${schemaName}Node`
            const schema =
              schemaName === 'Posts' ? postSchema :
              schemaName === 'Products' ? productSchema :
              info.schema

            // TODO
            // transformResult to prefix return nodeId with schemaName
            return delegateToSchema({
              schema,
              fieldName,
              args: { id },
              context,
              info
            })
          }
        }
      }
    }
  })

  const schema = transformSchema(stitchedSchema, [
    new FilterRootFields(
      (_, rootField) => rootField.match(/\w+Node$/) == null
    )
  ])

  new ApolloServer({ schema })
    .listen(4000)
    .then(({ url }) => console.log(url))
})()