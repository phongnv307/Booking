import React, { useEffect, useState } from 'react';
import "./sidebar.css";
import { Layout, Menu } from 'antd';
import { useHistory, useLocation } from "react-router-dom";
import { UserOutlined, InboxOutlined, DashboardOutlined, BarsOutlined, HomeOutlined, ShoppingOutlined, AuditOutlined, ShoppingCartOutlined, FormOutlined, NotificationOutlined } from '@ant-design/icons';

const { SubMenu } = Menu;
const { Sider } = Layout;

function Sidebar() {

  const history = useHistory();
  const location = useLocation();
  const [user, setUser] = useState([]);

  const menuSidebarAdmin = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "account-management",
      title: "Quản Lý Tài Khoản",
      link: "/account-management",
      icon: <UserOutlined />
    },
    {
      key: "hotel-list",
      title: "Danh Sách Khách sạn",
      link: "/hotel-list",
      icon: <HomeOutlined />
    },
    {
      key: "tours-list",
      title: "Danh Sách Tours",
      link: "/tours-list",
      icon: <FormOutlined />
    },
    {
      key: "rooms-list",
      title: "Danh Sách Phòng",
      link: "/rooms-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "order-list",
      title: "Quản Lý Đặt Tour",
      link: "/order-list",
      icon: <ShoppingCartOutlined />
    },
    {
      key: "order-rooms",
      title: "Quản Lý Đặt phòng",
      link: "/order-rooms",
      icon: <InboxOutlined />
    },
  ];

  const menuSidebarCompany = [
    {
      key: "dash-board",
      title: "Dashboards",
      link: "/dash-board",
      icon: <DashboardOutlined />
    },
    {
      key: "hotel-list",
      title: "Danh Sách Khách sạn",
      link: "/hotel-list",
      icon: <HomeOutlined />
    },
    {
      key: "tours-list",
      title: "Danh Sách Tours",
      link: "/tours-list",
      icon: <FormOutlined />
    },
    {
      key: "rooms-list",
      title: "Danh Sách Phòng",
      link: "/rooms-list",
      icon: <ShoppingOutlined />
    },
    {
      key: "order-list",
      title: "Quản Lý Đặt Tour",
      link: "/order-list",
      icon: <ShoppingCartOutlined />
    },
    {
      key: "order-rooms",
      title: "Quản Lý Đặt phòng",
      link: "/order-rooms",
      icon: <InboxOutlined />
    },
  ];

  const navigate = (link, key) => {
    history.push(link);
  }

  useEffect(() => {
      const user = localStorage.getItem("user");
      setUser(JSON.parse(user));
  },[])

  return (
    <Sider
      className={'ant-layout-sider-trigger'}
      width={215}
      style={{
        position: "fixed",
        top: 60,
        height: '100%',
        left: 0,
        padding: 0,
        zIndex: 1,
        marginTop: 0,
        boxShadow: " 0 1px 4px -1px rgb(0 0 0 / 15%)"
      }}
    >
     <Menu
          mode="inline"
          selectedKeys={location.pathname.split("/")}
          defaultOpenKeys={['account']}
          style={{ height: '100%', borderRight: 0, backgroundColor: "#FFFFFF" }}
          theme='light'
        >
          <>
            {
              user.role === "isAdmin" ? menuSidebarAdmin.map((map) => (
                <Menu.Item
                  onClick={() => navigate(map.link, map.key)}
                  key={map.key}
                  icon={map.icon}
                  className="customeClass"
                >
                  {map.title}
                </Menu.Item>
              )) : menuSidebarCompany.map((map) => (
                <Menu.Item
                  onClick={() => navigate(map.link, map.key)}
                  key={map.key}
                  icon={map.icon}
                  className="customeClass"
                >
                  {map.title}
                </Menu.Item>
              ))
            }
          </>
        </Menu>

    </Sider >
  );
}

export default Sidebar;