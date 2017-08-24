import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import { getTitle } from '../utils'

export default class extends Component {
  width
  height

  loadedComponent = false
  tracker

  constructor(props) {
    super(props)

    if (!this.loadedComponent && this._onNavigatorEvent && this.props.navigator) {
      this.props.navigator.setOnNavigatorEvent(this._onNavigatorEvent.bind(this))
    }
    this.loadedComponent = true

    this.width = Dimensions.get('window').width
    this.height = Dimensions.get('window').height
  }
  pushRepository(owner, repo) {
    this.props.navigator.push({
      screen: 'app.Repo',
      name: 'repo',
      ...getTitle(`${owner}/${repo}`),
      backButtonTitle: '',
      passProps: {
        owner,
        repo,
      },
    })
  }
}
