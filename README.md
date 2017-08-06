# Gitten

An super easy opensource github client powered by react-native-navigation

```
react@16.0.0-alpha.12
react-native@0.45.1
react-native-navigation@1.1.178
```

### FEATURES

- react-native-navigation by Wix
- redux structure with react-native-persist
- ios and android

### Running your project

##### for react-native-config
```
# .env
GITHUB_CLIENT_ID=<clientId>
GITHUB_CLIENT_SECRET=<clientSecret>
```

From project dir, run:

#### iOS
1. Build and run (this will start a simulator if not already started)

	```sh
    yarn run-i # or react-native run-ios
	```
	This would also start a packager if not already started

2. Set your Simulator to live reload changes `⌘`+`d`  (`cmd`+`d`) => `Enable Live Reload`



#### Android
1. Start an emulator
2. Build and run

	```sh
    yarn run-a # or react-native run-android
	```
	This would also start a packager if not already started


3. Set your Emulator to live reload changes `⌘`+`m`  (`cmd`+`m`) => `Enable Hot Reloading`

To open packager manually, from project dir run:

```sh
react-native start
```

