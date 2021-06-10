import { ActionButton, FontIcon, IIconProps, Stack } from '@fluentui/react';
import React from 'react';
import { streamIconStyle, streamMainStyle, streamTextStyle } from './styles/Stream.styles';

export default (props: any): JSX.Element => {
  return (
    <div className={streamMainStyle}>
       <iframe height="100%" width="100%" src="https://www.youtube.com/embed/gy480NqX7yU?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    </div>
  );
};
