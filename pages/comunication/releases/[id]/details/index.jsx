import Head from "next/head";
import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Typography,
  notification,
  Card,
  Layout,
  Menu,
  Breadcrumb,
} from "antd";
import MainLayout from "../../../../../layout/MainLayout";
import { Global, css } from "@emotion/core";
import { useRouter } from "next/router";
import axiosApi from "../../../../../libs/axiosApi";

const Details = () => {
  const { Title, Text } = Typography;
  const route = useRouter();

  const { id } = route.query;
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await axiosApi.get(`/noticenter/notification/${id}`);
      let data = response.data;
      console.log("data", data);
      setDetails(data);
      setLoading(false);
      //setList(data.results)
    } catch (e) {
      console.log("error", e);
      /* setLoading(false); */
    }
  };

  const TextGender = (props) => {
    let txt = "";
    if (props.id_gender === 1) {
      txt = "Masculino";
    } else if (props.id_gender === 2) {
      txt = "Femenino";
    } else {
      txt = "Otro";
    }
    return <span>{txt}</span>;
  };

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [route]);

  return (
    <>
      <Global
        styles={css`
          .py-10 {
            padding: 10px 0;
          }
        `}
      />
      <MainLayout currentKey="4.1">
        <Breadcrumb>
          <Breadcrumb.Item>Inicio</Breadcrumb.Item>
          <Breadcrumb.Item key="releases" href="/comunication/releases">
            Comunicados
          </Breadcrumb.Item>
          <Breadcrumb.Item>Detalles</Breadcrumb.Item>
        </Breadcrumb>
        <div className="container back-white" style={{ width: "100%" }}>
          {!loading ? (
            <Row justify={"center"}>
              <Col span="23" style={{ padding: "20px 0 30px 0" }}>
                <Row>
                  <Col span={24}>
                    <Title level={3}>Datos generales</Title>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                    <Row>
                      <Col span={4} className={"py-10"}>
                        <Text strong>Categoría:</Text>
                      </Col>
                      <Col span={20} className={"py-10"}>
                        Aviso
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} className={"py-10"}>
                        <Text strong>Título:</Text>
                      </Col>
                      <Col span={20} className={"py-10"}>
                        {details ? details.title : null}
                      </Col>
                    </Row>
                    <Row>
                      <Col span={4} className={"py-10"}>
                        <Text strong>Mensaje:</Text>
                      </Col>
                      <Col
                        span={20}
                        className={"py-10"}
                        dangerouslySetInnerHTML={{ __html: details.message }}
                      ></Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Title level={3}>Segmentación</Title>
                  </Col>
                  <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                    <Row>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Row>
                          <Col span={10} className={"py-10"}>
                            <Text strong>Empresa:</Text>
                          </Col>
                          <Col span={14} className={"py-10"}>
                            {details && details.target_company
                              ? details.target_company.name
                              : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10} className={"py-10"}>
                            <Text strong>Puesto de trabajo:</Text>
                          </Col>
                          <Col span={14} className={"py-10"}>
                            {details && details.target_job
                              ? details.target_job.name
                              : null}
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                        <Row>
                          <Col span={10} className={"py-10"}>
                            <Text strong>Tipo de persona:</Text>
                          </Col>
                          <Col span={14} className={"py-10"}>
                            {details && details.target_person_type
                              ? details.target_person_type.name
                              : null}
                          </Col>
                        </Row>
                        <Row>
                          <Col span={10} className={"py-10"}>
                            <Text strong>Género:</Text>
                          </Col>
                          <Col span={14} className={"py-10"}>
                            <TextGender id_gender={details.target_gender} />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24} style={{ textAlign: "right" }}>
                    <Button
                      onClick={() => route.push("/comunication/releases")}
                      style={{ padding: "0 50px", margin: "0 10px" }}
                    >
                      Regresar
                    </Button>
                  </Col>

                  {/* <Col xs={24} sm={24} md={13} lg={13} xl={13}>
                                        <Row>
                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                <Form.Item name={'company'}  label="Empresa" labelCol={{ span:10}}>
                                                    <Select >
                                                        <Option value="rmb">RMB</Option>
                                                        <Option value="dollar">Dollar</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name={'company'}  label="Puesto de trabajo" labelCol={{ span:10}}>
                                                    <Select >
                                                        <Option value="rmb">RMB</Option>
                                                        <Option value="dollar">Dollar</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
                                                <Form.Item name={'person_type'}  label="Tipo de persona" labelCol={{ span:10}}>
                                                    <Select >
                                                        <Option value="rmb">RMB</Option>
                                                        <Option value="dollar">Dollar</Option>
                                                    </Select>
                                                </Form.Item>
                                                <Form.Item name={'gender'}  label="Genero" labelCol={{ span:10}}>
                                                    <Select >
                                                        <Option value="rmb">RMB</Option>
                                                        <Option value="dollar">Dollar</Option>
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col span={24} style={{ textAlign: 'right' }}>
                                        <Button onClick={() => onCancel() } disabled={sending} style={{ padding:'0 50px', margin: '0 10px' }}>Cancelar</Button>        
                                        <Button htmlType="submit" loading={sending} type="primary" style={{ padding:'0 50px', margin: '0 10px' }}>Enviar</Button>    
                                    </Col> */}
                </Row>
              </Col>
            </Row>
          ) : null}
        </div>
      </MainLayout>
    </>
  );
};

export default Details;
