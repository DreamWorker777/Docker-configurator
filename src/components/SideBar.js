import React, { Component } from 'react';
import { ProSidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '../scss/sidebar.scss';
import { products } from '../constant/variable';

const s = {
  sideBarWrapper: {
    position: 'fixed',
    left: 10,
    top: 0,
    height: 'calc(100% - 20px)',
    paddingTop: 10,
    paddingBottom: 10
  },
  productWrapper: {
    height: 250,
    padding: 10,
    position: 'relative',
    backgroundColor: '#66666669',
    marginBottom: 10,
    borderRadius: 10
  },
  productImg: {
    width: '100%',
    height: 215
  }
}

const Product = ({ data }) => {
  return (
    <div style={s.productWrapper}>
      <div>
        <img src={ data.menuImg } style={s.productImg} alt={data.name} />
      </div>

      <div>
        {data.name}
      </div>
    </div>
  )
}

class SideBar extends Component {
  render() {
    return (
        <div style={ s.sideBarWrapper }>
          <ProSidebar toggled={true}>
            <Menu iconShape="square">
              {
                Object.keys( products ).map((key, index) => (
                  <SubMenu key={index} defaultOpen={ index === 0 ? true: false } title={ key }>
                    {
                      products[key].map((product, index) => (
                        <Product key={index} data={product} />
                      ))
                    }
                  </SubMenu>                  
                ))
              }
            </Menu>
          </ProSidebar>
        </div>
    );
  }
}

export default SideBar;