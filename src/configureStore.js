import { AsyncStorage } from 'react-native'
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { persistStore, autoRehydrate } from 'redux-persist'
import promise from './promise'

import app from './redux/app'
import personal from './redux/personal'
import { reducer as repository } from './redux/repository'

const reducers = combineReducers({
  app,
  personal,
  repository,
})

export default () =>
  new Promise((resolve) => {
    const enhancer = compose(
      applyMiddleware(thunk, promise),
    )
    const store = createStore(reducers, enhancer, compose(
      autoRehydrate(),
    ))
    persistStore(store, { storage: AsyncStorage }, () => {
      resolve(store)
    })
  })
