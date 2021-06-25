import { CallAgent, CallEndReason, LocalVideoStream } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CommunicationUserToken } from '@azure/communication-identity';
import { connect } from 'react-redux';

import RoomMainArea, { RoomMainAreaProps } from '../components/RoomMainArea';
import { setCallAgent, setGroup } from '../core/actions/calls';
import { setRoomId } from '../core/actions/EventAction';
import { setUserId } from '../core/actions/sdk';
import { State } from '../core/reducers/index';
import { addUserToRoomThread, setRoomThreadId, removeThreadMemberByUserId, initCallClient, registerToCallAgent, joinGroup, getRoomCallId } from '../core/sideEffects';
import { utils } from '../utils/utils';

export type TokenResponse = {
  tokenCredential: AzureCommunicationTokenCredential;
  userId: string;
};

const mapDispatchToProps = (dispatch: any) => ({
  setupRoom: async () => {
    dispatch(addUserToRoomThread());
  },
  setRoomId: async (roomId: string) => dispatch(setRoomId(roomId)),
  setRoomThreadId: async (roomId: string) => dispatch(setRoomThreadId(roomId)),
  removeChatParticipantById: (userId: string) => dispatch(removeThreadMemberByUserId(userId)),
  setupCallClient: (unsupportedStateHandler: () => void): void => dispatch(initCallClient(unsupportedStateHandler)),
  registerToCallEvents: async (
    userId: string,
    callAgent: CallAgent,
    endCallHandler: (reason: CallEndReason) => void
  ): Promise<void> => {
    dispatch(setUserId(userId));
    dispatch(setCallAgent(callAgent));
    dispatch(registerToCallAgent(userId, callAgent, endCallHandler));
  },
  setGroup: (groupId: string): void => dispatch(setGroup(groupId)),
  getRoomCallId: (): string => dispatch(getRoomCallId()),
});

const mapStateToProps = (state: State, props: RoomMainAreaProps) => ({
  userId: state.contosoClient.user.identity,
  roomId: state.event.roomId,
  getToken: async (): Promise<TokenResponse> => {
    const tokenResponse: CommunicationUserToken = await utils.getTokenForUser();
    const userToken = tokenResponse.token;
    const userId = tokenResponse.user.communicationUserId;

    const tokenCredential = new AzureCommunicationTokenCredential({
      tokenRefresher: (): Promise<string> => {
        return utils.getRefreshedTokenForUser(userId);
      },
      refreshProactively: true,
      token: userToken
    });

    return {
      tokenCredential,
      userId
    };
  },
  createCallAgent: async (
    tokenCredential: AzureCommunicationTokenCredential,
    displayName: string
  ): Promise<CallAgent> => {
    const callClient = state.sdk.callClient;

    if (callClient === undefined) {
      throw new Error('CallClient is not initialized');
    }

    const callAgent: CallAgent = await callClient.createCallAgent(tokenCredential, { displayName });
    return callAgent;
  },
  joinGroup: async (callAgent: CallAgent, groupId: string, localVideoStream: LocalVideoStream): Promise<void> => {
    callAgent &&
      (await joinGroup(
        callAgent,
        {
          groupId
        },
        {
          videoOptions: {
            localVideoStreams: localVideoStream ? [localVideoStream] : undefined
          },
          audioOptions: { muted: !state.controls.mic }
        }
      ));
  },
});

const connector: any = connect(mapStateToProps, mapDispatchToProps);
export default connector(RoomMainArea);
