const initialState = {
  provider: '',
  username: '',
  accessToken: '', // current accessToken
  user: null, // current user
  users: [],
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    // case 'CLEAR': {
    //   return {
    //     ...state,
    //     users: [],
    //     accessToken: '',
    //   }
    // }
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

      let replaced = false
      const users = state.users.map((u) => {
        if (u.id === user.id) {
          replaced = true
          return user
        }
        return u
      })
      if (!replaced) users.push(user)
      return {
        ...state,
        users,
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
})
