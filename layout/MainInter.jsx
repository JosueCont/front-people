import React from "react";
import MainLayoutAdmin from "./MainLayout_admin";
import MainLayout from "./MainLayout";
import { verifyMenuNewForTenant } from "../utils/functions"
import useLocalStorageListener from "../utils/useLocalStorageListener";
import { useRouter } from "next/router";

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
  showFooter,
  contentFooter,
  secondaryLogo,
  ...props
}) => {

  const router = useRouter();

  const handleLocalStorageChange = (newValue) => {
    console.log(`El nuevo valor: ${newValue}`)
    if (newValue == null){
      router.push({ pathname: "/select-company" })
    }else{
      router.push({ pathname: "/dashboard" })
    }
  };

  useLocalStorageListener('data', handleLocalStorageChange);

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
            showFooter={showFooter}s
            contentFooter={contentFooter}
            secondaryLogo={secondaryLogo}
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
