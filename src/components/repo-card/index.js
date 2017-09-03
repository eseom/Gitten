import React from 'react'
import {
  Text,
  TouchableHighlight,
  View,
  Image,
} from 'react-native'
import Icon from 'react-native-vector-icons/Octicons'

import Component from '../base'

const transDate = (dateString) => {
  const time = new Date(dateString)
  return `${(time.getMonth() + 1)}/${time.getDate()} ${time.getHours()}:${time.getMinutes()}`
}

export default class extends Component {
  render() {
    const avatarWidth = 42
    const { name, owner, updatedAt, stargazers, forks, style = {} } = this.props
    return (
      <View style={style}>
        <TouchableHighlight
          style={{ padding: 10 }}
          underlayColor="#EFEFEF"
          onPress={(e) => {
            this.props.onPress(e)
          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <Image
              source={{ uri: owner.avatarUrl }}
              style={{
                marginRight: 10,
                width: avatarWidth,
                height: avatarWidth,
                borderRadius: avatarWidth / 2,
              }}
            />
            <View style={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text numberOfLines={1} style={{ flex: 1 }} ellipsizeMode="tail">{owner.login}/{name}</Text>
                <Text ellipsizeMode="tail" style={{ alignContent: 'flex-end', fontSize: 12 }}>{transDate(updatedAt)}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="star" />
                  <Text>{' '}</Text>
                  <Text>{stargazers.totalCount}</Text>
                </View>
                <Text>{' '}</Text>
                <Text>{' '}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="repo-forked" />
                  <Text>{' '}</Text>
                  <Text>{forks.totalCount}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View >
    )
  }
}
