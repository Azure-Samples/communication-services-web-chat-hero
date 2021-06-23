import { CallAgent, CallEndReason } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ActionButton, FontIcon, IIconProps, PrimaryButton, Stack } from '@fluentui/react';
import { AttendeeIcon } from '@fluentui/react-icons-northstar';
import React, { useCallback, useEffect, useState } from 'react';
import GroupCall from '../containers/GroupCall';
import { TokenResponse } from '../containers/RoomMainArea';
import Stream from './Stream';
import { staticAreaStyle } from './styles/ChatScreen.styles';
import { videoCameraIconStyle } from './styles/Configuration.styles';
import { backButtonStyle, calendarIconStyle, headerTextStyle, roomMainAreaStackStyles,  timeIconStyle, joinCallButtonStyle, callAreaStyle, joinCallTextStyle } from './styles/RoomMainArea.styles';

const backIcon: IIconProps = { iconName: 'Back' };

export interface RoomMainAreaProps {
  roomTitle: string;
  userId: string;
  setupRoom(): void;
  setRoomThreadId(roomId: string): void;
  backToChatScreenHander(): void;
  removeChatParticipantById: (userId: string) => Promise<void>;
  getToken(): Promise<TokenResponse>;
  createCallAgent(tokenCredential: AzureCommunicationTokenCredential, displayName: string): Promise<CallAgent>;
  registerToCallEvents(
    userId: string,
    callAgent: CallAgent,
    endCallHandler: (reason: CallEndReason) => void
  ): Promise<void>;
  joinGroup(callAgent: CallAgent, groupId: string): void;
  callEndedHandler: (reason: CallEndReason) => void;
  setGroup(groupId: string): void;
  setupCallClient(unsupportedStateHandler: () => void): void;
  getRoomCallId(): string;
}

const unsupportedStateHandler = () => {};

export default (props: RoomMainAreaProps): JSX.Element => {
  const { setupRoom, setRoomThreadId, backToChatScreenHander, removeChatParticipantById, setGroup, getRoomCallId, setupCallClient } = props;

  useEffect(()=>{
    setRoomThreadId("room1");
    setupRoom();
  }, []);

  const backButtonHandler = () => {
    removeChatParticipantById(props.userId);
    setRoomThreadId("main");
    setupRoom();
    backToChatScreenHander();
  }

  const memoizedSetupCallClient = useCallback(() => setupCallClient(unsupportedStateHandler), [
    unsupportedStateHandler
  ]);
  useEffect(() => {
    memoizedSetupCallClient();
  }, [memoizedSetupCallClient]);

  const [isOnCall, setIsOnCall] = useState(false);

  return (
    <div className={staticAreaStyle}>
      <ActionButton className={backButtonStyle} iconProps={backIcon} onClick={backButtonHandler}>
        Back to all rooms
      </ActionButton>
      <h1>
        {props.roomTitle}
      </ h1>
      <Stack styles={roomMainAreaStackStyles} >
        <h3 className={headerTextStyle}>
          <FontIcon aria-label="Calendar" iconName="Calendar" className={calendarIconStyle} />
          June 9th, 2021
        </h3>
        <h3 className={headerTextStyle}>
          <FontIcon aria-label="DateTime" iconName="DateTime" className={timeIconStyle} />
          08:00AM - 12:00PM PST (UTC - 8:00)
        </h3>
      </ Stack>
      <Stream />
      <div className={callAreaStyle}>
        { !isOnCall ? (
          <PrimaryButton
            id="joinCall"
            role="main"
            aria-label="Join Call"
            className={joinCallButtonStyle}
            onClick={async (): Promise<void> => {
              //1. Retrieve a token
              const { tokenCredential, userId } = await props.getToken();
              //2. Initialize the call agent
              const callAgent = await props.createCallAgent(tokenCredential, props.userId);
              //3. Register for calling events
              props.registerToCallEvents(userId, callAgent, props.callEndedHandler);
              //4. Join the call
              await props.joinGroup(callAgent, getRoomCallId());
              setGroup(getRoomCallId());
              setIsOnCall(true);
            }}
          >
            <AttendeeIcon className={videoCameraIconStyle} size="medium" />
            <div className={joinCallTextStyle}>Join call</div>
          </PrimaryButton>
        )
        :
        (
          <GroupCall
            endCallHandler={(): void => setIsOnCall(false)}
            groupId={getRoomCallId()}
            screenWidth={250}
          />
        )
      }
      </div>
    </div>
  );
};

