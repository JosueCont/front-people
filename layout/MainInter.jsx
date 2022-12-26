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
        >
            {props.children}
        </MainLayoutAdmin>
        :
        <MainLayout currentKey={currentKey} defaultOpenKeys={defaultOpenKeys}>
            {props.children}
        </MainLayout>
      }
    </>
  );
};

export default MainLayoutInter;
