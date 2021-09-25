import React, { Component } from 'react';

import Panel from '../components/Panel';
import SideBar from '../components/SideBar';
import Buttons from '../components/Buttons';

class Home extends Component {
  render() {
    return (
        <div>
          <Panel />
          <SideBar />
          <Buttons />
        </div>
    );
  }
}

export default Home;