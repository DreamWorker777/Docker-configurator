import React, { Component } from 'react';
import Panel from '../components/Panel';
import SideBar from '../components/SideBar';


class Home extends Component {
  render() {
    return (
        <div>
          <Panel />
          <SideBar />
        </div>
    );
  }
}

export default Home;