# Relay Node Query Stitching (WIP)
This is temporary solution for stitching Relay-compatible services node query using graphql-tools

### Motivation
  - Having several Relay compatible services and need to stitching them together
  - Dont want to prefix the node, nodes query
  - Want to build a Relay compatible graphql for frontend

### Getting started
```
  cd post && yarn && yarn start
  cd product && yarn && yarn start
  cd gateway && yarn && yarn start
```

### TODO
  - Design an API for reusable usages
  - Clean up the code
  - Write tests, ci