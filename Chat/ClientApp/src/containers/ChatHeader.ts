import { connect } from 'react-redux';

import { ChatParticipant } from '@azure/communication-chat';

import { GUID_FOR_INITIAL_TOPIC_NAME } from '../../src/constants';
import ChatHeader from '../components/ChatHeader';
import { State } from '../core/reducers/index';
import { removeThreadMemberByUserId } from '../core/sideEffects';
import { isUserMatchingIdentity } from '../utils/utils';

export type ChatHeaderProps = {
  userId: string;
  existsTopicName: boolean;
  generateHeaderMessage: () => string;
  threadMembers: ChatParticipant[];
  topic: string;
};

export type ChatHeaderDispatchProps = {
  removeChatParticipantById: (userId: string) => Promise<void>;
};

const mapStateToProps = (state: State): ChatHeaderProps => ({
  threadMembers: state.threadMembers.threadMembers,
  topic: state.thread.topic,
  userId: state.contosoClient.user.identity,
  existsTopicName: state.thread.topic !== GUID_FOR_INITIAL_TOPIC_NAME,
  generateHeaderMessage: () => {
    let header = 'Chat with ';

    if (state.threadMembers === undefined) {
      header += 'yourself';
      return header;
    }

    let members = state.threadMembers.threadMembers.filter(
      (member: ChatParticipant) => !isUserMatchingIdentity(member.id, state.contosoClient.user.identity)
    );
    if (members.length === 0) {
      header += 'yourself';
      return header;
    }

    // if we have at least one other participant we want to show names for the first 3
    if (members.length > 0) {
      let namedMembers = members.slice(0, 3);
      header += namedMembers.map((member: ChatParticipant) => member.displayName).join(', ');
    }

    // if we have more than 3 other participants we want to show the number of other participants
    if (members.length > 3) {
      let len = members.length - 3;
      header += ` and ${len} other participant${len === 1 ? '' : 's'}`;
    }

    return header;
  }
});

const mapDispatchToProps = (dispatch: any): ChatHeaderDispatchProps => ({
  removeChatParticipantById: (userId: string) => dispatch(removeThreadMemberByUserId(userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
