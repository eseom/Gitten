import React, { Component } from 'react'
import {
  Dimensions,
} from 'react-native'
import Config from 'react-native-config'
import { signin, signout } from '../redux/app'

export default class extends Component {

  manager = null
  width
  height

  loadedComponent = false
  tracker

  constructor(props) {
    super(props)
    if (!this.loadedComponent && this._onNavigatorEvent && this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    }
    this.loadedComponent = true

    this.width = Dimensions.get('window').width
    this.height = Dimensions.get('window').height
  }

  signin() {
    // const config = {
    //   github: {
    //     client_id: Config.GITHUB_CLIENT_ID,
    //     client_secret: Config.GITHUB_CLIENT_SECRET,
    //   },
    // }
    // this.manager.configure(config).then(() => {
    //   this.manager.authorize('github')
    //     .then(resp => this.manager.makeRequest('github', '/user').then(userResp =>
    //       this.props.dispatch(signin(
    //         userResp.data.login, resp.response.credentials.accessToken))))
    //     .catch(err => console.log(err))
    // }).catch(e => console.error(e))
  }

  signout() {
    manager.deauthorize('github')
    this.props.dispatch(signout())
  }
}
