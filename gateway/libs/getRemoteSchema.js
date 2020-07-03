const { introspectSchema } = require('graphql-tools')
const fetch = require('node-fetch')
const { print } = require('graphql')

const { wrapSchema, FilterRootFields, RenameRootFields, RenameTypes } = require('@graphql-tools/wrap')

const executor = async(uri, { document, variables }) => {
  return fetch(uri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: print(document),
      variables
    })
  })
  .then(res => res.json())
}

module.exports = async ({ uri, prefixNode, prefixTypes }) => {
  return wrapSchema({
    schema: await introspectSchema(props => executor(uri, props)),
    executor: async props => {
      console.log('run here')
      return await executor(uri, props)
    },
    // subscriber: () => {},
    transforms: [
      new FilterRootFields((_, rootField) => rootField !== 'nodes'),
      new RenameRootFields((_, rootFieldName) =>
        rootFieldName == 'node' ? `${prefixNode}Node` : rootFieldName
      ),
      new RenameTypes(name =>
        ["ID", "Node"].includes(name) ? name : `${prefixTypes}_${name}`
      )
    ]
  })
}