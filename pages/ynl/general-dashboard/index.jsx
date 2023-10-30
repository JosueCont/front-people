import {React, useEffect, useState} from 'react'
import MainLayout from '../../../layout/MainInter'
import { Breadcrumb, Tabs, Row, Col, Select,Form, Menu, Avatar, Input, Radio, Space} from 'antd'
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { FormattedMessage } from 'react-intl'
import { useRouter } from 'next/router'
import { css, Global } from "@emotion/core";
import { SidebarYnl } from '../../../components/dashboard-ynl/SidebarYnl';
import Dashboard from '../../../components/dashboard-ynl/Dashboard';
import { DashboardPerPeople } from '../../../components/personal-dashboard/DashboardPerPeople';
import { useSelector } from 'react-redux'
import { verifyMenuNewForTenant } from '../../../utils/functions';


const index = ({}) => {
  const router = useRouter();
  const validateUser = useSelector((state) => state.userStore)
  const [validatePermition, setValidatePermition] = useState(true);

  useEffect(() => {
      let isUserKhor = validateUser?.user?.sync_from_khor;
      let isAdmin = validateUser?.user?.is_admin;
      if (isAdmin) {
          setValidatePermition(true);
      } else {
          if (isUserKhor) {
              let permsUser = validateUser?.user?.khor_perms;
              if (permsUser != null) {
                  let permYnl = validateUser.user.khor_perms.filter(item => item === "Khor Plus YNL")
                  if (permYnl.length > 0 ) {
                      setValidatePermition(true);
                  } else {
                      setValidatePermition(false);
                  }
              } else {
                  setValidatePermition(false);
              }
          } else {
              setValidatePermition(false);
          }
      }
  }, [validateUser]);
  
  return (
    <MainLayout currentKey={["ynl_general_dashboard"]} defaultOpenKeys={["commitment","ynl"]}>
      <Global
        styles={css`
            :root {
                --orange: #FF5E00;
            }
          .container-menu{
            display: block;
            flex-direction: column;
            background-color: white;
            flex-flow: row wrap;
            justify-content: space-around;
            padding: 5% 10%;
            margin: auto;
            border-radius: 35px;
          }
          .container-dashboard{
            display: -webkit-flex;
            display: flex;
            -webkit-flex-wrap: wrap;
            flex-wrap: wrap;
            padding: 1% 3%;
          }
          .item-dashboard{
            display: -webkit-flex;
            display: flex;
          }
          .flex-item {
            padding: 5px;
            margin-top: 10px;
            color: white;
            font-weight: bold;
            text-align: center;
          }
          .container-circle {
            border: 2px solid var(--orange);
            border-radius: 50px;
            width: 100px;
            height: 100px;
          }   

          .container-circle > h2 {
            margin-top: 30px;
            text-align: center;
            vertical-align: middle;
            margin-bottom: 20px;
            font-weight: bold;
            line-height: 0;
            color: var(--orange);
          }
          .container-circle > h1 {
            font-size: 30px;
            margin-top: 30px;
            text-align: center;
            vertical-align: middle;
            margin-bottom: 20px;
            font-weight: bold;
            line-height: 0;
            color: var(--orange);
          }
          .aligned-to-center{
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .aligned-to-start{
            display: flex;
            justify-content: center;
            align-items: stretch;
            margin-right: 4px;
          }
          .ant-card-head{
            background-image: linear-gradient(180deg, #ff7c0d 0, #ff5e00 25%, #ff5e00 50%, #f33a00 75%, #ea1a2b 100%);
            /**background-image: linear-gradient(180deg, #ff7c0d 0, #ff7c0d 25%, #ff5e00 50%, #f33a00 75%, #ea1a2b 100%);**/
            border-radius: 15px;
          }
          .ant-card-bordered{
            border-radius: 25px;
          }
          .aligned-to-left{
            text-align: left;
          }
          .subtitles{
            color: var(--orange);
          }
          .data-subtitle{
            color: var(--orange);
            line-height: 1;
          }
          .ant-card-body{
            padding: 16px;
          }
          .ant-card-head-title{
            text-align: center;
            color: white;
            font-size: 15px;
            padding: 8px 0px;
          }
          .ant-card-head{
            min-height: 36px
          }
          .ant-table{
            border-radius: 10px;
            -webkit-box-shadow: none;
            -moz-box-shadow: none;
            box-shadow: none;
          }
          .ant-table-thead > tr > th{
            color: var(--orange);
            background-color: transparent;
            border-bottom: 2px solid var(--orange);
            font-weight: bold;
            font-size: 15px;
          }
          .ant-table-tbody > tr > td{
            padding: 4px 8px;
          }
          .ant-table-thead > tr > th{
            padding: 8px 16px;
          } 
          .ant-table > colgroup{
            width: 30%;
          }
          .ant-checkbox-checked .ant-checkbox-inner{
            background-color: var(--orange)!important;
            border-color: var(--orange) !important;
          }
          .indicator-inspired{  border-radius: 50px; width: 15px; height: 15px; background-color: #9fab51; margin: 3px 3px;   }
          .indicator-glad{  border-radius: 50px; width: 15px; height: 15px; background-color: #e7b51c; margin: 3px 3px;  }
          .indicator-open{  border-radius: 50px; width: 15px; height: 15px; background-color: #d38919; margin: 3px 3px; }
          .indicator-depressed{  border-radius: 50px; width: 15px; height: 15px; background-color: #2995cc; margin: 3px 3px;  }
          .indicator-peace{  border-radius: 50px; width: 15px; height: 15px; background-color: #e4057c; margin: 3px 3px;  }
          .indicator-confused{  border-radius: 50px; width: 15px; height: 15px; background-color: #73368c; margin: 3px 3px;  }
          .indicator-upset{ border-radius: 50px; width: 15px; height: 15px; background-color: #a92418; margin: 3px 3px;  }
          .ant-form-item{margin-bottom:8px;}
          .ant-btn{color: white;}
          .indicator-emotion{ border-radius: 50px; width: 15px; height: 15px; margin: 3px 3px;  }
          .ant-list-item-meta{
            justify-content: center;
            align-items: center;
          }
          .containerStreaks{
            height:300px;
            overflow-y: auto;
          }
          .containerStreaks::-webkit-scrollbar-track {
            border: 0.1px solid #000;
            padding: 1px 0;
            background-color: #404040;
          }
          
          .containerStreaks::-webkit-scrollbar {
            width: 0px;
          }
          
          .containerStreaks::-webkit-scrollbar-thumb {
            border-radius: 10px;
            box-shadow: inset 0 0 6px rgba(0,0,0,.3);
            background-color: #737272;
            border: 0.1px solid #000;
          }
          .lbl{
            font-size: 12px;
          }
          @media screen and (max-width: 450px){
            .lbl{
              font-size: 9px;
            }
          }
        `}
        
      />  
      <Breadcrumb>
          <Breadcrumb.Item
              className={"pointer"}
              onClick={() => router.push({ pathname: "/home/persons/" })}
          >
          <FormattedMessage defaultMessage="Inicio" id="web.init" />
          </Breadcrumb.Item>
          {verifyMenuNewForTenant() && 
            <Breadcrumb.Item>Compromiso</Breadcrumb.Item>
          }
          <Breadcrumb.Item>YNL</Breadcrumb.Item>
          <Breadcrumb.Item>Dashboard general</Breadcrumb.Item>
      </Breadcrumb>
      {validatePermition ?(
        <div className="container" style={{ width: "100%" }}>
          <Row>
              <Col lg={5} xs={24}>
                  <SidebarYnl/>
              </Col>
              <Col lg={19} xs={24}>
                  <Dashboard/>
              </Col>
          </Row>
          {/* <Row>
              <Col lg={5} xs={24}>
                  <SidebarYnl/>
              </Col>
              <Col lg={19} xs={24}>
                  <DashboardPerPeople/>
              </Col>
          </Row> */}
        </div>
      ) :
      (
        <div className="notAllowed" />
      )}
      
    </MainLayout>
  )
}

export default index