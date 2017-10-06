import { graphql } from 'react-apollo'

const Loading = (query, action) => (component) => {
    return graphql(query)((props) => {
        try {
          const result = action(props['data'])
          if (result) {
              return component(result)
          } else {
              return null
          }
        } catch (e) {
            return null
        }
    })
}

export default Loading