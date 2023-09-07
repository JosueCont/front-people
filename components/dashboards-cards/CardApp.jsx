import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Card, Row, Col, Space, Button, Divider, Modal } from "antd";
import Cookies from "js-cookie";
import { getCurrentURL, redirectTo } from "../../utils/constant";
import { connect } from "react-redux";
import { domainApiWithTenant } from "../../api/axiosApi";
import { urlMyAccount, urlPeople, urlSocial, urlSukha, urlCareerlab, urlKhorflx } from "../../config/config";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import _ from "lodash"

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
    "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/account.png";

  const imgPsicometria =
    "https://www.nicepng.com/png/full/197-1975724_research-icon-png-marketing.png";

  const imgNomina = "https://www.masadmin.net/imgs/icon12.png";

  const imgSocial = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/khonect.png";

  const imgPeople = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/people.png";

  const imgKhorflix = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/khorflix.png";

  const imgSukhaTv = "https://khorplus.s3.us-west-1.amazonaws.com/demo/people/site-configuration/images/sukha.png";

  const imgCareerlab = "https://khorplus.s3.us-west-1.amazonaws.com/careerlab/careerlab.png";

  const [showYnlDownloadApp, setShowYnlDownloadApp] = useState(false);

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

  const linkToKhor = () => {
    const url = props.is_admin ? `${getCurrentURL(true)}.${urlPeople}/validationKhor?is_admin=${props.is_admin}` : `${getCurrentURL(true)}.${urlPeople}/validationKhor`;
    // const url = props.is_admin ? `${getCurrentURL(true)}.localhost:3000/validationKhor?is_admin=${props.is_admin}` : `${getCurrentURL(true)}.localhost:3000/validationKhor`;
    redirectTo(url);
  }

  const linkToExternalApp = (app_name) => {
    // const url = props.applications[app_name].front;
    switch (app_name) {
      case "sukhatv":
        const token1 = user.jwt_data.metadata.at(-1).token;
        // const url1 = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token1}`;
        let url1;
        if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA) {
          if (process.env.NEXT_PUBLIC_TENANT_USE_DEMO_SUKHA.includes(getCurrentURL(true, true))) {
            url1 = `https://demo.${urlSukha}/validation?token=${token1}`;
          } else {
            url1 = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token1}`;
          }
        } else {
          url1 = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token1}`;
        }
        redirectTo(url1);
        break;
      case "careerlab":
        const token2 = user.jwt_data.metadata.at(-1).token;
        // const url2 = `${getCurrentURL(true)}.${url}/validation?token=${token2}`;
        // const url2 = `https://platform.${urlCareerlab}/validation?token=${token2}`
        const url2 = `https://platform.${urlCareerlab}`
        redirectTo(url2);
        break;
      case "khorflix":
        const token3 = user.jwt_data.metadata.at(-1).token;
        // const url2 = `${getCurrentURL(true)}.${url}/validation?token=${token2}`;
        const url3 = `${getCurrentURL(true)}.${urlKhorflx}/validation?token=${token3}`
        redirectTo(url3);
        break;
      default:
        const token = user.jwt_data.metadata.at(-1).token;
        const url = `${getCurrentURL(true)}.${urlSukha}/validation?token=${token}`;
        redirectTo(url);
        break;
    }
  };

  return (
    <ContentApps>
      <Card bordered={false}>
        <Row gutter={[8, 16]}>
          {config && config.kuiz_enabled && !props.is_admin ? (
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linkToProfile()}
              >
                <img src={defaultPhoto} />
                <p style={{ marginBottom: "0px" }}>Mis evaluaciones</p>
              </Space>
            </Col>
          ) : null}
          {props?.applications &&
            (_.has(props.applications, "khor") && props.applications["khor"].active) && (
              <Col span={8}>
                <Space
                  direction="vertical"
                  align="center"
                  onClick={() => linkToKhor()}
                >
                  <img src={"/images/logoKhor15.svg"} />
                  <p style={{ marginBottom: "0px" }}>KHOR 1.5</p>
                </Space>
              </Col>
            )}
          {user &&
            (user.intranet_access === 2 || user.intranet_access === 3) && !props.is_admin ? (
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linktToSocial()}
              >
                <img src={imgSocial} />
                <p style={{ marginBottom: "0px" }}>Connect</p>
              </Space>
            </Col>
          ) : null}
          {/* <Col span={8}>
            <Space
              direction="vertical"
              align="center"
              onClick={() => linkToPeople()}
            >
              <img src={imgPeople} />
              <p style={{ marginBottom: "0px" }}>People</p>
            </Space>
          </Col> */}
          {props?.applications &&
            (_.has(props.applications, "khorflix") && props.applications["khorflix"].active) && !props.is_admin && user.khorflix_access ?
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linkToExternalApp("khorflix")}
              >
                <img src={imgKhorflix} />
                <p style={{ marginBottom: "0px" }}>Khorflix</p>
              </Space>
            </Col>
            : null
          }
          {props?.applications &&
            (_.has(props.applications, "sukhatv") && props.applications["sukhatv"].active) && !props.is_admin && user.sukhatv_access ?
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linkToExternalApp("sukhatv")}
              >
                <img src={imgSukhaTv} />
                <p style={{ marginBottom: "0px" }}>Sukha TV</p>
              </Space>
            </Col>
            : null
          }
          {props?.applications &&
            (_.has(props.applications, "careerlab") && props.applications["careerlab"].active) && !props.is_admin && user.careerlab ?
            <Col span={8}>
              <Space
                direction="vertical"
                align="center"
                onClick={() => linkToExternalApp("careerlab")}
              >
                <img src={imgCareerlab} />
                <p style={{ marginBottom: "0px" }}>Careerlab</p>
              </Space>
            </Col>
            : null
          }
          {/* {props?.applications &&
          (_.has(props.applications, "ynl") && props.applications["ynl"].active) ?
              <Col span={8}>
                <Space
                    direction="vertical"
                    align="center"
                    onClick={()=> setShowYnlDownloadApp(true)}
                >
                  <img src={"/images/LogoYnl.png"} />
                  <p style={{ marginBottom: "0px" }}>YNL</p>
                </Space>
              </Col>
              : null
          } */}
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
      <Modal
        title="Descarga la aplicación de YNL"
        centered
        visible={showYnlDownloadApp}
        onOk={() => setShowYnlDownloadApp(false)}
        onCancel={() => setShowYnlDownloadApp(false)}
        destroyOnClose={true}
        footer={
          <Col>
            <Space>
              <Button
                size="large"
                htmlType="button"
                onClick={() => setShowYnlDownloadApp(false)}
              >
                Cerrar
              </Button>
            </Space>
          </Col>
        }
      >
        <Row>
          <Col md={12} lg={12} xs={24}>
            <div className='flex-item' style={{ marginRight: "4px" }}>
              <a href="https://play.google.com/store/apps/details?id=com.hiumanlab.ynl&hl=es_MX" target={"_blank"}>
                <div style={{ backgroundColor: "#1C1B2B", padding: "10px", borderRadius: "15px", cursor: "pointer", height: "70px" }} >
                  <Row className="aligned-to-center">
                    <Col span={10}>
                      <FaGooglePlay style={{ color: "white", fontSize: "35px", marginLeft: "25px", marginTop: "5px" }} />
                    </Col>
                    <Col span={14}>
                      <span style={{ color: "white" }}>Disponible en <br /> Google Play</span>
                    </Col>
                  </Row>
                </div>
              </a>
            </div>
          </Col>
          <Col md={12} lg={12} xs={24}>
            <div className='flex-item'>
              <a href="https://apps.apple.com/mx/app/your-next-level/id1623871887" target={"_blank"}>
                <div style={{ backgroundColor: "#1C1B2B", padding: "10px", borderRadius: "15px", cursor: "pointer", height: "70px" }} >
                  <Row className="aligned-to-center">
                    <Col span={10}>
                      <FaApple style={{ color: "white", fontSize: "45px", marginLeft: "20px" }} />
                    </Col>
                    <Col span={14}>
                      <span style={{ color: "white" }}>Disponible en <br /> App Store</span>
                    </Col>
                  </Row>
                </div>
              </a>
            </div>
          </Col>
        </Row>
      </Modal>
    </ContentApps>
  );
};

const mapState = (state) => {
  return {
    user: state.userStore.user,
    config: state.userStore.general_config,
    applications: state.userStore.applications
  };
};

export default connect(mapState)(CardApps);
