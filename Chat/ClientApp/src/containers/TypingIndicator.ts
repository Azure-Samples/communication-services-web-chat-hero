import { connect } from 'react-redux';

import TypingIndicator from '../components/TypingIndicator';
import { State } from '../core/reducers/index';
import { PARTICIPANTS_THRESHOLD, MAXIMUM_LENGTH_OF_TYPING_USERS } from '../constants';
import { ChatParticipant } from '@azure/communication-chat';
import { CommunicationUserIdentifier, isCommunicationUserIdentifier, isMicrosoftTeamsUserIdentifier } from '@azure/communication-common';
import { getDisplayableId } from '../utils/utils';

const mapStateToProps = (state: State) => ({
  generateTypingIndicatorList: () => {
    let typingUsersFromStore = state.chat.typingUsers;
    let contosoUsers = state.contosoClient.users;
    let currentContosoUser = state.contosoClient.user;

    let typingIndicator = '';
    let typingUsers = typingUsersFromStore.filter(
      (typingUser: ChatParticipant) =>
        (typingUser.id as CommunicationUserIdentifier).communicationUserId !== currentContosoUser.identity
    );
    if (typingUsers.length === 0 || state.threadMembers.threadMembers.length >= PARTICIPANTS_THRESHOLD) {
      return typingIndicator;
    }
    // if we have at least one other participant we want to show names for the first 2
    if (typingUsers.length > 0) {
      typingIndicator += typingUsers
        .filter(
          (typingUser: ChatParticipant) =>
          isCommunicationUserIdentifier(typingUser.id) || isMicrosoftTeamsUserIdentifier(typingUser.id)
        )
        .slice(0, 2)
        .map(
           (typingUserWithEmoji: any) =>
            typingUserWithEmoji.displayName == null ? getDisplayableId(typingUserWithEmoji.id) :
            `${contosoUsers[typingUserWithEmoji.id.communicationUserId].emoji}${typingUserWithEmoji.displayName}`
        )
        .join(', ');
    }
    // if we have more than 2 other participants we want to show the number of other participants
    if (typingUsers.length > 2) {
      var len = typingUsers.length - 2;
      typingIndicator += ` and ${len} other${len === 1 ? '' : 's'}`;
    }
    if (typingIndicator.length > MAXIMUM_LENGTH_OF_TYPING_USERS) {
      typingIndicator = `${typingUsers.length} participant${typingUsers.length === 1 ? '' : 's'}`;
    }
    return typingIndicator;
  },

  generateTypingIndicatorVerb: () => {
    let typingUsersFromStore = state.chat.typingUsers;
    let currentContosoUser = state.contosoClient.user;

    let typingIndicatorVerb = '';
    let typingUsers = typingUsersFromStore.filter(
      (typingUser: ChatParticipant) =>
        (typingUser.id as CommunicationUserIdentifier).communicationUserId !== currentContosoUser.identity
    );
    if (typingUsers.length === 0 || state.threadMembers.threadMembers.length >= PARTICIPANTS_THRESHOLD) {
      return typingIndicatorVerb;
    }
    typingIndicatorVerb = (typingUsers.length > 1 ? ' are' : ' is') + ' typing...';
    return typingIndicatorVerb;
  }
});

export default connect(mapStateToProps)(TypingIndicator);
