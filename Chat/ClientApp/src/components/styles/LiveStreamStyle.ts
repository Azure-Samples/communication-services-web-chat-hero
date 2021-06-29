import { IStackStyles, IStackTokens, mergeStyles } from '@fluentui/react';

export const liveStreamButton = mergeStyles({
    width: '8rem',
    height: '4rem',
    borderRadius: '25px',
    fontSize: '15px',
    color: '#0078d4',
});

export const tilesStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
    },
}

export const tilesStackTokens: IStackTokens = {
    childrenGap: 25,
};