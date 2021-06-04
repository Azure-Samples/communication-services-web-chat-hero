import React, { useEffect, useState } from 'react';
import { DefaultButton, Icon, IconButton, Pivot, PivotItem, Stack, StackItem } from '@fluentui/react';

import { leftPaneStyle, paneButtonStyle } from './styles/ChatScreen.styles';

export default (props: any): JSX.Element => {
  return (
    <div className={leftPaneStyle} >
      <Stack>
        <Stack.Item align="center" >
          <div>
            <DefaultButton
              id="Home"
              className={paneButtonStyle}
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
      </Stack>  
    </div>
  );
};
