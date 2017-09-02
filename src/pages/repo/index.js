import React from 'react'
import { View, Text, WebView, Linking, ScrollView } from 'react-native'
import { List, ListItem } from 'react-native-elements'

import LoadingView from 'react-native-loading-view'
import { Badge } from 'react-native-elements'
import { connect } from 'react-redux'
import marked from 'marked'

import { fetchRepository } from '../../redux/repository'
import styles from './styles'
import { navigatorStyle as commonNavigatorStyle } from '../../styles' // eslint-disable-line
import Component from '../base'
import Icon from 'react-native-vector-icons/Octicons'
import { getTitle } from '../../utils'

const injectScript = `
setTimeout(function () {
  html = document.documentElement;
  window.postMessage('height_' + html.offsetHeight);
}, 500)
(function () {
  window.onclick = function(e) {
    e.preventDefault();
    window.postMessage(e.target.href);
    e.stopPropagation()
  }
}());
`

const customStyle = '<style>* {max-width: 100%;} body {font-family: sans-serif;}</style>'

export default connect(
  store => ({
    store,
    repository: store.repository.repository,
  }),
  dispatch => ({ dispatch }),
)(class Repo extends Component {
  static navigatorStyle = { ...commonNavigatorStyle }

  state = {
    height: 0,
    heightReceived: false,
  }

  constructor(props) {
    super(props)

    this.onMessage = this.onMessage.bind(this)
  }

  componentWillMount() {
    this.props.dispatch(fetchRepository(this.props.owner, this.props.repo))
  }

  onMessage({ nativeEvent }) {
    const data = nativeEvent.data
    // debug check loop: console.log(data)
    if (data.substring(0, 6) === 'height') {
      // prevent loop [render => get height => set height => render]
      if (!this.state.heightReceived) {
        this.setState({
          height: parseInt(data.split('_')[1], 10),
          heightReceived: true,
        })
      }
      return
    }
    if (data === 'undefined' || data === null) return
    Linking.openURL(data)
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
    r.content = r.content ? marked(r.content) : ''
    return (
      <ScrollView style={styles.container}>
        <View style={{ padding: 10 }}>
          <View style={{ marginBottom: 10 }}>
            <Text>{r.description ? r.description : '(no description)'}</Text>
          </View>

          {Object.keys(r.languages).map(l => (
            <Text key={l}>{l} {r.languages[l]}</Text>
          ))}

          {r.topics.length > 0 ?
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
            : null}

          <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ddd', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center' }}>
              <Icon name="star" style={{ fontSize: 15, marginRight: 5 }} />
              <Text>{r.stargazers_count}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
              <Icon name="repo-forked" style={{ fontSize: 15, marginRight: 5 }} />
              <Text>{r.forks_count}</Text>
            </View>
            <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
              <Icon name="eye" style={{ fontSize: 15, marginRight: 5 }} />
              <Text>{r.subscribers_count}</Text>
            </View>
          </View>

          <View>
            <List containerStyle={{ marginBottom: 20 }}>
              <ListItem
                containerStyle={{ backgroundColor: 'white' }}
                leftIcon={<Icon name="git-commit" style={{ fontSize: 30 }} />}
                titleStyle={{ paddingLeft: 10, fontSize: 15 }}
                roundAvatar
                underlayColor={'#EFEFEF'}
                chevronColor={'#000'}
                onLongPress={() => {
                }}
                onPress={() => {
                  this.props.navigator.push({
                    screen: 'app.Commits',
                    name: 'commits',
                    ...getTitle(`${this.props.owner}/${this.props.repo}`),
                    backButtonTitle: '',
                    passProps: {
                      owner: this.props.owner,
                      repo: this.props.repo,
                    },
                  })
                }}
                title={'commits'}
              />
              <ListItem
                containerStyle={{ backgroundColor: 'white' }}
                leftIcon={<Icon name="code" style={{ fontSize: 29 }} />}
                titleStyle={{ paddingLeft: 10, fontSize: 15 }}
                roundAvatar
                underlayColor={'#EFEFEF'}
                chevronColor={'#000'}
                onLongPress={() => {
                  console.log('long')
                }}
                title="source"
                onPress={() => {
                }}
              />
            </List>
          </View>


          {/* <View style={{ flexDirection: 'row' }}>
            <Icon name="link-external" style={{ fontSize: 18, alignItems: 'center' }} />
            <Text>{r.html_url}</Text>
          </View> */}
        </View>


        <WebView
          style={{ height: this.state.height, padding: this.state.heightReceived ? 10 : 0 }}
          automaticallyAdjustContentInsets={false}
          scrollEnabled={false}
          injectedJavaScript={injectScript}
          startInLoadingState
          source={{ html: customStyle + r.content }}
          onMessage={this.onMessage}
        />
      </ScrollView>
    )
  }
})
