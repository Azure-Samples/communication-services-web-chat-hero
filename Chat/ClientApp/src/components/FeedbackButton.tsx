import {
    CommandButton,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    Dropdown,
    IDropdownOption,
    Label,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import { feedbackButtonContainerStyle } from './styles/ChatHeader.styles';
import React, { useCallback, useState } from 'react';
import { uploadFeedback, createFeedback } from '../feedbacks/Feedback';

type FeedbackButtonProps = {
    iconOnly?: boolean;
}

export const FeedbackButton = ({ iconOnly }: FeedbackButtonProps): JSX.Element => {
    const [hidden, setHidden] = useState(true);
    const togglePopup = useCallback(() => {
        setHidden(!hidden);
    }, [hidden]);

    return (
        <>
          <CommandButton
            className={ feedbackButtonContainerStyle }
            key='Feedback'
            text={iconOnly ? undefined : 'Report a bug'}
            ariaLabel={iconOnly ? 'Report a bug': undefined}
            iconProps={{ iconName: 'Feedback' }}
            onClick={togglePopup}
            />
          {!hidden && <FeedbackPopup toggleHidden={togglePopup} />}
        </>
    );
};

type FeedbackPopupProps = {
    toggleHidden: () => void;
};

const options: IDropdownOption[] = [
    { key: 'Chat - Message not delivering', text: 'Chat - Message not delivering' },
    { key: 'Chat - Message dropping', text: 'Chat - Message dropping' },
    { key: 'Chat - Other', text: 'Chat - Other' },
    { key: 'Participants list', text: 'Participants list' },
    { key: 'Join experience', text: 'Join experience' },
    { key: 'App Crashing', text: 'App Crashing' },
    { key: 'Others', text: 'Others' }
];

const modalProps = {
    isBlocking: false,
    styles: { main: { maxWidth: 650, minWidth: 450 } }
};

const dialogContentProps = {
    type: DialogType.largeHeader,
    title: 'Feedback',
    subText: 'Something went wrong? Please provide feedback here!'
};

const FeedbackPopup = (props: FeedbackPopupProps): JSX.Element => {
    const [feedbackType, setFeedbackType] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [guid, setGuid] = useState<string>('');
    const [isHidden] = useState<boolean>(false);

    const submitFeedback = useCallback(async () => {
        const feedback = createFeedback(feedbackType, comment);
        await uploadFeedback(feedback);
        setGuid(feedback.feedbackId);
    }, [feedbackType, comment]);

    const feedbackInput = (
        <>
            <Label>What is this related to? (Required)</Label>
            <Dropdown
                defaultSelectedKey={'Calling - Audio'}
                options={options}
                onChange={(_, item): void => {
                    setFeedbackType(item?.key as string);
                }}
            />
            <Label>What are you seeing? Has it always been that way? Any step to repro?</Label>
            <TextField
                onChange={(_, value): void => {
                    setComment(value ?? '');
                }}
                value={comment}
                multiline
                rows={6}
            />
        </>
    );

    const feedbackSubmitted = (
        <>
            <Label>Please provide this guid to developers for targeting the case:</Label>
            <TextField value={guid} readOnly />
        </>
    );

    return (
        <Dialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            hidden={isHidden}
            onDismiss={props.toggleHidden}
        >
            {!guid && feedbackInput}
            {guid && feedbackSubmitted}
            <DialogFooter>
                {!guid && <PrimaryButton onClick={submitFeedback} text="Send" />}
                <DefaultButton onClick={props.toggleHidden} text="Close" />
            </DialogFooter>
        </Dialog>
    );
};