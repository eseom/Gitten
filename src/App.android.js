/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import axios from 'axios'
import { Provider } from 'react-redux'
import fetchIntercept from 'fetch-intercept';
import { registerScreens } from './Screens'

import { iconsMap, iconsLoaded } from './utils/AppIcons'
import configureStore from './configureStore'
import { navigatorStyle } from './styles.android'

const prepareStore = async () => {
  const store = await configureStore()

  registerScreens(store, Provider)

  axios.interceptors.request.use(
    async (request) => {
      // normal situation
      const token = store.getState().app.accessToken
      if (token) request.headers.authorization = `Bearer ${token}`
      return request
    },
    error => error,
  )
  return store
}

prepareStore().then((store) => {
  // clear paintings store
  store.dispatch({ type: 'CLEAR_USERS' })
  store.dispatch({ type: 'CLEAR_DATA' })

  iconsLoaded.then(() => {
    Navigation.startSingleScreenApp({
      screen: {
        screen: 'app.Lobby',
        title: 'gitten',
        subtitle: 'Lobby',
        navigatorStyle: {
        },
        navigatorButtons: {
          rightButtons: [{
            title: 'add',
            id: 'add',
            icon: iconsMap['md-person-add'],
          }],
        },
      },
    })
    // Navigation.startTabBasedApp(getTabsConfig(iconsMap))
  })
})
