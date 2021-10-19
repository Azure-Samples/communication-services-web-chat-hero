import { IButtonStyles, getTheme, FontWeights, mergeStyleSets, IStackTokens } from "office-ui-fabric-react";

const theme = getTheme();

export const iconButtonStyles: Partial<IButtonStyles> = {
    root: {
        color: theme.palette.neutralPrimary,
        marginLeft: 'auto',
        marginTop: '0.25rem',
        marginRight: '0.125rem',
    },
    rootHovered: {
        color: theme.palette.neutralDark,
    },
};

export const contentStyles = mergeStyleSets({
    header: [
        {
            flex: '1 1 auto',
            color: theme.palette.neutralPrimary,
            display: 'flex',
            alignItems: 'center',
            fontWeight: FontWeights.semibold,
            padding: '1rem 0.75rem 1.25rem 1.5rem',
            fontSize: '1.25rem'
        },
    ],
    body: {
        padding: '0rem 1.5rem 1.5rem 1.5rem',
        overflowY: 'hidden',
        width: '60vw'
    },
});

export const dialogButtonStackTokens: IStackTokens = { childrenGap: '0.5rem' };

export const learnMoreStyle = { fontWeight: 600 };

export const descriptionStyle = { marginTop: '1.5rem' };

export const teamsUriTextFieldStyle = { width: '32rem' };

export const dialogButtonsStyle = { root : { float: 'right' }};