import { ChatParticipant } from '@azure/communication-signaling';
import React from 'react';
import { IPersonaSharedProps, Persona, PersonaSize } from '@fluentui/react';


interface AttendeesAreaProps {
    eventAttendees: any;
}

export default (props: AttendeesAreaProps): JSX.Element => {
    const { eventAttendees } = props;
    const participants = eventAttendees as ChatParticipant[];
    return (
        <div style={{paddingTop: '20px'}}>
            {participants.map((participant, index) => (
              <div key={index} style={{padding: '10px'}}>
                <Persona
                  text={participant.displayName}
                  size={PersonaSize.size32}
                />
              </div>
          ))}
        </div>
    );
}