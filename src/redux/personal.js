import axios from 'axios'

const initialState = {
  mainEntries: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'MAIN_ENTRIES': {
      const { mainEntries } = action
      return {
        ...state,
        mainEntries,
      }
    }
    default:
      return state
  }
}

export const fetchLast20Issues = callback =>
  async (dispatch, getState) => {
    axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        query: `{
          viewer {
            repositories(orderBy: {field: UPDATED_AT direction: DESC}, first: 20) {
              edges {
                node {
                  owner {
                    login
                    avatarUrl
                  }
                  name
                  updatedAt
                  stargazers {
                    totalCount
                  }
                  forks {
                    totalCount
                  }
                }
              }
            }
            login
            issues(last: 20, states: CLOSED) {
              edges {
                node {
                  id
                  title
                  body
                  createdAt
                }
              }
            }
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        if (callback) callback()
        dispatch({
          type: 'MAIN_ENTRIES',
          mainEntries: {
            last20Issues: data.viewer.issues.edges.map(r => r.node),
            lastRepositories: data.viewer.repositories.edges.map(r => r.node),
          },
        })
      })
      .catch(e => console.log(e.response))
  }
