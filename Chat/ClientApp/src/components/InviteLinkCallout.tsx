import { Callout, DirectionalHint } from "office-ui-fabric-react";
import React from "react";

interface InviteLinkCalloutProps {
    isVisible: boolean;
    setIsVisible(isOpen: boolean): void;
  }
  
  export default (props: InviteLinkCalloutProps): JSX.Element => {
    const {isVisible, setIsVisible} = props;

    const calloutStyle = { 
        margin: '0.75rem 1rem 0.75rem 1rem',
        fontSize: '0.75rem'
    }

    return (
        <Callout
          style={calloutStyle}
          gapSpace={0}
          target={`#addPeople`}
          setInitialFocus
          directionalHint={DirectionalHint.topCenter}
          onDismiss={() => { setIsVisible(!isVisible); }}
        >
          Invite link copied
        </Callout>
    )
}