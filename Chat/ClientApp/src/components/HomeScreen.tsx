// © Microsoft Corporation. All rights reserved.
import { Icon, Image, PrimaryButton, Stack, IImageStyles, Spinner } from '@fluentui/react';
import { AttendeeIcon } from '@fluentui/react-icons-northstar';
import React, { useState } from 'react';

import heroSVG from '../assets/hero.svg';
import {
  buttonStyle,
  containerTokens,
  headerStyle,
  iconStyle,
  imgStyle,
  listStyle,
  moreInfoStyle,
  nestedStackTokens,
  upperStackStyle,
  upperStackTokens,
  videoCameraIconStyle,
  startChatTextStyle
} from './styles/HomeScreen.styles';

export interface HomeScreenProps {
  createThreadHandler(): void;
}

const imageStyleProps: IImageStyles = {
  image: {
    height: '100%'
  },
  root: {}
};

export default (props: HomeScreenProps): JSX.Element => {
  const spinnerLabel = 'Creating a new chat thread...';
  const imageProps = { src: heroSVG.toString() };
  const headerTitle = 'Virtual Event Hackathon';
  const startChatButtonText = 'Join Event';

  const [isCreatingThread, setIsCreatingThread] = useState(false);

  const onCreateThread = () => {
    props.createThreadHandler();
    setIsCreatingThread(true);
  };

  const creatThreadLoading = () => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const homeScreen = () => {
    return (
      <div>
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={containerTokens}>
          <Stack className={upperStackStyle} tokens={upperStackTokens}>
            <div tabIndex={0} className={headerStyle}>
              {headerTitle}
            </div>
            powered by ACS
            <PrimaryButton
              id="startChat"
              role="main"
              aria-label="Start chat"
              className={buttonStyle}
              onClick={() => {
                const urlParams = new URLSearchParams(window.location.search);
                if(!urlParams.get('eventId'))
                  window.location.href += `?eventId=acs_ve_06_07_2021`;
                onCreateThread(); // Uncommenting it in case we want to get a new thread id.
              }}
            >
              <AttendeeIcon className={videoCameraIconStyle} size="medium" />
              <div className={startChatTextStyle}>{startChatButtonText}</div>
            </PrimaryButton>
          </Stack>
          <Image
            styles={imageStyleProps}
            alt="Virtual Event"
            className={imgStyle}
            {...imageProps}
          />
        </Stack>
      </div>
    );
  };

  return isCreatingThread ? creatThreadLoading() : homeScreen();
};
