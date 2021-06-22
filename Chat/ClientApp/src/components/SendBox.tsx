import { Stack, TextField } from '@fluentui/react';
import { SendIcon } from '@fluentui/react-northstar';
import React, { useState, Dispatch } from 'react';

import { ENTER_KEY, EMPTY_MESSAGE_REGEX, MAXIMUM_LENGTH_OF_MESSAGE } from '../../src/constants';
import { sendBoxStyle, sendIconStyle, textFieldStyle, TextFieldStyleProps } from './styles/SendBox.styles';
import { User } from '../core/reducers/ContosoClientReducers';
import {
  AudioDeviceInfo,
  Call,
  CommunicationServicesError,
  GroupCallLocator,
  JoinCallOptions,
  DeviceManager,
  DeviceAccess,
  RemoteParticipant,
  VideoDeviceInfo,
  CallAgent,
  CallClient,
  HangUpOptions,
  CallEndReason
} from '@azure/communication-calling';
import { CommunicationUserKind } from '@azure/communication-common';
import { utils } from '../utils/utils';
import { callAdded, callRemoved, setCallState, setParticipants, setCallAgent } from './actions/calls';
import { setMic, setShareScreen } from './actions/controls';
import {
  setAudioDeviceInfo,
  setAudioDeviceList,
  setCameraPermission,
  setMicrophonePermission,
  setVideoDeviceInfo,
  setVideoDeviceList,
  setDeviceManager
} from './actions/devices';
import { addScreenShareStream, removeScreenShareStream } from './actions/streams';
import { State } from './reducers';
import { setLogLevel } from '@azure/logger';
import RemoteStreamSelector from './RemoteStreamSelector';
import { Constants } from './constants';
import { setCallClient, setUserId } from './actions/sdk';

interface SendboxProps {
  onSendMessage(messageContent: string): void;
  onSendTypingNotification(
    lastSentTypingNotificationDate: number,
    setLastSentTypingNotificationDate: Dispatch<number>
  ): void;
  user: User;
}

export default (props: SendboxProps): JSX.Element => {
  const [textValue, setTextValue] = useState('');
  const [textValueOverflow, setTextValueOverflow] = useState(false);
  const [lastSentTypingNotificationDate, setLastSentTypingNotificationDate] = useState(0);

  const addMessage = () => {
    // we dont want to send empty messages including spaces, newlines, tabs
    if (!EMPTY_MESSAGE_REGEX.test(textValue)) {
      props.onSendMessage(textValue);
      setTextValue('');
    }
  };
  const setText = (e: any) => {
    if (e.target.value.length > MAXIMUM_LENGTH_OF_MESSAGE) {
      setTextValueOverflow(true);
    } else {
      setTextValueOverflow(false);
    }
    setTextValue(e.target.value);
  };

  return (
    <div>
      <Stack horizontal={true}>
        <TextField
          className={textFieldStyle}
          id="sendbox"
          borderless={true}
          ariaLabel={'Type'}
          inputClassName={sendBoxStyle}
          placeholder="Type your message"
          value={textValue}
          onChange={setText}
          autoComplete="off"
          onKeyUp={(ev) => {
            if (ev.which === ENTER_KEY && !textValueOverflow) {
              addMessage();
            }
            props.onSendTypingNotification(lastSentTypingNotificationDate, setLastSentTypingNotificationDate);
          }}
          styles={TextFieldStyleProps}
        />
        <SendIcon
          outline
          className={sendIconStyle}
          id="sendmessage"
          onClick={() => {
            if (!textValueOverflow) {
              addMessage();
            }
          }}
        />
      </Stack>
    </div>
  );
};
