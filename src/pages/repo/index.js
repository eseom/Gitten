import React from 'react'
import { View, Text } from 'react-native'
import LoadingView from 'react-native-loading-view'
import { connect } from 'react-redux'

import { fetchRepository } from '../../redux/repository'
import styles from './styles'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import Component from '../base'

export default connect(
  store => ({
    repository: store.repository.repository,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  componentWillMount() {
    this.props.dispatch(fetchRepository(this.props.owner, this.props.repo))
  }
  render() {
    const r = this.props.repository
    if (r === null) {
      return (
        <View style={styles.container}>
          <LoadingView loading />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={{ padding: 10 }}>
          <Text>{r.full_name}</Text>
          <Text>{r.description}</Text>
          <Text>{r.html_url}</Text>
          <Text>forks: {r.forks_count}</Text>
          <Text>stars: {r.stargazers_count}</Text>
          <Text>{r.language}</Text>
        </View>
      </View>
    )
  }
})
