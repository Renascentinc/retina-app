import Vue from 'vue'
import VueApollo from 'vue-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory'
import { onError } from 'apollo-link-error'
import ApiStatusCodes from './utils/api-status-codes'
import { showErrorMsg } from './utils/alerts'
import router from './router'

Vue.use(VueApollo)

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    '__schema': {
      'types': [
        {
          'kind': 'UNION',
          'name': 'ToolOwner',
          'possibleTypes': [
            {
              'name': 'Location'
            },
            {
              'name': 'User'
            }
          ]
        }
      ]
    }
  }
})

const cache = new InMemoryCache({
  fragmentMatcher,
  dataIdFromObject: object => {
    // fixing issue on history page where objects were getting scrambled with each other (same ids but different data at different snapshots in time).
    // using a combination of fields to create a unique identifier for the entries
    if (object.__typename === 'PreviousToolSnapshotDiff') {
      return `${object.id}${object.__typename}${object.owner ? object.owner.id || object.owner.id : ''}${object.status}`
    }

    if (object.__typename === 'ToolSnapshotMetadata') {
      return `${object.timestamp}${object.__typename}`
    }

    if (router.currentRoute.path.includes('history') && (object.__typename === 'Tool' || object.__typename === 'ConfigurableItem' || object.__typename === 'User')) {
      return `${JSON.stringify(object)}`
    }

    return `${object.id}${object.__typename}`
  }
})

const httpLink = new HttpLink({
  uri: process.env.NODE_ENV === 'production' ? 'https://retina-api.renascentinc.com/graphql' : 'http://retina-api-develop.us-east-2.elasticbeanstalk.com/graphql'
})

const authLink = setContext(({ operationName }, { headers = {} }) => {
  const token = localStorage.getItem('token')
  if (token && operationName !== 'attemptUserLogin' && operationName !== 'attemptPasswordReset') {
    headers.authorization = `Bearer ${token}`
  }

  return {
    headers
  }
})

const errorLink = onError(({ graphQLErrors = [] }) => {
  graphQLErrors.map(({ extensions: { code } }) => {
    if (code === ApiStatusCodes.UNAUTHENTICATED && router.currentRoute.path !== '/login' && router.currentRoute.path !== '/password-reset') {
      window.localStorage.removeItem('token')
      showErrorMsg('Your Session Has Expired. Please Log In Again', 'SESSION EXPIRED')
      router.push({ path: '/login' })
    }
  })
})

export const defaultClient = new ApolloClient({
  link: authLink.concat(errorLink).concat(httpLink),
  connectToDevTools: false,
  shouldBatch: true,
  cache
})

export default new VueApollo({
  defaultClient
})
