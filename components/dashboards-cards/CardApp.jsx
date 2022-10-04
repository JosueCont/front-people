import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Card, Row, Col, Space, Button, Divider } from "antd";
import Cookies from "js-cookie";
import { getCurrentURL } from "../../utils/constant";
import { connect } from "react-redux";
import { domainApiWithTenant } from "../../api/axiosApi";
import { urlMyAccount, urlPeople, urlSocial } from "../../config/config";

const ContentApps = styled.div`
  & .ant-card {
    background: #403f44;
    border-radius: 12px;
  }
  & .ant-card-body {
    max-width: 300px;
    width: 300px;
    padding: 24px 12px;
  }
  & .ant-row {
    max-height: 300px;
    overflow-y: auto;
    ::-webkit-scrollbar {
      width: 16px;
    }
    ::-webkit-scrollbar-track {
      background: none;
      border: none;
    }
    ::-webkit-scrollbar-thumb {
      background: #5f6368;
      background-clip: padding-box;
      border: 4px solid transparent;
      border-radius: 8px;
      box-shadow: none;
      min-height: 50px;
    }
  }
  & .ant-col {
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 12px;
    transition: all 0.2s ease-in-out;
    display: flex;
    justify-content: center;
    :hover {
      background-color: rgba(25, 25, 25, 0.5);
    }
    & a {
      text-decoration: none;
    }
  }
  & .ant-space {
    cursor: pointer;
  }
  & img {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: transparent;
  }
  & .ant-space-item {
    max-width: 70px;
  }
  & p {
    color: white;
    margin-bottom: 0px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const CardApps = ({ user, config, ...props }) => {
  const defaultPhoto =
    "https://cdn-icons-png.flaticon.com/512/8415/8415113.png";

  const imgPsicometria =
    "https://www.nicepng.com/png/full/197-1975724_research-icon-png-marketing.png";

  const imgNomina = "https://www.masadmin.net/imgs/icon12.png";

  const imgSocial = "https://cdn-icons-png.flaticon.com/512/2065/2065203.png";

  const imgPeople = "https://cdn-icons-png.flaticon.com/512/3791/3791146.png";

  const linkToProfile = () => {
    const token = user.jwt_data.metadata.at(-1).token;
    const url = `${getCurrentURL(
      true
    )}.${urlMyAccount}/validation?token=${token}`;
    // const url = `${getCurrentURL(true)}.localhost:3001/validation?token=${token}`;
    redirectTo(url);
  };

  const linkToPeople = () => {
    const token = user.jwt_data.metadata.at(-1).token;
    const url = `${getCurrentURL(true)}.${urlPeople}/validation?token=${token}`;
    // const url = `${getCurrentURL(true)}.localhost:3000/validation?token=${token}`;
    redirectTo(url);
  };

  const linktToSocial = () => {
    const token = user.jwt_data.metadata.at(-1).token;
    const url = `${getCurrentURL(true)}.${urlSocial}/validation?token=${token}`;
    redirectTo(url);
  };

  const redirectTo = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.click();
  };

  return (
    <ContentApps>
      <Card bordered={false}>
        <Row gutter={[8, 16]}>
          {config && config.kuiz_enabled ? (
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linkToProfile()}
              >
                <img src={defaultPhoto} />
                <p style={{ marginBottom: "0px" }}>Mi perfil</p>
              </Space>
            </Col>
          ) : null}
          {user &&
          (user.intranet_access === 2 || user.intranet_access === 3) ? (
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linktToSocial()}
              >
                <img src={imgSocial} />
                <p style={{ marginBottom: "0px" }}>Red social</p>
              </Space>
            </Col>
          ) : null}
          <Col span={8}>
            <Space
              direction="vertical"
              align="center"
              onClick={() => linkToPeople()}
            >
              <img src={imgPeople} />
              <p style={{ marginBottom: "0px" }}>People</p>
            </Space>
          </Col>
        </Row>
        {/* <Divider style={{background: '#5f6368'}}/>
            <Row justify='center'>
                <Button
                    icon={<LogoutOutlined/>}
                    size={'small'}
                    onClick={()=>logoutAuth()}
                >
                    Cerrar sesión
                </Button>
            </Row> */}
      </Card>
    </ContentApps>
  );
};

const mapState = (state) => {
  return {
    user: state.userStore.user,
    config: state.userStore.general_config,
  };
};

export default connect(mapState)(CardApps);
