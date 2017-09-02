import axios from 'axios'
import base64 from 'base-64'

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
        trends: action.repositories,
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

export const fetchRepositories = username =>
  async (dispatch, getState) => {
    const now = new Date()
    now.setDate(now.getDate() - 7)
    const targetDate = yyyymmdd(now)
    const accessToken = getState().app.accessToken

    dispatch({
      type: 'START_FETCH_TREND',
    })
    axios({
      method: 'GET',
      url: `https://api.github.com/users/${username}/repos?type=all&sort=updated&direction=desc`,
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.data)
      .then((data) => {
        dispatch({
          type: 'FETCH_REPOSITORIES',
          username,
          data,
        })
      })
      .catch((e) => {
        console.log(e)
      })
  }

export const fetchRepositoriesGraphql = username =>
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

export const fetchRepository = (owner, repo) =>
  async (dispatch, getState) => {
    const accessToken = getState().app.accessToken
    dispatch({
      type: 'START_FETCH_REPOSITORY',
    })
    const data = await axios({
      method: 'GET',
      url: `https://api.github.com/repos/${owner}/${repo}`,
      // url: 'https://api.github.com/graphql',
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.data)

    const promises = []

    promises.push(axios({
      method: 'GET',
      url: data.languages_url,
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.data))

    promises.push(axios({
      method: 'GET',
      url: `https://api.github.com/repos/${owner}/${repo}/topics`,
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.data.names))

    promises.push(axios({
      method: 'GET',
      url: `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
      headers: {
        Accept: 'application/vnd.github.mercy-preview+json',
        authorization: `Bearer ${accessToken}`,
      },
    })
      .then(response => response.data.content)
      .catch(e => e.reponse))

    const result = await Promise.all(promises)

    data.languages = result[0]
    data.topics = result[1]
    data.content = ''
    try {
      data.content = base64.decode(result[2].replace(/\\n/g, '')).toString()
    } catch (e) { }

    dispatch({
      type: 'FETCH_REPOSITORY',
      repository: data,
    })
  }

export const fetchRepositoryGraphql = (owner, repo) =>
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
          repo: search(first: 1, query: "${owner}/${repo}", type: REPOSITORY) {
            edges {
              node {
                ... on Repository {
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
            }
          }
        }`,
      },
    })
      .then(response => response.data.data)
      .then((data) => {
        console.log(data)
        dispatch({
          type: 'FETCH_REPOSITORY',
          repository: data.repo.edges[0].node,
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
      method: 'GET',
      url: `https://api.github.com/search/repositories?sort=stars&order=desc&q=language:java&q=created:>${targetDate}`,
      headers: {
        Accept: 'application/json',
        authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.data)
      .then((data) => {
        dispatch({
          type: 'FETCH_TRENDS',
          repositories: data.items,
        })
      })
      .catch((e) => {
        console.log(e)
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
