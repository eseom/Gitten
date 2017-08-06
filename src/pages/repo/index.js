import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { connect } from 'react-redux'

import { fetchRepository } from '../../redux/repository'
import styles from './styles'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line

export default connect(
  store => ({
    repository: store.repository.repository,
  }),
  dispatch => ({ dispatch }),
)(class extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  componentDidMount() {
    this.props.dispatch(fetchRepository(this.props.name))
  }
  render() {
    const r = this.props.repository
    if (r === null) {
      return <View style={styles.container} />
    }
    if (!r || !r.url) {
      return (
        <View />
      )
    }
    return (
      <View style={styles.container}>
        <View style={{ padding: 10 }}>
          <Text>{r.description}</Text>
          <Text>{r.url}</Text>
          <Text>forks: {r.forks.totalCount}</Text>
          <Text>stars: {r.stargazers.totalCount}</Text>
          <Text>{r.languages.edges.map(n => n.node.name).join(', ')}</Text>
          <Text>repository topics: {r.repositoryTopics.edges.map(n => n.node.topic.name).join(', ')}</Text>
        </View>
      </View >
    )
  }
})
