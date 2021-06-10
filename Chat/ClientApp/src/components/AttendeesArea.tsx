import { ChatParticipant } from '@azure/communication-signaling';
import React from 'react';
import { staticAreaStyle } from './styles/ChatScreen.styles';

interface AttendeesAreaProps {
    eventAttendees: any;
}

export default (props: AttendeesAreaProps): JSX.Element => {
    const { eventAttendees } = props;
    const participants = eventAttendees as ChatParticipant[];

    return (
        <div className={staticAreaStyle}>
        <h2>Attendees</h2>
        {participants.map(participant => (
        <li>
          {participant.displayName}
        </li>
      ))}
        </div>
    );
}