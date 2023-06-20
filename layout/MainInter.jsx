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
  hideProfile = false,
  logoAlign,
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
            hideProfile={hideProfile}
            logoAlign={logoAlign}
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
