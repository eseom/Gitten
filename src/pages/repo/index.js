import React from 'react'
import { View, Text } from 'react-native'
import LoadingView from 'react-native-loading-view'
import { Badge } from 'react-native-elements'
import { connect } from 'react-redux'

import { fetchRepository } from '../../redux/repository'
import styles from './styles'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import Component from '../base'
import Icon from 'react-native-vector-icons/Octicons'

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
          <View style={{ marginBottom: 10 }}>
            <Text>{r.description}</Text>
          </View>

          {Object.keys(r.languages).map(l => (
            <Text key={l}>{l} {r.languages[l]}</Text>
          ))}

          <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
            {r.topics.map((t, i) => (
              <Badge
                key={i}
                containerStyle={{ marginBottom: 4, marginRight: 4 }}
                value={t}
                textStyle={{ color: 'white' }}
              />
            ))}
          </View>

          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ddd', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center' }}>
              <Icon name="star" style={{ fontSize: 20, marginRight: 5 }} />
              <Text>{r.stargazers_count}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
              <Icon name="repo-forked" style={{ fontSize: 20, marginRight: 5 }} />
              <Text>{r.forks_count}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
              <Icon name="eye" style={{ fontSize: 20, marginRight: 5 }} />
              <Text>{r.subscribers_count}</Text>
            </View>
          </View>

          {/* <View style={{ flexDirection: 'row' }}>
            <Icon name="link-external" style={{ fontSize: 18, alignItems: 'center' }} />
            <Text>{r.html_url}</Text>
          </View> */}
        </View>
      </View>
    )
  }
})
