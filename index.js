/**
 * @format
 */

import 'react-native-get-random-values';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { playbackService } from './src/service/servicePlay';
import App from './App';
import { name as appName } from './app.json';
AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => playbackService);
