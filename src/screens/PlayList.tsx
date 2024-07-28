import { Next, Pause, PauseCircle, Play, PlayCircle, Previous } from 'iconsax-react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import TrackPlayer, {
  useTrackPlayerEvents,
  Event,
  State,
  usePlaybackState
} from 'react-native-track-player';
import Icon from 'react-native-vector-icons/FontAwesome';
import Color from '../style/Color';

function Controls({ onShuffle }) {
  const playerState = usePlaybackState();
  async function handlePlayPress() {
    if (await TrackPlayer.getState() == State.Playing) {
      TrackPlayer.pause();
    }
    else {
      TrackPlayer.play();
    }
  }
  return (
    <View style={{
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 20
    }}>
      <Previous
        size={28}
        color={Color.hintColor}
        variant='Bold'
        onPress={() => TrackPlayer.skipToPrevious()} />
      {playerState.state == State.Playing ? (
        <PauseCircle size="40" color={Color.primaryColor} variant='Bold' onPress={handlePlayPress} />
      ) : (
        <PlayCircle size="40" color={Color.primaryColor} variant='Bold' onPress={handlePlayPress} />
      )}
      <Next
        size={28}
        color={Color.hintColor}
        variant='Bold'
        onPress={() => TrackPlayer.skipToNext()} />
    </View>
  );
}
const Playlist = () => {
  const [queue, setQueue] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(0);
  async function loadPlaylist() {
    const queue = await TrackPlayer.getQueue();
    setQueue(queue);
  }
  useEffect(() => {
    loadPlaylist();
  }, []);
  useTrackPlayerEvents([Event.PlaybackTrackChanged], (event) => {
    if (event.state == State.nextTrack) {
      TrackPlayer.getCurrentTrack().then((index) => setCurrentTrack(index));
    }
  });
  function PlaylistItem({ index, item, isCurrent }) {
    function handleItemPress() {
      TrackPlayer.skip(index);
    }
    return (
      <TouchableOpacity onPress={handleItemPress}>
        <View style={{
          flexDirection: 'row', alignItems: 'center',
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#F1F1F1',
          marginHorizontal: 10,
        }}>
          <View>
            <Image source={{ uri: item.imageSing }} width={50} height={50} style={styles.image} />
          </View>
          <View>
            <Text
              style={{
                ...styles.playlistItem,
                ...{ color: isCurrent ? Color.primaryColor : '#000' }
              }}>
              {item.title}
            </Text>
            <Text style={styles.artist}>
              {item.artist}
            </Text>
          </View>

        </View>

      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.playlist}>
        <FlatList
          data={queue}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <PlaylistItem
            index={index}
            item={item}
            isCurrent={currentTrack == index} />
          }
        />
      </View>
      <View style={styles.controlBg}>
        <Controls />
      </View>
    </View>
  );
}

export default Playlist;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // chú ý màu tương phản giữa chữ và nền để nhìn được các phần tử
  },
  playlist: {
    marginTop: 10,
    marginHorizontal: 20
  },
  playlistItem: {
    fontSize: 18,
    fontFamily: 'SF-Pro-Rounded-Medium',

  },
  image: {
    borderRadius: 10,
    marginEnd: 16
  },
  artist: {
    fontSize: 14,
    fontFamily: 'SF-Pro-Rounded-Regular',
    color: Color.hintColor,
    marginTop: -8
  },
  controlBg: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    marginBottom: 90
  }
});