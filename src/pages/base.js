import React, { Component } from 'react'
import { Dimensions } from 'react-native'
// import Config from 'react-native-config'

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
}
