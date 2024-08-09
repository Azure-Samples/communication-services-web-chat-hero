// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState, useEffect } from 'react';
import { Text, keyframes, IconButton, mergeStyles, Stack, Spinner } from '@fluentui/react';
import CursorSVG from '../assets/cursor.svg';
import { useTheme } from '@azure/communication-react';

export interface SummaryCardProps {
  showSummary: boolean;
  showLoading: boolean;
  summary: string;
  setShowSummary(shouldShowSummary: boolean): void;
}

export const copilotIconStyle = mergeStyles({
  background:
    'radial-gradient(circle at 100% 100%, #ffffff 0, #ffffff 5px, transparent 5px) 0% 0%/6px 6px no-repeat,radial-gradient(circle at 0 100%, #ffffff 0, #ffffff 5px, transparent 5px) radial-gradient(circle at 100% 0, #ffffff 0, #ffffff 5px, transparent 5px) 0% 100%/6px 6px no-repeat, radial-gradient(circle at 0 0, #ffffff 0, #ffffff 5px, transparent 5px) 100% 100%/6px 6px no-repeat, linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 2px) calc(100% - 12px) no-repeat, linear-gradient(#ffffff, #ffffff) 50% 50%/calc(100% - 12px) calc(100% - 2px) no-repeat, linear-gradient(129deg, #239bf5 0%, rgba(19,227,217,1) 24%, rgba(233,227,26,1) 52%, #e9459b 85%);'
});

export const SummaryCard = (props: SummaryCardProps): JSX.Element => {
  const theme = useTheme();
  const [completedTyping, setCompletedTyping] = useState<boolean>(false);
  const [displayResponse, setDisplayResponse] = useState<string>('');

  const flicker = keyframes({
    from: { opacity: '0%' },
    to: { opacity: '100%' }
  });

  // credit: https://dev.to/stiaanwol/how-to-build-the-chatgpt-typing-animation-in-react-2cca
  useEffect(() => {
    setCompletedTyping(false);
    let i = 0;
    const stringResponse = props.summary;
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
      }
    }, 10);
    return () => clearInterval(intervalId);
  }, [props.summary]);

  return (
    <>
      {props.showSummary ? (
        <div style={{ display: 'block', position: 'absolute', zIndex: '10', right: '0', top: '50px' }}>
          <span
            style={{
              display: 'block',
              position: 'absolute',
              zIndex: '10',
              top: '10px',
              right: '10px',
              boxShadow: theme.effects.elevation8,
              width: '20rem',
              height: 'auto',
              padding: '0.75rem',
              borderRadius: '0.25rem',
              backgroundColor: theme.palette.white,
              wordWrap: 'break-word',
              overflow: 'visible',
              whiteSpace: 'pre-wrap'
            }}
          >
            <Stack horizontal horizontalAlign="space-between">
              <Stack horizontal>
                <Text style={{ fontWeight: '800', paddingTop: '5px' }}>{'AI Summary'}</Text>
              </Stack>

              <IconButton
                iconProps={{
                  iconName: 'cancel'
                }}
                ariaLabel={'dismiss'}
                aria-live={'polite'}
                onClick={() => props.setShowSummary(false)}
              />
            </Stack>
            {displayResponse}
            {!completedTyping && (
              <img
                src={CursorSVG.toString()}
                style={{
                  display: 'inline-block',
                  width: '1ch',
                  animation: `${flicker} 0.5s infinite`,
                  verticalAlign: 'bottom',
                  filter:
                    'brightness(0) saturate(100%) invert(23%) sepia(18%) saturate(7%) hue-rotate(9deg) brightness(89%) contrast(88%)'
                }}
              />
            )}
          </span>
        </div>
      ) : (
        <></>
      )}

      {props.showLoading ? (
        <div
          style={{
            display: 'block',
            position: 'absolute',
            zIndex: '10',
            right: '10px',
            top: '60px',
            boxShadow: theme.effects.elevation8,
            width: '20rem',
            padding: '0.75rem',
            borderRadius: '0.25rem',
            backgroundColor: theme.palette.white
          }}
        >
          <Spinner label="Analyzing conversations..." />
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
