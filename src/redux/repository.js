import axios from 'axios'

const initialState = {
  repository: null,
  repositories: {},
  trends: [],
  commits: [],
}

const yyyymmdd = function (dat) {
  const mm = dat.getMonth() + 1 // getMonth() is zero-based
  const dd = dat.getDate()

  return [dat.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')
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
    case 'START_FETCH_TRENDS': {
      return {
        ...state,
        trends: [],
      }
    }
    case 'FETCH_TRENDS': {
      return {
        ...state,
        trends: action.data,
      }
    }
    case 'FETCH_COMMITS': {
      return {
        ...state,
        commits: action.commits,
      }
    }
    default:
      return state
  }
}

export const fetchRepositories = login =>
  async (dispatch, getState) => {
    const accessToken = getState().app.accessToken
    // dispatch({
    //   type: 'FETCH_REPOSITORIES',
    // })
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
          search(first: 100, query: "user:${login}", type: REPOSITORY) {
            edges {
              node {
                ... on Repository {
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
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        dispatch({
          type: 'FETCH_REPOSITORIES',
          username: login,
          data: data.search.edges.map(e => e.node),
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

export const fetchRepository = (owner, repo) =>
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
      },
      data: {
        query: `{
          repository(owner: "${owner}", name: "${repo}") {
            readme: object(expression: "master:README.md") {
              ... on Blob {
                text
              }
            }
            parent {
              id
            }
            codeOfConduct {
              body
              key
              name
              url
            }
            primaryLanguage {
              id
              name
              color
            }
            viewerHasStarred
            languages(last: 100) {
              totalCount
              totalSize
              edges {
                size
                node {
                  id
                  name
                  color
                }
              }
            }
            owner {
              login
            }
            name
            commitComments(last: 1) {
              edges {
                node {
                  body
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
            watchers {
              totalCount
            }
            description
            isFork
            id
            url
            isPrivate
            pullRequests(first: 20, orderBy: {field: UPDATED_AT, direction: DESC}) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
        `,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        const r = data.repository
        r.repositoryTopics = r.repositoryTopics.edges.map(t => t.node)
        r.languages.items = r.languages.edges.map((t) => {
          return { ...t.node, size: t.size }
        })
        dispatch({
          type: 'FETCH_REPOSITORY',
          repository: r,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

export const startFetchTrends = () => ({
  type: 'START_FETCH_TREND',
})

export const fetchTrends = () =>
  async (dispatch, getState) => {
    const now = new Date()
    now.setDate(now.getDate() - 7)
    const targetDate = yyyymmdd(now)
    const accessToken = getState().app.accessToken
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
          search(first: 100, query: "language:java created:>${targetDate}", type: REPOSITORY) {
            edges {
              node {
                ... on Repository {
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
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        dispatch({
          type: 'FETCH_TRENDS',
          data: data.search.edges.map(e => e.node),
        })
      })
      .catch((e) => {
        console.error('request error', e)
      })
  }

export const fetchCommits = (owner, repo, callback) =>
  async (dispatch, getState) => {
    const now = new Date()
    now.setDate(now.getDate() - 7)
    const targetDate = yyyymmdd(now)
    const accessToken = getState().app.accessToken

    axios({
      method: 'POST',
      url: 'https://api.github.com/graphql',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
      data: {
        query: `{
        repository(owner: "${owner}", name: "${repo}") {
          ref(qualifiedName: "master") {
            target {
              ... on Commit {
                id
                history(first: 50) {
                  pageInfo {
                    hasNextPage
                  }
                  edges {
                    node {
                      committedDate
                      messageHeadline
                      oid
                      message
                      author {
                        avatarUrl
                        name
                        email
                        date
                      }
                    }
                  }
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
        const history = data.repository.ref.target.history
        dispatch({
          type: 'FETCH_COMMITS',
          commits: history.edges.map(t => t.node),
          // pageInfo
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }
