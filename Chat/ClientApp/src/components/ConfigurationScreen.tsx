import { PrimaryButton, Stack, Spinner } from '@fluentui/react';
import { ChatIcon } from '@fluentui/react-icons-northstar';
import React, { useEffect, useState } from 'react';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';

import { buttonStyle, chatIconStyle, mainContainerStyle } from './styles/ConfigurationScreen.styles';
import {
  labelFontStyle,
  largeAvatarContainerStyle,
  largeAvatarStyle,
  leftPreviewContainerStyle,
  namePreviewStyle,
  responsiveLayoutStyle,
  rightInputContainerStyle,
  smallAvatarContainerStyle,
  smallAvatarStyle,
  startChatButtonTextStyle
} from './styles/ConfigurationScreen.styles';
import { CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX, getThreadId } from '../utils/utils';
import DisplayNameField from './DisplayNameField';
import { MAXIMUM_LENGTH_OF_NAME } from '../constants';

export interface ConfigurationScreenProps {
  joinChatHandler(): void;
  setup(displayName: string, emoji: string): void;
  isValidThread(threadId: string | null): any;
}

export default (props: ConfigurationScreenProps): JSX.Element => {
  const spinnerLabel = 'Initializing chat client...';

  const avatarsList = [CAT, MOUSE, KOALA, OCTOPUS, MONKEY, FOX];
  const [name, setName] = useState('');

  const [emptyWarning, setEmptyWarning] = useState(false);

  const [isNameLengthExceedLimit, setNameLengthExceedLimit] = useState(false);

  const [selectedAvatar, setSelectedAvatar] = useState(CAT);

  const [isJoining, setIsJoining] = useState(false);

  const [isValidThread, setIsValidThread] = useState<boolean | undefined>(undefined);

  const { joinChatHandler, setup } = props;

  const onAvatarChange = (newAvatar: string) => {
    setSelectedAvatar(newAvatar);
  };

  const validateName = () => {
    if (!name) {
      setEmptyWarning(true);
      setNameLengthExceedLimit(false);
    } else if (name.length > MAXIMUM_LENGTH_OF_NAME) {
      setEmptyWarning(false);
      setNameLengthExceedLimit(true);
    } else {
      setEmptyWarning(false);
      setNameLengthExceedLimit(false);
      if (!isJoining) {
        setup(name, selectedAvatar);
        setIsJoining(true);
      }
    }
  };

  const isValidThreadProp = props.isValidThread;

  useEffect(() => {
    const isValidThread = async () => {
      if (await isValidThreadProp(getThreadId())) {
        setIsValidThread(true);
      } else {
        setIsValidThread(false);
      }
    };
    isValidThread();
    document.getElementById('🐱')?.focus();
  }, [isValidThreadProp]);

  const invalidChatThread = () => {
    return (
      <div>
        <p>thread Id is not valid</p>
      </div>
    );
  };

  const joinChatLoading = () => {
    return <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />;
  };

  const joinChatArea = () => {
    return (
      <div>
        <Stack className={responsiveLayoutStyle} horizontal={true} horizontalAlign="center" verticalAlign="center">
          <Stack
            className={leftPreviewContainerStyle}
            horizontal={false}
            verticalAlign="center"
            horizontalAlign="center"
            tokens={{ childrenGap: 13 }}
          >
            <div className={largeAvatarContainerStyle(selectedAvatar)}>
              <div className={largeAvatarStyle}>{selectedAvatar}</div>
            </div>
            <div aria-label="Display name" className={namePreviewStyle(name !== '')}>
              {name !== '' ? name : 'Name'}
            </div>
          </Stack>
          <Stack className={rightInputContainerStyle} horizontal={false} tokens={{ childrenGap: 20 }}>
            <div>
              <div className={labelFontStyle}>Avatar</div>
              <FocusZone direction={FocusZoneDirection.horizontal}>
                <Stack role="list" horizontal={true} tokens={{ childrenGap: 4 }}>
                  {avatarsList.map((avatar, index) => (
                    <div
                      role="listitem"
                      id={avatar}
                      key={index}
                      tabIndex={0}
                      data-is-focusable={true}
                      className={smallAvatarContainerStyle(avatar, selectedAvatar)}
                      onFocus={() => onAvatarChange(avatar)}
                    >
                      <div className={smallAvatarStyle}>{avatar}</div>
                    </div>
                  ))}
                </Stack>
              </FocusZone>
            </div>
            <DisplayNameField
              setName={setName}
              setEmptyWarning={setEmptyWarning}
              setNameLengthExceedLimit={setNameLengthExceedLimit}
              validateName={validateName}
              isEmpty={emptyWarning}
              isNameLengthExceedLimit={isNameLengthExceedLimit}
            />
            <div>
              <PrimaryButton
                id="join"
                className={buttonStyle}
                onClick={() => {
                  validateName();
                  if (emptyWarning === false && isNameLengthExceedLimit === false) {
                    joinChatHandler();
                  }
                }}
              >
                <ChatIcon className={chatIconStyle} size="medium" />
                <div className={startChatButtonTextStyle}>Join chat</div>
              </PrimaryButton>
            </div>
          </Stack>
        </Stack>
      </div>
    );
  };

  const configurationScreen = () => {
    return (
      <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
        {isValidThread === false ? invalidChatThread() : joinChatArea()}
      </Stack>
    );
  };

  return isJoining ? joinChatLoading() : configurationScreen();
};
