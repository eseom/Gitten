import React from 'react'
import {
  TouchableHighlight,
  RefreshControl,
  ListView,
  View,
  Text,
} from 'react-native'
import { connect } from 'react-redux'
import Icon from 'react-native-vector-icons/FontAwesome'

import { fetchRepositories } from '../../redux/repository'
import styles from './styles'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import Component from '../base'

const transDate = (dateString) => {
  const time = new Date(dateString)
  return `${(time.getMonth() + 1)}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
}

export default connect(
  store => ({
    user: store.app.user,
    repositories: store.repository.repositories,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  state = {
    refreshing: false,
    repositories: new ListView.DataSource({
      rowHasChanged: (r1, r2) => (
        r1.id !== r2.id || r1.user_has_liked !== r2.user_has_liked
      ),
      sectionHeaderHasChanged: () => true,
    }),
  }

  constructor(props) {
    super(props)

    this._renderRow = this._renderRow.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._loadMore = this._loadMore.bind(this)
  }

  componentDidMount() {
    this.props.dispatch(fetchRepositories(this.props.user.login))
  }

  componentWillReceiveProps(nextProps) {
    let rs = []
    if (nextProps.repositories[nextProps.user.login]) {
      rs = nextProps.repositories[nextProps.user.login]
    }
    this.setState({
      repositories: this._getDS(rs),
    })
  }

  _getDS(rows) {
    const ids = rows.map((obj, index) => index)
    return this.state.repositories.cloneWithRows(rows, ids)
  }

  render() {
    const { user: { login } } = this.props
    const { repositories } = this.state
    if (!repositories) {
      return (
        <View />
      )
    }
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          renderSectionHeader={(t, a) => (
            <View style={{ flexDirection: 'row', width: this.width, backgroundColor: '#fff', padding: 10, paddingBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold' }}>https://github.com/{login}</Text>
              <Text>{' '}</Text>
              <Text style={{ fontSize: 16 }}>repositories</Text>
            </View>
          )}
          stickySectionHeadersEnabled={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          contentContainerStyle={styles.list}
          dataSource={repositories}
          renderRow={this._renderRow}
          onEndReached={this._loadMore}
          onEndReachedThreshold={300}
        />

      </View >
    )
  }

  _renderRow(item, sectionKey) {
    return (
      <View style={{ width: this.width, padding: 10, paddingLeft: 14, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => {
            this.pushRepository(this.props.user.login, item.name)
          }}
        >
          <View style={{ flexDirection: 'column' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{item.name}</Text>
              <Text ellipsizeMode="tail" style={{ alignContent: 'flex-end', fontSize: 12 }}>{transDate(item.updatedAt)}</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="star" />
                <Text>{' '}</Text>
                <Text>{item.stargazers.totalCount}</Text>
              </View>
              <Text>{' '}</Text>
              <Text>{' '}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="code-fork" />
                <Text>{' '}</Text>
                <Text>{item.forks.totalCount}</Text>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View >
    )
  }

  _onRefresh() {

  }

  _loadMore() {

  }
})
