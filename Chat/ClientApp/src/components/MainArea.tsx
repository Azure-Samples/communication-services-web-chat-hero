import React, { useEffect } from 'react';
import { DefaultButton, Image, Stack } from '@fluentui/react';
import defaultImg from '../assets/default.png';
import { staticImageStyle, staticAreaStyle } from './styles/ChatScreen.styles';
import { tilesStackStyles, tilesStackTokens, tileStyle } from './styles/RoomTile.styles';
import RoomMainArea from '../containers/RoomMainArea';
import { AcsRoom } from '../core/actions/EventAction';

export interface MainScreenProps {
  contents: string;
  roomTitle: string;
  setMainArea({ }): void;
  resetMessages(): void;
  getRooms(): Record<string, AcsRoom>;
  setRoom(rId: string): void;
}

export default (props: MainScreenProps): JSX.Element => {
  const imageProps = { src: defaultImg.toString() };
  const { contents, roomTitle, setMainArea, getRooms, setRoom } = props;

  const getComponent = () => {
    if (contents === 'welcome') {
        const rooms = getRooms();
        return (
          <div className={staticAreaStyle}>
          <Image
            className={staticImageStyle}
            alt="Default Event Image"
            {...imageProps}
          />
          <h2>Event Description</h2>
          Welcome to Contoso Fest 2021! Check out the latest announcements at our gloabl all-hands, see our cutting edge Contoso tech in demo sessions, or Ask Anything of our fearless leadership team.
          <h2>Upcoming Sessions</h2>
            <Stack horizontal horizontalAlign="space-evenly" styles={tilesStackStyles} tokens={tilesStackTokens}>
              {
                Object.entries(rooms).map((value) => {
                  return <DefaultButton className={tileStyle} text={value[1].title} onClick={() => { setMainArea({ contentType: "room", roomTitle: value[1].title }); setRoom(value[1].id); props.resetMessages(); }} />
                })
              }
          </Stack>
        </div>
        );
    } else if (contents === 'room') {
      return (
        <div className={staticAreaStyle}>
          <RoomMainArea roomTitle={roomTitle} backToChatScreenHander={() => { props.setMainArea({ contentType: "welcome" }); props.resetMessages(); }} />
        </div>
      );
    } else {
      return (
        <div className={staticAreaStyle}>
        <h2>ERROR</h2>
        Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </div>
      );
    }
  }
  
  return getComponent()
};
