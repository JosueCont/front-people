import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import CurrencyFormat from "react-currency-format";
import {
  Row,
  Col,
  Breadcrumb,
  Tooltip,
  Spin,
  Card,
  Statistic,
  Skeleton,
  Typography,
  Divider,
  Image,
} from "antd";
import useRouter from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { InfoCircleOutlined, DollarOutlined } from "@ant-design/icons";

import { userCompanyId, userCompanyName, withAuthSync } from "../../libs/auth";

const StatisticsPayroll = () => {
  const { Title, Text } = Typography;
  const [loading, setLoading] = useState(false);
  const [payroll, setPayroll] = useState({});
  let nodeId = userCompanyId();
  let companyName = userCompanyName();
  useEffect(() => {
    getStatistics();
  }, []);

  const getStatistics = () => {
    Axios.get(API_URL + `/business/node/${nodeId}/get_dashboard_data/`)
      .then((response) => {
        setPayroll(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const center = {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    padding: 10,
  };
  const font = {
    fontSize: "16px",
  };

  const centerBG = {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#3d78b9",
    width: "100%",
  };

  const PayrollDepartment = (props) => {
    return (
      <>
        {props.data.map((a) => {
          return (
            <Col lg={6} xs={24} style={center}>
              {!a.total_perceptions_sum ? (
                <Skeleton active />
              ) : (
                <Card bordered={false} style={centerBG}>
                  <div style={{ textAlign: "center" }}>
                    <Title
                      level={3}
                      style={{ color: "white", marginBottom: 0 }}
                    >
                      {a.person__job__department__name}
                    </Title>
                    <Row justify="space-between">
                      <Col xs={24} md={11}>
                        <Title
                          level={5}
                          style={{
                            color: "white",
                            marginTop: 10,
                            marginBottom: 0,
                          }}
                        >
                          Nómina Bruta
                        </Title>
                        <Text style={{ color: "white", fontSize: 17 }}>
                          <CurrencyFormat
                            value={a.total_perceptions_sum}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </Text>
                      </Col>
                      <Col xs={24} md={11}>
                        <Title
                          level={5}
                          style={{
                            color: "white",
                            marginTop: 10,
                            marginBottom: 0,
                          }}
                        >
                          Nómina Neta
                        </Title>
                        <Text style={{ color: "white", fontSize: 17 }}>
                          <CurrencyFormat
                            value={a.net_total_sum}
                            displayType={"text"}
                            thousandSeparator={true}
                            prefix={"$"}
                          />
                        </Text>
                      </Col>
                    </Row>
                  </div>
                </Card>
              )}
            </Col>
          );
        })}
      </>
    );
  };

  return (
    <>
      <MainLayout currentKey="8.5">
        <Breadcrumb className={"mainBreadcrumb"}>
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => useRouter.push({ pathname: "/home" })}
          >
            Inicio
          </Breadcrumb.Item>
          <Breadcrumb.Item>Nómina empresarial</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="container back-white"
          style={{ width: "100%", padding: "20px " }}
        >
          <div style={{ textAlign: "left", padding: 10 }}>
            <Title level={3} style={{ marginBottom: 0 }}>
              Nómina empresarial
            </Title>
          </div>
          <Spin tip="Cargando..." spinning={loading}>
            {payroll.net_total_business > 0 ? (
              <Row>
                <Col lg={8} xs={24} style={center}>
                  {!payroll.total_perceptions_business ? (
                    <Skeleton active />
                  ) : (
                    <Card bordered={false} style={centerBG}>
                      <div style={{ textAlign: "center" }}>
                        {/* <Tooltip title="Nómina total bruta de la empresa."> */}
                        <Title
                          level={3}
                          style={{ color: "white", marginBottom: 0 }}
                        >
                          {companyName && companyName}
                        </Title>
                        {/* </Tooltip> */}
                        <Row>
                          <Col xs={24} md={12}>
                            <Title
                              level={5}
                              style={{
                                color: "white",
                                marginTop: 10,
                                marginBottom: 0,
                              }}
                            >
                              Nómina Bruta
                            </Title>
                            <Text style={{ color: "white", fontSize: 19 }}>
                              <CurrencyFormat
                                value={payroll.total_perceptions_business}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                            </Text>
                          </Col>
                          <Col xs={24} md={12}>
                            <Title
                              level={5}
                              style={{
                                color: "white",
                                marginTop: 10,
                                marginBottom: 0,
                              }}
                            >
                              Nómina Neta
                            </Title>
                            <Text style={{ color: "white", fontSize: 19 }}>
                              <CurrencyFormat
                                value={payroll.net_total_business}
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                              />
                            </Text>
                          </Col>
                        </Row>
                      </div>

                      {/* <div style={{ textAlign: "center" }}>
                        {timeUserViewed > 0 ? (
                          <FileExcelOutlined
                            onClick={() =>
                              downloadCsv({
                                url: "get_csv_avg_time_minutes_viewed_for_user",
                                csv:
                                  "tiempo-promedio-minutos-vistos-usuario.csv",
                              })
                            }
                            style={{
                              textAlign: "center",
                              fontSize: "30px",
                              color: "white",
                            }}
                          />
                        ) : (
                          ""
                        )}
                      </div> */}
                    </Card>
                  )}
                </Col>
                <Divider />
                <Col span={24}>
                  {payroll.departments && payroll.departments.length > 0 && (
                    <div style={{ textAlign: "left", padding: 10 }}>
                      <Title level={3} style={{ marginBottom: 0 }}>
                        Nómina por departamento
                      </Title>
                    </div>
                  )}
                </Col>
                {payroll.departments && payroll.departments.length > 0 && (
                  <PayrollDepartment data={payroll.departments} />
                )}
              </Row>
            ) : (
              <>
                <div className={"NoData"}></div>
                <div
                  style={{ textAlign: "center", width: "100%", margin: "auto" }}
                >
                  {" "}
                  <h3>No se encontraron resultadoss</h3>
                </div>
              </>
            )}
          </Spin>
        </div>
      </MainLayout>
    </>
  );
};

export default withAuthSync(StatisticsPayroll);
