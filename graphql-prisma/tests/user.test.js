import 'cross-fetch/polyfill'
import ApolloBoost, { gql } from 'apollo-boost'

const client = new ApolloBoost({
    uri: "http://localhost:4000"
})

test('Hi', () => {})