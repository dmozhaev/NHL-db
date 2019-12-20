import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';

import logo from '../images/logo.jpg';

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

class CustomLayout extends React.Component {
  render() {
    return (
      <Layout className="layout">
        <Header>
        <div className="logo">
          <img src={logo} alt="Logo" width="160" height="50" />
        </div>
        <Menu
            theme="dark"
            mode="horizontal"
            className="menuStyle"
        >
          <Menu.Item key="index">
            <Link to="/">
              <Icon type="home" />
              Front page
            </Link>
          </Menu.Item>

          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="team" />
                Teams
              </span>
            }
          >
            <Menu.ItemGroup>
              <Menu.Item key="createTeam">
                <Link to="/teams/list">Team List</Link>
              </Menu.Item>
              <Menu.Item key="addTeam">
                <Link to="/teams/add">Add Team</Link>
              </Menu.Item>
              <Menu.Item key="editLines">
                <Link to="/teams/editlines">Edit Lines</Link>
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>

          <SubMenu
            title={
              <span className="submenu-title-wrapper">
                <Icon type="user" />
                Players
              </span>
            }
          >
            <Menu.ItemGroup>
              <Menu.Item key="createPlayer">
                <Link to="/players/list">Player List</Link>
              </Menu.Item>
              <Menu.Item key="addPlayer">
                <Link to="/players/add">Add Player</Link>
              </Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>

          <Menu.Item key="transfers">
            <Link to="/transfers">
            <Icon type="swap" />
              Player Transfers
            </Link>
          </Menu.Item>

          <Menu.Item key="about">
            <Link to="/about">
            <Icon type="book" />
              About
            </Link>
          </Menu.Item>
        </Menu>
        </Header>
        <Content style={{ padding: '0 50px' }}>
          <div className="content">
            {this.props.children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>NHL Database ©2019 Created by Dmitry Mozhaev, Netum Oy</Footer>
      </Layout>
    );
  }
}

export default CustomLayout;
