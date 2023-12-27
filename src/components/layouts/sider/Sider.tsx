import React, { useState } from "react";
import {
  ITreeMenu,
  CanAccess,
  useIsExistAuthentication,
  useTranslate,
  useLogout,
  useMenu,
  useWarnAboutChange,
  useNavigation,
} from "@refinedev/core";
import { Link } from "react-router-dom";
import { Sider, ThemedTitleV2 } from "@refinedev/antd";
import { Layout as AntdLayout, Menu, Grid, theme, Button } from "antd";
import {
  LogoutOutlined,
  UnorderedListOutlined,
  RightOutlined,
  LeftOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { antLayoutSider, antLayoutSiderMobile } from "./styles";
import WincaseIcon from "./../../../../public/wincase.ico";

const { useToken } = theme;

export const CustomSider: typeof Sider = ({ render }) => {
  const { token } = useToken();
  const translate = useTranslate();
  const { push } = useNavigation();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const isExistAuthentication = useIsExistAuthentication();
  const { warnWhen, setWarnWhen } = useWarnAboutChange();
  const { mutate: mutateLogout } = useLogout();
  const { menuItems, selectedKey, defaultOpenKeys } = useMenu();
  const { SubMenu } = Menu;

  const breakpoint = Grid.useBreakpoint();

  const isMobile =
    typeof breakpoint.lg === "undefined" ? false : !breakpoint.lg;

  const renderTreeView = (tree: ITreeMenu[], selectedKey: string) => {
    return tree.map((item: ITreeMenu) => {
      const { name, children, meta, key, list } = item;

      const icon = meta?.icon;
      const label = meta?.label ?? name;
      const parent = meta?.parent;
      const route =
        typeof list === "string"
          ? list
          : typeof list !== "function"
          ? list?.path
          : key;

      if (children.length > 0) {
        return (
          <SubMenu
            key={route}
            icon={icon ?? <UnorderedListOutlined />}
            title={label}
          >
            {renderTreeView(children, selectedKey)}
          </SubMenu>
        );
      }
      const isSelected = route === selectedKey;
      const isRoute = !(parent !== undefined && children.length === 0);
      return (
        <CanAccess
          key={route}
          resource={name.toLowerCase()}
          action="list"
          params={{ resource: item }}
        >
          <Menu.Item
            key={route}
            style={{
              textTransform: "capitalize",
            }}
            icon={icon ?? (isRoute && <UnorderedListOutlined />)}
          >
            {route ? <Link to={route || "/"}>{label}</Link> : label}
            {!collapsed && isSelected && (
              <div className="ant-menu-tree-arrow" />
            )}
          </Menu.Item>
        </CanAccess>
      );
    });
  };

  const handleLogout = () => {
    if (warnWhen) {
      const confirm = window.confirm(
        translate(
          "warnWhenUnsavedChanges",
          "Are you sure you want to leave? You have unsaved changes."
        )
      );

      if (confirm) {
        setWarnWhen(false);
        mutateLogout();
      }
    } else {
      mutateLogout();
    }
  };

  const logout = isExistAuthentication && (
    <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
      {translate("buttons.logout", "Logout")}
    </Menu.Item>
  );

  const items = renderTreeView(menuItems, selectedKey);

  const renderSider = () => {
    if (render) {
      return render({
        dashboard: null,
        items,
        logout,
        collapsed,
      });
    }
    return (
      <>
        {items}
        {logout}
      </>
    );
  };

  const siderStyle = isMobile ? antLayoutSiderMobile : antLayoutSider;

  return (
    <AntdLayout.Sider
      collapsible
      collapsedWidth={isMobile ? 0 : 80}
      collapsed={collapsed}
      breakpoint="lg"
      onCollapse={(collapsed: boolean): void => setCollapsed(collapsed)}
      style={{
        ...siderStyle,
        backgroundColor: token.colorBgContainer,
        borderRight: `1px solid ${token.colorBgElevated}`,
      }}
      trigger={
        !isMobile && (
          <Button
            type="text"
            style={{
              borderRadius: 0,
              height: "100%",
              width: "100%",
              backgroundColor: token.colorBgElevated,
            }}
          >
            {collapsed ? (
              <RightOutlined
                style={{
                  color: token.colorPrimary,
                }}
              />
            ) : (
              <LeftOutlined
                style={{
                  color: token.colorPrimary,
                }}
              />
            )}
          </Button>
        )
      }
    >
      <div
        style={{
          width: collapsed ? "80px" : "200px",
          padding: collapsed ? "0" : "0 16px",
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-start",
          alignItems: "center",
          height: "64px",
          backgroundColor: token.colorBgElevated,
          fontSize: "14px",
        }}
      >
        <ThemedTitleV2
          collapsed={collapsed}
          text={"Wincase CRM"}
          icon={
            <img style={{ width: 15 }} src={WincaseIcon} alt="Wincase Icon" />
          }
        />
      </div>
      <Menu
        defaultOpenKeys={defaultOpenKeys}
        selectedKeys={[selectedKey]}
        mode="inline"
        style={{
          marginTop: "8px",
          border: "none",
        }}
        onClick={() => {
          if (!breakpoint.lg) {
            setCollapsed(true);
          }
        }}
      >
        {/* {renderSider()} */}
        <Menu.Item
          key="dashboard"
          icon={<DashboardOutlined />}
          onClick={() => {
            push("/dashboard");
          }}
          style={{
            fontWeight: selectedKey === "/dashboard" ? "bold" : "normal",
          }}
        >
          Home
        </Menu.Item>
      </Menu>
    </AntdLayout.Sider>
  );
};
