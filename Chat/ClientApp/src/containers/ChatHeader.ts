import { connect } from 'react-redux';

import { ChatParticipant } from '@azure/communication-chat';

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../src/constants';
import ChatHeader from '../components/ChatHeader';
import { State } from '../core/reducers/index';
import { removeThreadMember } from '../core/sideEffects';
import { CommunicationIdentifier } from '@azure/communication-common';

export type ChatHeaderProps = {
  userId: string;
  existsTopicName: boolean;
  generateHeaderMessage: () => string;
  threadMembers: ChatParticipant[];
  topic: string;
};

export type ChatHeaderDispatchProps = {
  removeThreadMember: (user: CommunicationIdentifier) => void
};

const mapStateToProps = (state: State): ChatHeaderProps => ({
  threadMembers: state.threadMembers.threadMembers,
  topic: state.thread.topic,
  userId: state.contosoClient.user.identity,
  existsTopicName: state.thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
  generateHeaderMessage: () => {
    return 'Teams Adhoc Chat - Hero Sample'
  }
});

const mapDispatchToProps = (dispatch: any): ChatHeaderDispatchProps => ({
  removeThreadMember: (user: CommunicationIdentifier): void => {
    dispatch(removeThreadMember(user))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
