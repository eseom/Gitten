import React from 'react'
import {
  Dimensions,
  RefreshControl,
  Text,
  TouchableHighlight,
  ListView,
  View,
} from 'react-native'
import Cookie from 'react-native-cookie'
import { Navigation } from 'react-native-navigation'
import { connect } from 'react-redux'

import { iconsMap } from '../../utils/AppIcons'
import { fetchLast20Issues } from '../../redux/personal'
import styles from './styles'
import Component from '../base'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import RepoCard from '../../components/repo-card'

const transDate = (dateString) => {
  const time = new Date(dateString)
  return `${(time.getMonth() + 1)}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
}

export default connect(
  store => ({
    user: store.app.user,
    accessToken: store.app.accessToken,
    mainEntries: store.personal.mainEntries,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  state = {
    refreshing: false,
    list: [],

    last20Issues: new ListView.DataSource({
      rowHasChanged: (r1, r2) => (
        r1.id !== r2.id
      ),
      sectionHeaderHasChanged: (r1, r2) => (
        r1.id !== r2.id
      ),
    }),
  }

  width
  height
  load = false

  constructor(props) {
    super(props)
    if (!this.load) {
      // for DEBUG environment
      this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
      this.load = true
    }

    this.width = Dimensions.get('window').width
    this.height = Dimensions.get('window').height

    this._onRefresh = this._onRefresh.bind(this)
    this._renderRow = this._renderRow.bind(this)
    // props.navigator.switchToTab({
    //   tabIndex: 1,
    // })
  }

  async _onNavigatorEvent(event) {
    if (event.id === 'menu') {
      // const t = await this.manager.deauthorize('github')
      this.props.navigator.toggleDrawer({
        side: 'left',
        animated: true,
      })
    } else if (event.id === 'signout') {
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
    }
  }

  componentWillMount() {
    this._getIssues()

    Cookie.clear()
  }

  async _getIssues(callback) {
    this.props.dispatch(fetchLast20Issues(callback))
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      last20Issues: this._getDS(nextProps.mainEntries),
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          renderSectionHeader={(t, a) => {
            if (a === 'global') {
              return (
                <View style={{ flexDirection: 'row', width: this.width, backgroundColor: '#fff', padding: 10, paddingBottom: 20 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>logged user: {this.props.user.login}</Text>
                </View>
              )
            }
            let title = ''
            if (a === 'last20Issues') {
              title = 'latest 20 issues'
            } else {
              title = 'latest 20 repositories'
            }
            return (
              <View style={{ flexDirection: 'row', width: this.width, backgroundColor: '#fff', height: 40, padding: 10, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
              </View>
            )
          }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          contentContainerStyle={styles.list}
          dataSource={this.state.last20Issues}
          renderRow={this._renderRow}
          onEndReachedThreshold={300}
        />
      </View >
    )
  }

  _renderRow(item, sectionKey) {
    return (sectionKey === 'last20Issues' ? (
      <View style={{ width: this.width, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
        <TouchableHighlight
          style={{ padding: 10 }}
          underlayColor="#EFEFEF"
          onPress={() => {
            this.pushRepository(this.props.user.login, item.name)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{item.title}</Text>
          </View>
        </TouchableHighlight>
      </View>
    ) :
      <RepoCard
        style={{ width: this.width, borderBottomColor: '#ddd', borderBottomWidth: 1 }}
        owner={item.owner}
        updatedAt={item.updatedAt}
        stargazers={item.stargazers}
        forks={item.forks}
        name={item.name}
        onPress={() => {
          this.pushRepository(item.owner.login, item.name)
        }}
      />
    )
  }

  _onRefresh() {
    this.setState({ refreshing: true });
    setTimeout(() => {
      this._getIssues(() => {
        this.setState({ refreshing: false });
      })
    }, 500)
  }

  _getDS(obj) {
    const data = {
      global: [],
      ...obj,
    }
    return this.state.last20Issues.cloneWithRowsAndSections(
      data,
    )
  }
})
