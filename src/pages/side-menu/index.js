import React from 'react'
import {
  View,
  Text,
} from 'react-native'
import _ from 'lodash'
import { connect } from 'react-redux'
import { List, ListItem } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'

import Component from '../base'

const getMenuItem = (newOptions) => {
  const defaultOptions = {
    underlayColor: 'transparent',
    wrapperStyle: { backgroundColor: 'transparent', marginLeft: 10, paddingLeft: 10, alignItems: 'center' },
    titleContainerStyle: { backgroundColor: 'transparent', alignItems: 'center' },
    titleStyle: { color: 'black' },
    leftIcon: {
      style: {
        paddingLeft: 20,
        position: 'absolute',
        zIndex: 10,
      },
      color: 'black',
    },
  }
  const options = _.defaultsDeep({}, defaultOptions, newOptions)
  return (
    <ListItem {...options} rightIcon={{ color: 'white' }} />
  )
}

export default connect(
  store => ({
    accessToken: store.app.accessToken,
  }),
  dispatch => ({ dispatch }),
)(class SideMenu extends Component {
  constructor(props) {
    super(props)
    this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
  }

  _onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      this.props.navigator.dismissModal()
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillMount() {
    if (!this.props.accessToken) {
      this.props.navigator.showModal({
        screen: 'app.Lobby',
        title: 'lobby',
        passProps: {},
        navigatorStyle: {
          navBarHidden: true,
        },
      })
    }
  }

  renderAnonymousMenu() {
    return (
      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40, borderRightWidth: 1, borderColor: '#ddd' }}>
        <List style={{ backgroundColor: 'white', marginTop: 10 }}>
          {getMenuItem({
            title: '로그인',
            leftIcon: { name: 'person' },
            onPress: () => {
              // let leftButtons = []
              // if (Platform.OS === 'ios') {
              //   leftButtons = [
              //     {
              //       id: 'close',
              //       title: 'Close',
              //       icon: iconsMap['ios-close'],
              //     },
              //   ]
              // }
              this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'close',
              })
              this.props.navigator.showModal({
                screen: 'app.Login',
                title: 'login',
                passProps: {},
                navigatorStyle: {
                  navBarHidden: true,
                },
              })
            },
          })}
        </List>
      </View>
    )
  }

  renderLoggedMenu() {
    // let thumbUrl = require('../../components/namecard/no-profile-image.png')
    // if (self.thumbnail) {
    //   thumbUrl = { uri: self.thumbnail.url }
    // }
    // <Image source={thumbUrl} style={{ width: 42, height: 42, borderRadius: 21 }} />
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: 'white', paddingTop: 40, borderRightWidth: 1, borderColor: '#ddd' }}>
        <List style={{ backgroundColor: 'white', marginTop: 10 }}>
          {getMenuItem({
            title: 'settings',
            leftIcon: {
              name: 'settings',
            },
            // subtitle: 'login',
            onPress: () => {
              this.props.navigator.toggleDrawer({
                side: 'left',
                animated: true,
                to: 'close',
              })
            },
          })}
        </List>
        {this._renderFooter()}
      </View >
    )
  }

  render() {
    if (this.props.accessToken) {
      return this.renderLoggedMenu(this.props.self)
    }
    return this.renderAnonymousMenu()
  }

  _renderFooter() {
    return (
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#f7f7f7' }}>
        <View style={{ flexDirection: 'row', padding: 10, backgroundColor: 'white' }}>
          <View style={{ margin: 10, marginLeft: 10 }}>
            <Text style={{ fontSize: 12 }}>gitten</Text>
          </View>
        </View>
      </View>
    )
  }
})
