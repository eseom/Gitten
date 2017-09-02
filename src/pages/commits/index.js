import React from 'react'
import {
  RefreshControl,
  Text,
  ListView,
  View,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'
import { connect } from 'react-redux'

import { fetchCommits } from '../../redux/repository'
import styles from './styles'
import Component from '../base'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import CommitCard from '../../components/commit-card'

export default connect(
  store => ({
    accessToken: store.app.accessToken,
    commits: store.repository.commits,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  state = {
    refreshing: false,
    list: [],

    commits: new ListView.DataSource({
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
    // if (!this.load) {
    //   // for DEBUG environment
    //   this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    //   this.load = true
    // }
    this._renderRow = this._renderRow.bind(this)
  }

  componentWillMount() {
    this._getCommits()
  }

  async _getCommits(callback) {
    const { owner, repo } = this.props
    this.props.dispatch(fetchCommits(owner, repo, callback))
  }

  componentWillReceiveProps(nextProps) {
    let commits = []
    if (nextProps.commits) {
      commits = nextProps.commits
    }
    this.setState({
      commits: this._getDS(commits),
    })
  }

  _getDS(rows) {
    const ids = rows.map((obj, index) => index)
    return this.state.commits.cloneWithRows(rows, ids)
  }

  render() {
    return (
      <View style={styles.container}>
        <ListView
          enableEmptySections
          renderSectionHeader={(t, a) => (
            <View style={styles.header}>
              <Icon name="git-commit" style={{ fontSize: 24 }} />
              <Text>{' '}</Text>
              <Text style={{ fontSize: 16 }}>master</Text>
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
          dataSource={this.state.commits}
          renderRow={this._renderRow}
          onEndReached={this._loadMore}
          onEndReachedThreshold={300}
        />
      </View >
    )
  }

  _renderRow(item, sectionKey) {
    return (
      <CommitCard
        messageHeadline={item.messageHeadline}
        oid={item.oid}
        committedDate={item.committedDate}
        author={item.author}
        style={{ width: this.width, borderBottomColor: '#ddd', borderBottomWidth: 1 }}
        onPress={() => {
          return
          // this.pushRepository(this.props.user.login, item.name)
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
})
