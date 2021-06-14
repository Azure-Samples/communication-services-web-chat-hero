import React, { Component } from 'react'
import loadLibrary from '../load-library'


class AzureMP extends Component {
	
	public initialization: any;
	public skin: any;
	

  constructor(props: any) {
    super(props)
  }
  
  componentDidMount() {
    this.createPlayer();
  }

  createPlayer() {
    var myOptions = {
      autoplay: true,
      controls: true,
      width: "640",
      height: "400",
      poster: ""
  };
  var myPlayer = window.amp("azuremediaplayer", myOptions);
  myPlayer.src([{ src: "//amssamples.streaming.mediaservices.windows.net/3b970ae0-39d5-44bd-b3a3-3136143d6435/AzureMediaServicesPromo.ism/manifest", type: "application/vnd.ms-sstr+xml" }, ]);
  }
 
}

export default AzureMP