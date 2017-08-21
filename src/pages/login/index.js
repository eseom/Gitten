import React from 'react'
import {
  WebView,
  View,
} from 'react-native'
import Config from 'react-native-config'
import axios from 'axios'
import { connect } from 'react-redux'
import Cookie from 'react-native-cookie'

import Component from '../base'
import { registerUser } from '../../redux/app'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line

export default connect(
  store => ({
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = {
    ...commonNavigatorStyle,
  }

  state = {
    catched: false,
  }

  constructor(props) {
    super(props)

    this._callback = this._callback.bind(this)
  }

  async _onNavigatorEvent(event) {
  }

  componentWillMount() {
    Cookie.clear()
  }

  componentWillReceiveProps(nextProps) {
  }

  loaded = false

  async _callback(data) {
    console.log(data)
    if (
      data.loading === true ||
      data.title !== 'OAuth application authorized' ||
      !(data.url.includes('http://localhost') || data.url.includes('gitten://oauth'))
    ) return
    console.log('----------', data)
    if (this.loaded) return
    this.loaded = true
    this.setState({ catched: true })

    const code = data.url.match(/code=(.*)/)[1]

    const response = await axios({
      method: 'POST',
      url: 'https://github.com/login/oauth/access_token',
      headers: {
        Accept: 'application/json',
      },
      data: {
        client_id: Config.GITHUB_CLIENT_ID,
        client_secret: Config.GITHUB_CLIENT_SECRET,
        code,
      },
    })
      .then(resp => resp.data)
      .catch(e => console.info('----0', e.response))

    if (!response.access_token) return

    const user = await axios({
      url: 'https://api.github.com/user',
      headers: {
        authorization: `Bearer ${response.access_token}`,
      },
    })
      .then(resp => resp.data)
      .catch(e => console.info('----1', e.response))

    user.accessToken = response.access_token
    this.props.dispatch(registerUser(user))
    this.props.navigator.pop()
  }

  render() {
    const uri = `https://github.com/login/oauth/authorize?client_id=${Config.GITHUB_CLIENT_ID}&scope=user,email`
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {this.state.catched ?
          null :
          <WebView
            source={{ uri }}
            onNavigationStateChange={this._callback}
            javaScriptEnabledAndroid
            startInLoadingState
            thirdPartyCookiesEnabled={false}
          />
        }
      </View>
    )
  }
})
