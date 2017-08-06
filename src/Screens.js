/* eslint-disable import/prefer-default-export */

import { Navigation } from 'react-native-navigation'

import SideMenu from './pages/side-menu'
import Lobby from './pages/lobby'
import Login from './pages/login'

import Home from './pages/home'
import Repositories from './pages/repositories'
import Repo from './pages/repo'

export function registerScreens(store, Provider) {
  Navigation.registerComponent('app.FirstSideMenu', () => SideMenu, store, Provider)
  Navigation.registerComponent('app.Lobby', () => Lobby, store, Provider)
  Navigation.registerComponent('app.Login', () => Login, store, Provider)

  Navigation.registerComponent('app.Home', () => Home, store, Provider)
  Navigation.registerComponent('app.Repositories', () => Repositories, store, Provider)
  Navigation.registerComponent('app.Repo', () => Repo, store, Provider)
}
