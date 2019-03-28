import React, { Component } from 'react';
import { render } from 'react-dom';

export default class GooMap extends Component {
  constructor(props) {
    super(props);
    this.onScriptLoad = this.onScriptLoad.bind(this);
    this.parentInst = props.parentInstance;
  }

  onScriptLoad() {
    let directionsService = new window.google.maps.DirectionsService;
    let directionsDisplay = new window.google.maps.DirectionsRenderer;
    const map = new window.google.maps.Map(
      document.getElementById(this.props.id),
      {
        zoom: 6,
        center: {lat: 43.65, lng: -79.38}
      });
      directionsDisplay.setMap(map);
      this.parentInst.setState({
        mapDirService : directionsService,
        mapDirDisplay : directionsDisplay
      });
      
  }

  componentDidMount() {
    if (!window.google) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.src = `https://maps.google.com/maps/api/js?key=API_KEY`;
      var x = document.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
      // Below is important. 
      //We cannot access google.maps until it's finished loading
      s.addEventListener('load', e => {
        this.onScriptLoad()
      })
    } else {
      this.onScriptLoad()
    }
  }

  render() {
    return (
      <div style={{ width: 500, height: 500 }} id={this.props.id} />
    );
  }
}
