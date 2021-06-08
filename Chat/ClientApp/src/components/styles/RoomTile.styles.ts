import { IStackStyles, IStackTokens, mergeStyles } from '@fluentui/react';

const tileStyle = mergeStyles({
    width: '13rem',
    height: '13rem',
    borderRadius: '25px',
    fontSize: '20px',
    color: '#0078d4',
});

const tilesStackStyles: IStackStyles = {
    root: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'flex-start',
    },
}

const tilesStackTokens: IStackTokens = {
    childrenGap: 25,
};

export {
    tilesStackStyles,
    tilesStackTokens,
    tileStyle
};
