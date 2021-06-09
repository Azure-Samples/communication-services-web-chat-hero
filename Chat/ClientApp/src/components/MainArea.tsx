import React, { useState }  from 'react';
import { DefaultButton, Image, Stack } from '@fluentui/react';
import defaultImg from '../assets/default.png';
import { staticImageStyle, staticAreaStyle } from './styles/ChatScreen.styles';
import { tilesStackStyles, tilesStackTokens, tileStyle } from './styles/RoomTile.styles';

export interface MainScreenProps {
  contents: string;
  enterRoomHandler(roomTitle: string): void;
}

export default (props: MainScreenProps): JSX.Element => {
  const imageProps = { src: defaultImg.toString() };
  const { contents } = props;

  const getComponent = () => {
    if (contents === 'welcome') {
        return (
          <div className={staticAreaStyle}>
          <Image
            className={staticImageStyle}
            alt="Default Event Image"
            {...imageProps}
          />
          <h2>Event Description</h2>
          Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
          <h2>Upcoming Sessions</h2>
          <Stack horizontal horizontalAlign="space-evenly" styles={tilesStackStyles} tokens={tilesStackTokens}>
            <DefaultButton className={tileStyle} text="Global All Hands" onClick={() => { props.enterRoomHandler("Global All Hands") }} />
            <DefaultButton className={tileStyle} text="Product Demos" onClick={() => { props.enterRoomHandler("Product Demos") }} />
            <DefaultButton className={tileStyle} text="Ask Me Anything" onClick={() => { props.enterRoomHandler("Ask Me Anything") }}/>
          </Stack>
        </div>
        );
    } else if (contents === 'attendees') {
      return (
        <div className={staticAreaStyle}>
        <h2>Attendees</h2>
        Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
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
