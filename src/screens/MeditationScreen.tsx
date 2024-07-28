import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, FlatList, TouchableOpacity, Button, SafeAreaView, ActivityIndicator } from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  usePlaybackState,
  useProgress,
  Event,
  State
} from 'react-native-track-player';
import { addTracks, setupPlayer } from '../service/servicePlay';
import Playlist from './PlayList';
import Slider from '@react-native-community/slider';
import { Icon } from 'iconsax-react-native';

// function Header() {
//   const [info, setInfo] = useState({});
//   useEffect(() => {
//     setTrackInfo();
//   }, []);
//   useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
//     if (event.state == State.nextTrack) {
//       setTrackInfo();
//     }
//   });
//   async function setTrackInfo() {
//     const track = await TrackPlayer.getCurrentTrack();
//     const info = await TrackPlayer.getTrack(track);
//     setInfo(info);
//   }
//   return (
//     <View>
//       <Text style={styles.songTitle}>{info.title}</Text>
//       <Text style={styles.artistName}>{info.artist}</Text>
//     </View>
//   );
// }
// function TrackProgress() {
//   const { position, duration } = useProgress(200);
//   function format(seconds) {
//     let mins = (parseInt(seconds / 60)).toString().padStart(2, '0');
//     let secs = (Math.trunc(seconds) % 60).toString().padStart(2, '0');
//     return `${mins}:${secs}`;
//   }

//   return (
//     <View>
//       <Text style={styles.trackProgress}>
//         {format(position)} / {format(duration)}
//       </Text>
//       <Slider
//         style={{ width: 365, height: 40 }}
//         minimumValue={0}
//         maximumValue={duration}
//         minimumTrackTintColor="#FFFFFF"
//         maximumTrackTintColor="#000000"
//         value={position}
//       />
//     </View>
//   );
// }

const MeditationScreen = () => {
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  // khi render thì bắt đầu khởi tạo đối tượng chơi nhạc

  useEffect(() => {
    async function setup() {
      let isSetup = await setupPlayer();
      const queue = await TrackPlayer.getQueue();
      if (isSetup && queue.length <= 0) {
        await addTracks();
      }
      setIsPlayerReady(isSetup);
    }
    setup();
  }, []);



  if (!isPlayerReady) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#bbb" />
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center', marginHorizontal: 30 }}>
        <Image source={require('../assets/images/img1.png')} style={styles.image} />
      </View>
      <Text style={styles.title}>Playlist</Text>
      <View style={styles.container}>
        <Playlist />
      </View>
    </View>
  );
};

export default MeditationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 30,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SF-Pro-Rounded-Semibold',
    fontSize: 20,
    color: '#000',
    marginHorizontal: 30
  },
  content: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 16,
  },
  image: {
    width: 300,
    height: 300,
    marginTop: 10
  },
  trackItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  trackTitle: {
    fontFamily: 'SF-Pro-Rounded-Regular',
    fontSize: 16,
  },
  playlist: {
    marginTop: 10,
    marginBottom: 10
  },
  playlistItem: {
    fontSize: 16,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    borderRadius: 4
  },
  trackProgress: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 24,
    color: '#eee'
  },
  songTitle: {
    fontSize: 32,
    marginTop: 50,
    color: '#ccc'
  },
  artistName: {
    fontSize: 24,
    color: '#888'
  },
});
