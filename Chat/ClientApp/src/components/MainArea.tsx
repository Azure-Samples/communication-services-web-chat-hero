import React  from 'react';
import { Image } from '@fluentui/react';
import defaultImg from '../assets/default.png';
import { staticImageStyle, staticAreaStyle} from './styles/ChatScreen.styles';

export interface MainScreenProps {
  updateContent(content: string): void;
}

export default (props: MainScreenProps): JSX.Element => {
  const imageProps = { src: defaultImg.toString() };
  const { updateContent } = props;

  const getComponent = () => {
    return (
      <div className={staticAreaStyle}>
      <Image
        className={staticImageStyle}
        alt="Default Event Image"
        {...imageProps}
      />
      <h2>Event Description</h2>
      Lorem Ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      <h2>Upcoming Sessions</h2>
      Coming soon...
    </div>

    );  
  }
  
  return getComponent()
};
