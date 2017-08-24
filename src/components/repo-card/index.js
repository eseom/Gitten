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
    const { item } = this.props
    return (
      <View style={{ width: this.width, borderBottomColor: '#ddd', borderBottomWidth: 1 }}>
        <TouchableHighlight
          style={{ padding: 10 }}
          underlayColor="#EFEFEF"
          onPress={(e) => {
            this.props.onPress(e)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: item.owner.avatar_url }}
              style={{
                marginRight: 10,
                width: avatarWidth,
                height: avatarWidth,
                borderRadius: avatarWidth / 2,
              }}
            />
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{item.full_name}</Text>
                <Text ellipsizeMode="tail" style={{ alignContent: 'flex-end', fontSize: 12 }}>{transDate(item.updated_at)}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" />
                  <Text>{' '}</Text>
                  <Text>{item.stargazers_count}</Text>
                </View>
                <Text>{' '}</Text>
                <Text>{' '}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="repo-forked" />
                  <Text>{' '}</Text>
                  <Text>{item.forks_count}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View >
    )
  }
}
