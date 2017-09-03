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

const customStyle = `
<style>
  * {max-width: 100%;}
  body {
    font-size: 0.8em;
    font-family: sans-serif;
  }
  h1 {font-size: 1.8em;}
  h2 {font-size: 1.7em;}
  h3 {font-size: 1.6em;}
  h4 {font-size: 1.5em;}
  h5 {font-size: 1.3em;}
  h6 {font-size: 1.1em;}
  pre {
    padding: 4px;
    background: #EFEFEF;
    white-space: pre-wrap; /* CSS3*/
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-all; /* Internet Explorer 5.5+ */ 
  }
  a {
    color: #444;
  }
</style>
`

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
    let languages = []
    const readme = r.readme && r.readme.text ? marked(r.readme.text) : ''
    if (r.languages && r.languages.items) {
      // r.languages.totalSize
      languages = r.languages.items.map((l) => {
        const rate = l.size / r.languages.totalSize
        return {
          ...l,
          rate: rate * 100,
          width: (this.width - 20) * rate,
        }
      })
    }

    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 10 }}>
            <View style={{ marginBottom: 10 }}>
              <Text>{r.description ? r.description : '(no description)'}</Text>
            </View>

            <View style={{ width: this.width, flexDirection: 'row' }}>
              {languages.map(l => (
                <View key={l.id} style={{ width: l.width, backgroundColor: l.color, height: 10 }} />
              ))}
            </View>

            <View style={{ marginTop: 10 }}>
              {languages.map(l => (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ backgroundColor: l.color, width: 6, height: 6, borderRadius: 3 }} />
                  <Text>{' '}</Text>
                  <Text style={{ fontSize: 11.5 }} key={l.id}>{l.name} {l.rate.toFixed(1)}%</Text>
                </View>
              ))}
            </View>

            {r.repositoryTopics.length > 0 ?
              <View style={{ marginTop: 20, flexDirection: 'row', flexWrap: 'wrap' }}>
                {r.repositoryTopics.map((t, i) => (
                  <Badge
                    key={i}
                    containerStyle={{ marginBottom: 4, marginRight: 4 }}
                    value={t.topic.name}
                    textStyle={{ fontSize: 12, color: 'white' }}
                  />
                ))}
              </View>
              : null}

            <View style={{ flexDirection: 'row', borderWidth: 1, borderColor: '#ddd', marginTop: 10 }}>
              <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center' }}>
                <Icon name="star" style={{ fontSize: 15, marginRight: 5 }} />
                <Text>{r.stargazers.totalCount}</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
                <Icon name="repo-forked" style={{ fontSize: 15, marginRight: 5 }} />
                <Text>{r.forks.totalCount}</Text>
              </View>
              <View style={{ flexDirection: 'row', padding: 10, flex: 1, justifyContent: 'center', borderLeftWidth: 1, borderColor: '#ddd' }}>
                <Icon name="eye" style={{ fontSize: 15, marginRight: 5 }} />
                <Text>{r.watchers.totalCount}</Text>
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
            source={{ html: customStyle + readme }}
            onMessage={this.onMessage}
          />
        </ScrollView>
      </View>
    )
  }
})
