import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../layout/MainLayout";
import {
  Row,
  Col,
  Breadcrumb,
  Tooltip,
  Spin,
  Card,
  Statistic,
  Skeleton,
} from "antd";
import useRouter from "next/router";
import Axios from "axios";
import { API_URL } from "../../config/config";
import { InfoCircleOutlined, DollarOutlined } from "@ant-design/icons";

import { userCompanyId, userCompanyName, withAuthSync } from "../../libs/auth";

const StatisticsPayroll = () => {
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
        console.log(response.data);
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
    width: "90%",
  };

  const PayrollDepartment = ({ data }) => {
    return (
      <>
        {data.map((d) => {
          <Col lg={8} xs={24} style={center}>
            {a.total_perceptions_sum ? (
              <Skeleton active />
            ) : (
              <Card bordered={false} style={centerBG}>
                <div style={{ textAlign: "right" }}>
                  <Tooltip title="Nomina total bruta de la empresa.">
                    <InfoCircleOutlined style={{ color: "white" }} />
                  </Tooltip>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Tooltip title="Nomina total bruta de la empresa.">
                    <span style={{ fontSize: 20, color: "white" }}>
                      {d.person__job__department_name}
                    </span>
                  </Tooltip>
                </div>
                <Statistic
                  style={{ textAlign: "center" }}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: "white" }}
                  value={a.total_perceptions_sum}
                  precision={2}
                />
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
          </Col>;
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
          <Breadcrumb.Item>Nomina empresarial</Breadcrumb.Item>
        </Breadcrumb>
        <div
          className="container back-white"
          style={{ width: "100%", padding: "20px 0" }}
        >
          <div style={{ textAlign: "left", padding: 10 }}>
            <Tooltip title="Nomina total bruta de la empresa.">
              <span style={{ fontSize: 20 }}>Nomina empresarial</span>
            </Tooltip>
          </div>
          <Spin spinning={loading}>
            <Row>
              <Col lg={8} xs={24} style={center}>
                {payroll.total_perceptions_business ? (
                  <Skeleton active />
                ) : (
                  <Card bordered={false} style={centerBG}>
                    <div style={{ textAlign: "right" }}>
                      <Tooltip title="Nomina total bruta de la empresa.">
                        <InfoCircleOutlined style={{ color: "white" }} />
                      </Tooltip>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <Tooltip title="Nomina total bruta de la empresa.">
                        <span style={{ fontSize: 20, color: "white" }}>
                          {companyName && companyName}
                        </span>
                      </Tooltip>
                    </div>
                    <Statistic
                      style={{ textAlign: "center" }}
                      prefix={<DollarOutlined />}
                      valueStyle={{ color: "white" }}
                      value={payroll.total_perceptions_business}
                      precision={2}
                    />
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
            </Row>

            <Row>
              {payroll.departments && payroll.departments.length > 0 && (
                <>
                  <div style={{ textAlign: "left", padding: 10 }}>
                    <Tooltip title="Nomina total bruta de la empresa.">
                      <span style={{ fontSize: 20 }}>
                        Nomina por departamento
                      </span>
                    </Tooltip>
                  </div>
                  <PayrollDepartment data={payroll.departments} />
                </>
              )}
            </Row>
          </Spin>
        </div>
      </MainLayout>
    </>
  );
};

export default withAuthSync(StatisticsPayroll);
