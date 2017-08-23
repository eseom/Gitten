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
import RepoCard from '../../components/repo-card'

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

    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          renderSectionHeader={(t, a) => (
            <View style={{ flexDirection: 'row', width: this.width, backgroundColor: '#fff', padding: 10, paddingLeft: 14, paddingBottom: 20 }}>
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
      <RepoCard
        item={item}
        onPress={() => {
          this.pushRepository(this.props.user.login, item.name)
        }}
      />
    )
  }

  _onRefresh() {

  }

  _loadMore() {

  }
})
