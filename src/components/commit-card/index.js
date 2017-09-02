import React from 'react'
import {
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import styles from './styles'
import Component from '../base'

const transDate = (dateString) => {
  const time = new Date(dateString)
  return `${(time.getMonth() + 1)}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
}

export default class extends Component {
  render() {
    const avatarWidth = 42
    const { committedDate, author, messageHeadline, oid, style = {} } = this.props
    return (
      <View style={style}>
        <TouchableHighlight
          style={styles.box}
          underlayColor="#EFEFEF"
          onPress={(e) => {
            this.props.onPress(e)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: author.avatarUrl }}
              style={{
                marginRight: 10,
                width: avatarWidth,
                height: avatarWidth,
                borderRadius: avatarWidth / 2,
              }}
            />
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{messageHeadline}</Text>
                <Text ellipsizeMode="tail" style={{ alignContent: 'flex-end', fontSize: 12 }}>{transDate(committedDate)}</Text>
              </View>
              <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{oid.substring(0, 7)}</Text>
            </View>
          </View>
        </TouchableHighlight>
      </View >
    )
  }
}
