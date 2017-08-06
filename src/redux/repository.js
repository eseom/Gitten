import axios from 'axios'

const initialState = {
  repository: null,
  repositories: {},
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_REPOSITORIES': {
      return {
        ...state,
        repositories: {
          ...state.repositories,
          [action.username]: action.data,
        },
      }
    }
    case 'START_FETCH_REPOSITORY': {
      return {
        ...state,
        repository: null,
      }
    }
    case 'FETCH_REPOSITORY': {
      return {
        ...state,
        repository: action.repository,
      }
    }
    default:
      return state
  }
}

export const fetchRepositories = username =>
  async (dispatch, getState) => {
    const accessToken = getState().app.accessToken
    dispatch({
      type: 'FETCH_REPOSITORIES',
    })
    axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        query: `{
          viewer {
            repositories(orderBy: {field: UPDATED_AT, direction: DESC}, first: 100) {
              edges {
                node {
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
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        console.log(data.viewer.repositories.edges.map(e => e.node))
        dispatch({
          type: 'FETCH_REPOSITORIES',
          username,
          data: data.viewer.repositories.edges.map(e => e.node),
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }


export const fetchRepository = name =>
  async (dispatch, getState) => {
    const accessToken = getState().app.accessToken
    dispatch({
      type: 'START_FETCH_REPOSITORY',
    })
    axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: {
        query: `{
          viewer {
            repository(name: "${name}") {
              name
              commitComments(last: 1) {
                edges {
                  node {
                    body
                  }
                }
              }
              languages(last: 100) {
                edges {
                  node {
                    color
                    name
                  }
                }
              }
              repositoryTopics(last: 100) {
                edges {
                  node {
                    topic {
                      name
                    }
                  }
                }
              }
              forks {
                totalCount
              }
              stargazers {
                totalCount
              } 
              description
              isFork
              id
              url
              isPrivate
              pullRequests(first: 20, orderBy: {field: UPDATED_AT direction: DESC}) {
                edges {
                  node {
                      title
                  }
                }
              }
            }
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        dispatch({
          type: 'FETCH_REPOSITORY',
          repository: data.viewer.repository,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
