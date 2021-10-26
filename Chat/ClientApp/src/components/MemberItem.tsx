import { CommunicationIdentifier } from '@azure/communication-common';
import { IconButton } from '@fluentui/react';
import React from 'react';

import { messageAvatarContainerStyle } from './styles/ChatThread.styles';
import {
  memberItemContainerStyle,
  memberItemIsYouStyle,
  memberItemNameStyle,
  moreInforStyle
} from './styles/MemberItem.styles';

interface MemberItemProps {
  name: string;
  userId: string;
  isYou: boolean;
  avatar: string;
  removeThreadMember(): void;
}

export default (props: MemberItemProps): JSX.Element => {
  return (
    <div className={memberItemContainerStyle}>
      <div className={messageAvatarContainerStyle(props.avatar)}>{props.avatar}</div>
      <span className={memberItemNameStyle}>{props.name}</span>
      {props.isYou && <span className={memberItemIsYouStyle}>(you)</span>}
      {!props.isYou && (
        <div className={moreInforStyle}>
          <IconButton
            menuIconProps={{ iconName: 'More' }}
            menuProps={{
              items: props.isYou
                ? []
                : [
                    {
                      key: props.name,
                      name: 'Remove participant',
                      onClick: () => {
                        
                        props.removeThreadMember();
                      }
                    }
                  ]
            }}
          />
        </div>
      )}
    </div>
  );
};
