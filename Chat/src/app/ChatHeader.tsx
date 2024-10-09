// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { DefaultButton, Icon, IconButton, mergeStyles, Stack, Dropdown, IDropdownOption } from '@fluentui/react';
import {
  buttonWithIconStyles,
  chatHeaderContainerStyle,
  greyIconButtonStyle,
  largeLeaveButtonContainerStyle,
  leaveButtonStyle,
  leaveIcon,
  leaveIconStyle,
  paneButtonContainerStyle,
  smallLeaveButtonContainerStyle
} from './styles/ChatHeader.styles';
import { useTheme } from '@azure/communication-react';

const languageOptions: IDropdownOption<{ key: string; text: string }>[] = [
  { key: 'en-us', text: 'English (US)' },
  { key: 'ja-jp', text: 'Japanese (Japan)' },
  { key: 'fr-fr', text: 'French (France)' },
  { key: 'de-de', text: 'German (Germany)' },
  { key: 'es-es', text: 'Spanish (Spain)' },
  { key: 'zh-cn', text: 'Chinese (Simplified)' },
  { key: 'ru-ru', text: 'Russian' },
  { key: 'it-it', text: 'Italian' },
  { key: 'pt-br', text: 'Portuguese (Brazil)' },
  { key: 'ko-kr', text: 'Korean' },
  { key: 'nl-nl', text: 'Dutch' },
  { key: 'sv-se', text: 'Swedish' },
  { key: 'no-no', text: 'Norwegian' },
  { key: 'fi-fi', text: 'Finnish' },
  { key: 'da-dk', text: 'Danish' },
  { key: 'tr-tr', text: 'Turkish' }
];

export interface ChatHeaderProps {
  onEndChat(): void;
  onSummarize(): void;
  setLanguage(language: string): void;
}

export const ChatHeader = (props: ChatHeaderProps): JSX.Element => {
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const theme = useTheme();

  const leaveString = 'Leave';
  return (
    <Stack
      horizontal={true}
      verticalAlign={'center'}
      horizontalAlign="end"
      className={chatHeaderContainerStyle}
      role="banner"
    >
      <div className={paneButtonContainerStyle}>{}</div>
      <Dropdown
        placeholder="Select a language"
        options={languageOptions}
        onChange={(event, option, index) => {
          if (option) {
            setSelectedLanguage(option.key as string);
            props.setLanguage(languageOptions[index ?? 0].text);
          }
        }}
        selectedKey={selectedLanguage}
        styles={{ dropdown: { width: 150 } }}
      />
      <DefaultButton
        className={mergeStyles(largeLeaveButtonContainerStyle, leaveButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        styles={buttonWithIconStyles}
        text={'Summarize'}
        onClick={() => props.onSummarize()}
        aria-label={'Sumarize'}
      />
      <DefaultButton
        className={mergeStyles(largeLeaveButtonContainerStyle, leaveButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        styles={buttonWithIconStyles}
        text={leaveString}
        onClick={() => props.onEndChat()}
        onRenderIcon={() => <Icon iconName={leaveIcon.iconName} className={leaveIconStyle} />}
        aria-live={'polite'}
        aria-label={leaveString}
      />

      <IconButton
        iconProps={leaveIcon}
        className={mergeStyles(smallLeaveButtonContainerStyle, greyIconButtonStyle, {
          color: theme.palette.neutralPrimaryAlt
        })}
        onClick={() => props.onEndChat()}
        ariaLabel={leaveString}
        aria-live={'polite'}
      />
    </Stack>
  );
};
