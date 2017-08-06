/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import { View } from 'react-native'
import { Navigation } from 'react-native-navigation'
import axios from 'axios'
import { Provider } from 'react-redux'
import fetchIntercept from 'fetch-intercept'
import { registerScreens } from './Screens'

import { iconsMap, iconsLoaded } from './utils/AppIcons'
import configureStore from './configureStore'

const navigatorStyle = {
  navBarTranslucent: true,
  drawUnderNavBar: true,
  navBarTextColor: 'black',
  navBarButtonColor: 'black',
  // statusBarTextColorScheme: 'light',
  drawUnderTabBar: true,
}

const getTabsConfig = icons => ({
  tabs: [{
    label: 'Home',
    screen: 'app.Home',
    title: 'Gitten',
    icon: icons['ios-home-outline'],
    selectedIcon: icons['ios-home'],
    navigatorStyle,
    navigatorButtons: {
      leftButtons: [{
        title: 'menu',
        id: 'menu',
        icon: icons['ios-menu'],
      }],
      rightButtons: [{
        title: 'signin',
        id: 'signin',
        icon: icons['ios-person-add'],
      }],
    },
  }],
  tabsStyle: {
    tabBarButtonColor: '#555',
    tabBarSelectedButtonColor: 'black',
    tabBarBackgroundColor: '#EFEFEF',
  },
  drawer: {
    left: {
      screen: 'app.FirstSideMenu',
      passProps: {},
    },
    disableOpenGesture: false,
    animationType: 'none',
    navigatorStyle,
    style: {
      drawerShadow: false,
      // leftDrawerWidth: 50,
      // contentOverlayColor: '#efefef',
    },
    appStyle: {
      borderWidth: 0,
      backgroundColor: 'pink',
      shadow: null,
    },
  },
})

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
  store.dispatch({ type: 'CLEAR' })

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
