import React, { useEffect } from 'react';
import { streamMainStyle } from './styles/Stream.styles';

export default (props: any): JSX.Element => {
  useEffect(() => {
    let createPlayer = () => {
      var myOptions = {
        autoplay: true,
        controls: true,
        width: '100%',
        height: '100%',
        poster: ''
      };

      let _window: any = window;
      var myPlayer = _window.amp('azuremediaplayer', myOptions);
      myPlayer.src([
        {
          src:
            '//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest',
          type: 'application/vnd.ms-sstr+xml'
        }
      ]);
      return myPlayer;
    };

    let player = createPlayer();

    return () => {
      player.dispose();
    }
  }, []);

  return (
    <div className={streamMainStyle}>
      <video
        id="azuremediaplayer"
        className="azuremediaplayer amp-default-skin"
        autoPlay
        controls
        width="100%"
        height="100%"
        poster="poster.jpg"
        data-setup='{"nativeControlsForTouch": false}'
      ></video>
    </div>
  );
};
