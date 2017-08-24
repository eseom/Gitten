/* eslint-disable new-cap */
import { PixelRatio } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Octicons from 'react-native-vector-icons/Octicons'

const navIconSize = (__DEV__ === false && Platform.OS === 'android') ? PixelRatio.getPixelSizeForLayoutSize(40) : 40 // eslint-disable-line
const replaceSuffixPattern = /--(active|big|small|very-big)/g
const icons = {
  'ios-menu': [30],
  'ios-person-add': [30],
  'ios-exit': [30],
  'ios-home-outline': [30],
  'ios-home': [30],

  'md-menu': [30],
  'md-person-add': [25],
  'md-exit': [30],
  'md-home': [30],
  'md-briefcase': [30],
  'md-trending-up': [30],

  'md-people': [30],

  repo: [26, '#000', Octicons],
}

const iconsMap = {}
const iconsLoaded = new Promise((resolve, reject) => {
  Promise.all(
    Object.keys(icons).map(iconName =>
      // IconName--suffix--other-suffix is just the mapping name in iconsMap
      (icons[iconName][2] || Ionicons).getImageSource(
        iconName.replace(replaceSuffixPattern, ''),
        icons[iconName][0],
        icons[iconName][1],
      ))).then((sources) => {
        Object.keys(icons)
          .forEach((iconName, idx) => (iconsMap[iconName] = sources[idx]))

        // Call resolve (and we are done)
        resolve(true)
      })
})

export {
  iconsMap,
  iconsLoaded,
}
