import React from "react";
import MainLayoutAdmin from "./MainLayout_admin";
import MainLayout from "./MainLayout";
import { verifyMenuNewForTenant } from "../utils/functions"

const MainLayoutInter = ({
  currentKey,
  defaultOpenKeys,
  hideMenu,
  onClickImage,
  hideSearch,
  hideLogo,
  autoregister = false,
  ...props
}) => {

  return (
    <>
      {
        verifyMenuNewForTenant()?
        <MainLayoutAdmin
            currentKey={currentKey}
            defaultOpenKeys={defaultOpenKeys}
            hideMenu={hideMenu}
            hideLogo={hideLogo}
            hideSearch={hideSearch}
            onClickImage={onClickImage}
            autoregister={autoregister}
        >
            {props.children}
        </MainLayoutAdmin>
        :
        <MainLayout
          currentKey={currentKey}
          defaultOpenKeys={defaultOpenKeys}
          autoregister={autoregister}
        >
            {props.children}
        </MainLayout>
      }
    </>
  );
};

export default MainLayoutInter;
