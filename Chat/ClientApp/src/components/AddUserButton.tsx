import { DefaultButton, IContextualMenuProps, IIconProps} from '@fluentui/react';
import React, { useState } from 'react';
import AddUserDialog from './AddUserDialog'
import InviteLinkCallout from './InviteLinkCallout';
import { addUserButtonContainer, buttonStyle } from './styles/AddUserButton.styles';
const copyJoinLink = async (url: string) => {
  if (!navigator.clipboard) {
    // Clipboard API not available
    return;
  }

  //Get the paragraph text
  try {
    //Write it to the clipboard
    await navigator.clipboard.writeText(url);
  } catch (err) {
    console.error('Failed to copy!', err);
  }
};

export default (): JSX.Element => {
  const [isCalloutVisible, setIsCalloutVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const addPersonFromTeamsLabel = 'Add person from Teams';
  const copyInviteLinkLabel = 'Copy invite link';

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'copyInviteLink',
        text: copyInviteLinkLabel,
        iconProps: { iconName: 'Link' },
        onClick: () => {
          copyJoinLink(window.location.href);
          // we want to also fade out our callout 
          // and then remove the class when its gone
          setIsCalloutVisible(true);
          setTimeout(() => {
            setIsCalloutVisible(false);
          }, 20000)
        }
      }
      ,
      {
        key: 'addPersonFromTeams',
        text: addPersonFromTeamsLabel,
        iconProps: { iconName: 'TeamsLogo' },
        onClick: () => {
          setIsModalOpen(true);
        }
      },
    ],
    directionalHintFixed: true,
  };
  const addIcon: IIconProps = { iconName: 'AddFriend' };

  return (
    <div style={addUserButtonContainer}>
      <DefaultButton
        id="addPeople"
        text="Add People"
        iconProps={addIcon}
        menuProps={menuProps}
        allowDisabledFocus
        disabled={false}
        checked={false}
        styles={buttonStyle}
    />
        {isCalloutVisible && <InviteLinkCallout isVisible={isCalloutVisible} setIsVisible={setIsCalloutVisible} /> }
        {isModalOpen && <AddUserDialog isDialogOpen={isModalOpen} setIsDialogOpen={setIsModalOpen} />}
  </div>
  );
};
