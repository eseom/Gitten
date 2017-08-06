const initialState = {
  provider: '',
  username: '',
  accessToken: '', // current accessToken
  user: null, // current user
  users: [],
}

export default function (state = initialState, action) {
  switch (action.type) {
    case 'SELECT': {
      const { user } = action
      return {
        ...state,
        user,
        accessToken: user.accessToken,
      }
    }
    case 'REGISTER': {
      const { user } = action
      return {
        ...state,
        users: [
          ...state.users,
          user,
        ],
      }
    }
    case 'SIGNIN': {
      const { username, accessToken } = action
      return {
        ...state,
        provider: 'github',
        username,
        accessToken,
      }
    }
    case 'SIGNOUT': {
      return {
        ...state,
        provider: '',
        username: '',
        accessToken: '',
      }
    }
    default:
      return state
  }
}

export const selectUser = user => ({
  type: 'SELECT',
  user,
})

export const registerUser = user => ({
  type: 'REGISTER',
  user,
})

export const signin = (username, accessToken) => ({
  type: 'SIGNIN',
  provider: 'github',
  username,
  accessToken,
})

export const signout = () => ({
  type: 'SIGNOUT',
  provider: 'github',
})
