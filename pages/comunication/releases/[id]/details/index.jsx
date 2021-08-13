import React, { useEffect, useState } from "react";
import { Row, Col, Button, Typography, Breadcrumb, Table } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import MainLayout from "../../../../../layout/MainLayout";
import { Global, css } from "@emotion/core";
import { useRouter } from "next/router";
import { withAuthSync } from "../../../../../libs/auth";
import { API_URL } from "../../../../../config/config";
import Axios from "axios";

const Details = () => {
  const { Title, Text } = Typography;
  const route = useRouter();

  const { id } = route.query;
  const [details, setDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const getDetails = async () => {
    setLoading(true);
    try {
      let response = await Axios.get(
        API_URL + `/noticenter/notification/${id}`
      );
      let data = response.data;
      setDetails(data);
      setFiles(data.files);
      setLoading(false);
      //setList(data.results)
    } catch (e) {
      console.log(e);
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

  const colFile = [
    {
      title: "Adjunto",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              <Col className="gutter-row" offset={1}>
                <a href={item.file}>
                  <FileTextOutlined style={{ fontSize: "30px" }} />
                </a>
              </Col>
            </Row>
          </div>
        );
      },
    },
  ];

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
          <Breadcrumb.Item
            className={"pointer"}
            onClick={() => route.push({ pathname: "/home" })}
          >
            Inicio
          </Breadcrumb.Item>
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
                    <Table
                      columns={colFile}
                      dataSource={files}
                      locale={{
                        emptyText: loading
                          ? "Cargando..."
                          : "No se encontraron resultadoss.",
                      }}
                    />
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

export default withAuthSync(Details);
