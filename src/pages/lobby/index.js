import React from 'react'
import {
  Text,
  View,
  Platform,
} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import styles from './styles'
import Component from '../base'
import { selectUser } from '../../redux/app'
import { iconsMap } from '../../utils/AppIcons'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line

const getTabsConfig = icons => ({
  tabs: [{
    label: 'Home',
    screen: 'app.Home',
    ...(Platform.OS === 'ios' ? {
      title: 'Home',
    }
      : {
        title: 'Gitten',
        subtitle: 'Home',
      }),
    icon: icons['md-home'],
    navigatorStyle: commonNavigatorStyle,
    navigatorButtons: {
      leftButtons: [{
        title: 'menu',
        id: 'menu',
        icon: icons['md-menu'],
      }],
      rightButtons: [{
        title: 'signout',
        id: 'signout',
        icon: icons['md-people'],
      }],
    },
  }, {
    label: 'Repository',
    screen: 'app.Repositories',
    ...(Platform.OS === 'ios' ? {
      title: 'Repository',
    }
      : {
        title: 'Gitten',
        subtitle: 'Repository',
      }),
    icon: icons.repo,
    navigatorStyle: commonNavigatorStyle,
    navigatorButtons: {
      leftButtons: [{
        title: 'menu',
        id: 'menu',
        icon: icons['md-menu'],
      }],
      rightButtons: [{
        title: 'signout',
        id: 'signout',
        icon: icons['md-people'],
      }],
    },
  }, {
    label: 'Trend',
    screen: 'app.Trend',
    ...(Platform.OS === 'ios' ? {
      title: 'Trend',
    }
      : {
        title: 'Gitten',
        subtitle: 'Trend',
      }),
    icon: icons['md-trending-up'],
    navigatorStyle: commonNavigatorStyle,
    navigatorButtons: {
    },
  }],
  appStyle: {
    tabBarButtonColor: '#555',
    tabBarSelectedButtonColor: 'black',
    tabBarBackgroundColor: '#EFEFEF',
  },
  drawer: {
    type: 'MMDrawer',
    animationType: 'slide',
    left: {
      screen: 'app.FirstSideMenu',
      passProps: {},
    },
    disableOpenGesture: false,
    navigatorStyle: commonNavigatorStyle,
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

export default connect(
  store => ({
    users: store.app.users,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  state = {
  }

  async _onNavigatorEvent(event) {
    if (event.id === 'add') {
      this.props.navigator.push({
        screen: 'app.Login',
        title: 'gitten',
        subtitle: 'Add a Github user',
        navigatorStyle: {
          // navBarHidden: true,
        },
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.users.length > 0 ?
          <List containerStyle={{ marginBottom: 20 }}>
            {this.props.users.map((u, i) => (
              <ListItem
                containerStyle={{ backgroundColor: 'white' }}
                roundAvatar
                avatar={{ uri: u.avatar_url }}
                key={u.id || i}
                underlayColor={'#EFEFEF'}
                chevronColor={'#000'}
                onLongPress={() => {
                  console.log('long')
                }}
                title={u.login}
                onPress={() => {
                  this.props.dispatch(selectUser(u))
                  Navigation.startTabBasedApp(getTabsConfig(iconsMap))
                }}
              />
            ))}
          </List>
          :
          <View style={{ padding: 10 }}>
            <Text>Woops, there is no registered user. Add your github accounts.</Text>
          </View>
        }
      </View>
    )
  }
})
