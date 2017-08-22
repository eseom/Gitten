import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'android' ? 0 : 48,
  },
  list: {
  },
  item: {
    margin: 0,
  },
})
