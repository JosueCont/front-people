import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Layout,
  Breadcrumb,
  Row,
  Col,
  DatePicker,
  Space,
  Typography,
  Form,
  Input,
  Select,
  Button,
  Divider,
  TimePicker,
  Spin,
  message,
} from "antd";

import MainLayout from "../../../layout/MainLayout";
import Axios from "axios";
import { API_URL } from "../../../config/config";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment";
import { withAuthSync } from "../../../libs/auth";
import axios from "axios";

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = TimePicker;
const { Option } = Select;

const addEvent = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [value, setValue] = useState(1);
  const [dateEvent, setDateEvent] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [persons, setPersons] = useState([]);
  const [nodes, setNodes] = useState([]);

  const onChangeDate = (value) => {
    setDateEvent(moment(value).format("YYYY-MM-DD"));
  };
  const onChangeTime = (value) => {
    setStartTime(moment(value[0]).format("hh:mm:ss"));
    setEndTime(moment(value[1]).format("hh:mm:ss"));
  };
  const selectNodeGests = (value) => {
    setValue(value);
    if (value === 1) {
      form.setFieldsValue({
        guests: [],
      });
    } else {
      form.setFieldsValue({
        node: null,
      });
    }
  };

  const getPersons = async () => {
    axios
      .get(API_URL + `/person/person/`)
      .then((response) => {
        response.data.results = response.data.results.map((a) => {
          return { label: a.first_name + " " + a.flast_name, value: a.id };
        });
        setPersons(response.data.results);
        console.log(response.data.results);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getNodes = async () => {
    axios.get(API_URL + `/business/node/`).then((response) => {
      let data = response.data.results;
      data = data.map((a) => {
        return { label: a.name, value: a.id };
      });
      setNodes(data);
      console.log(data);
    });
  };
  const onFinish = async (values) => {
    let datos = {};
    datos.title = values.title;
    datos.date = dateEvent;
    datos.start_time = startTime;
    datos.end_time = endTime;
    if (value === 1) {
      datos.node = values.node;
      datos.guests = [];
    } else {
      datos.guests = values.guests;
      datos.node = null;
    }
    setLoading(true);

    Axios.post(API_URL + `/person/event/`, datos)
      .then((response) => {
        message.success("Agregado correctamente");
        router.push("/comunication/events");
        setLoading(false);
      })
      .catch((response) => {
        setLoading(false);
        message.error("Error al agregar, intente de nuevo");
      });
  };

  useEffect(() => {
    getPersons();
    getNodes();
  }, [router]);

  return (
    <MainLayout currentKey="4.2">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home" })}
        >
          Inicio
        </Breadcrumb.Item>
        <Breadcrumb.Item href={"/comunication/events"}>Eventos</Breadcrumb.Item>
        <Breadcrumb.Item>Crear evento</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <Spin tip="Cargando..." spinning={loading}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Row>
                <Col span={24}>
                  <Title level={3}>Crear eventos</Title>
                </Col>
                <Divider style={{ marginTop: "2px" }} />
                <Col span={24}>
                  <Form onFinish={onFinish} form={form} layout={"vertical"}>
                    <Row>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Título"
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Por favor ingresa un título",
                            },
                          ]}
                        >
                          <Input type="text" placeholder="Título" />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Fecha"
                          name="date"
                          rules={[
                            {
                              required: true,
                              message: "Por favor selecciona una fecha",
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            onChange={onChangeDate}
                            moment={"YYYY-MM-DD"}
                            placeholder="Fecha"
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item name="guest_node" label="Tipo de invitados">
                          <Select
                            showSearch
                            defaultValue={1}
                            placeholder="Tipo de invitados"
                            onChange={selectNodeGests}
                          >
                            <Option value={1}>Organización</Option>
                            <Option value={2}>Personas</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Hora de inicio y fin"
                          name="time"
                          rules={[
                            {
                              required: true,
                              message: "Por favor selecciona un rango de horas",
                            },
                          ]}
                        >
                          <RangePicker
                            onChange={onChangeTime}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>
                      {value === 1 ? (
                        <Col lg={10} xs={22} offset={1}>
                          <Form.Item
                            label="Organización"
                            name="node"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Por favor selecciona una organización",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Selecciona una organización"
                              options={nodes}
                            ></Select>
                          </Form.Item>
                        </Col>
                      ) : (
                        <Col lg={10} xs={22} offset={1}>
                          <Form.Item
                            label="Personas"
                            name="guests"
                            rules={[
                              {
                                required: true,
                                message: "Por favor selecciona invitados",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Selecciona invitados"
                              defaultValue={[]}
                              options={persons}
                            ></Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col lg={22} xs={22} offset={1}>
                        <Form.Item labelAlign="right">
                          <Space style={{ float: "right" }}>
                            <Button
                              type="default"
                              onClick={() =>
                                router.push("/comunication/events")
                              }
                            >
                              Cancelar
                            </Button>
                            <Button type="primary" htmlType="submit">
                              Guardar
                            </Button>
                          </Space>
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>
              <Row>
                <Col span={24}></Col>
              </Row>
            </div>
          </div>
        </Spin>
      </Content>
    </MainLayout>
  );
};
export default withAuthSync(addEvent);
