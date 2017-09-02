import { StyleSheet, Platform } from 'react-native'

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingBottom: Platform.OS === 'android' ? 0 : 48,
  },
  header: {
    flexDirection: 'row',
    width: this.width,
    backgroundColor: '#fff',
    padding: 10,
    paddingLeft: 16,
    paddingBottom: 20,
  },
  list: {
  },
  item: {
    margin: 0,
  },
})
