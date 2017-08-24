import { Platform } from 'react-native'

/**
 * get a title object for the current platform
 *
 * @param {string} title
 */
export const getTitle = title =>
  (Platform.OS === 'ios' ? {
    title,
  }
    : {
      title: 'Gitten',
      subtitle: title,
    })
