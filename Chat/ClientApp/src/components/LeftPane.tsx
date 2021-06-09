import React, { useEffect, useState } from 'react';
import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack, StackItem } from '@fluentui/react';

import { leftPaneStyle, paneButtonStyle } from './styles/ChatScreen.styles';

export interface LeftPaneProps {
  onTabClicked(tab: string): void;
}

export default (props: LeftPaneProps): JSX.Element => {
  const { onTabClicked } = props;

  return (
    <div className={leftPaneStyle} >
      <Stack>
        <Stack.Item align="center" >
          <div>
            <DefaultButton
              id="Home"
              className={paneButtonStyle}
              onClick={() => onTabClicked('welcome')}
            >
              <Icon iconName="Home" />
            </DefaultButton>
          </div>
        </Stack.Item>
        <Stack.Item align="center" >
          <div>
            <DefaultButton
              id="CalendarAgenda"
              className={paneButtonStyle}
            >
              <Icon iconName="CalendarAgenda" />
            </DefaultButton>
          </div>
        </Stack.Item>
        <Stack.Item align="center">
          <div>
            <DefaultButton 
              id="Group" 
              className={paneButtonStyle}
              onClick={() => onTabClicked('attendees')}
            >
              <Icon iconName="Group" />
            </DefaultButton>
          </div>
        </Stack.Item>
      </Stack>  
    </div>
  );
};

