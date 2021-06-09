import { ActionButton, FontIcon, IIconProps, Stack } from '@fluentui/react';
import React from 'react';
import { streamIconStyle, streamMainStyle, streamTextStyle } from './styles/Stream.styles';

export default (props: any): JSX.Element => {
  return (
    <div className={streamMainStyle}>
      <h2 className={streamTextStyle}>
        <FontIcon className={streamIconStyle} aria-label="Video" iconName="VideoSolid" />
        Stream coming soon
      </h2>
    </div>
  );
};
