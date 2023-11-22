import React from 'react';
import '../scss/sidebar.scss';

const SideBar = props => {
  const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
  return (
    <div className={sidebarClass}>
      <div> I slide into view </div>
      <div> Me Too! </div>
      <div> Me Three! </div>
    </div>
  );
};
export default SideBar;


