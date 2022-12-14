import React, { Component } from 'react';
import { ProSidebar, Menu, SubMenu } from 'react-pro-sidebar';
import 'react-pro-sidebar/dist/css/styles.css';
import '../scss/sidebar.scss';
import { products } from '../constant/variable';
import cubeStore from '../store/cubeStore';

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
    padding: 10,
    position: 'relative',
    backgroundColor: '#66666669',
    marginBottom: 10,
    borderRadius: 10,
  },
  productImg: {
    width: '100%'
  }
}

const Product = ({ data }) => {
  const productSelected = cubeStore(state => state.productSelected);
  const updateProductSelected = cubeStore(state => state.updateProductSelected);

  const updateDeleteMode = cubeStore( state => state.updateDeleteActive );

  const selectProduct = (data) => {
    if(  productSelected.id === data.id ) {
      updateProductSelected( {} );
      return;
    }

    updateProductSelected( data );

    updateDeleteMode( false );
  };

  return (
    <div 
      style={{ 
        ...s.productWrapper, 
        border: `${ data.id === productSelected.id ? 5 : 0 }px solid #ff0000`, 
        padding: data.id === productSelected.id ? 5 : 10 }} 
      onClick={ () => selectProduct(data) }>
        
      <div>
        <img src={ data.menuImg } style={s.productImg} alt={data.name} />
      </div>
      
      <div>
        {data.name}
      </div>
    </div>
  )
}

const SideBar = () => {
  const view3D = cubeStore(state => state.view3D);

  return  !view3D ? (
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
  ) : null
}

export default SideBar;