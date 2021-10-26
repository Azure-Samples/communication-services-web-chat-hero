import { Modal, IconButton, TextField, Stack, PrimaryButton, DefaultButton, IIconProps } from "office-ui-fabric-react";
import React, { useState } from "react";
import { getThreadId, addTeamsUser } from "../utils/utils";
import { iconButtonStyles, contentStyles, dialogButtonStackTokens, descriptionStyle, learnMoreStyle, teamsUriTextFieldStyle, dialogButtonsStyle } from "./styles/AddUserDialog.styles";

interface AddUserDialogProps {
  isDialogOpen: boolean;
  setIsDialogOpen(isOpen: boolean): void;
}

export default (props: AddUserDialogProps): JSX.Element => {
  const [teamsUserId, setTeamsUserId] = useState('');

  const { isDialogOpen, setIsDialogOpen } = props;

  const cancelIcon: IIconProps = { iconName: 'Cancel' };

  return (
    <Modal
      titleAriaId={'Add person from Teams'}
      isOpen={isDialogOpen}
      onDismiss={() => setIsDialogOpen(false)}
      isBlocking={false}
    >
      <div className={contentStyles.header}>
        <span>Add person from Teams (beta)</span>
        <IconButton
          styles={iconButtonStyles}
          iconProps={cancelIcon}
          ariaLabel="Close popup modal"
          onClick={() => setIsDialogOpen(false)}
        />
      </div>
      <div className={contentStyles.body}>
        <TextField style={teamsUriTextFieldStyle} label="Team's user id" onChange={(_, value) => { if (!value) { return; } setTeamsUserId(value) }}></TextField>
        <div style={descriptionStyle}>This enables your Communication Services users to add Teams users to chats, if the Teams tenant is enabled for federation. This functionality is currently in preview mode and should be used with test tenants only
          <div style={learnMoreStyle}>
            To learn more, check out our <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/teams-interop">documentation</a>
          </div>
        </div>
        <Stack styles={dialogButtonsStyle} horizontal tokens={dialogButtonStackTokens}>
          <Stack.Item>
            <PrimaryButton text="Add Person" onClick={async () => {
              const threadId = getThreadId();
              if (!threadId) { return; }
              addTeamsUser(threadId, teamsUserId).then(() => {
                setTeamsUserId('');
                setIsDialogOpen(false);
              })
            }}></PrimaryButton>
          </Stack.Item>
          <Stack.Item>
            <DefaultButton text="Cancel" onClick={() => { setTeamsUserId(''); setIsDialogOpen(false); }}></DefaultButton>
          </Stack.Item>
        </Stack>
      </div>
    </Modal>
  )
}