import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
  Event
} from 'react-native-track-player';
export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  }
  catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        // AppKilledPlaybackBehavior.ContinuePlayback // tiếp tục chạy đến hết bài nhạc.
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });
    isSetup = true;
  }
  finally {
    return isSetup;
  }
}
export async function addTracks() {
  await TrackPlayer.add([
    {
      id: '1',
      title: 'Nhạc thiền Yoga thư giãn sâu',
      artist: 'Spotify',
      imageSing: 'https://picsum.photos/200?random=1',
      url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3',
    },
    {
      id: '2',
      title: 'Âm Thanh Thiền Đêm Khuya',
      artist: 'Spotify',
      imageSing: 'https://picsum.photos/200?random=2',
      url: 'https://cdn.pixabay.com/audio/2022/10/18/audio_31c2730e64.mp3',
    },

  ]);
  await TrackPlayer.setRepeatMode(RepeatMode.Queue);
}
export async function playbackService() {
  // Các điều khiển dưới đây khai báo xong bạn có thể điều khiển ở phần notify trên điện thoại
  TrackPlayer.addEventListener(Event.RemotePause, () => {
    console.log('Event.RemotePause');
    TrackPlayer.pause();
  });
  TrackPlayer.addEventListener(Event.RemotePlay, () => {
    console.log('Event.RemotePlay');
    TrackPlayer.play();
  });
  TrackPlayer.addEventListener(Event.RemoteNext, () => {
    console.log('Event.RemoteNext');
    TrackPlayer.skipToNext();
  });
  TrackPlayer.addEventListener(Event.RemotePrevious, () => {
    console.log('Event.RemotePrevious');
    TrackPlayer.skipToPrevious();
  });
}