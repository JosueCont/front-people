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
import moment from "moment";
import { withAuthSync } from "../../../libs/auth";
import axios from "axios";
import { connect } from "react-redux";

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = TimePicker;
const { Option } = Select;

const addEvent = (props) => {
  const { TextArea } = Input;
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
      let data = nodes[0].value;
      form.setFieldsValue({
        node: data,
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
      .post(API_URL + `/person/person/get_list_persons/`, {
        node: props.currentNode.id,
      })
      .then((response) => {
        response.data = response.data.map((a) => {
          return { label: a.first_name + " " + a.flast_name, value: a.id };
        });
        setPersons(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getNodes = async () => {
    axios
      .get(API_URL + `/business/node/?id=${props.currentNode.id}`)
      .then((response) => {
        let data = response.data.results;
        data = data.map((a) => {
          return { label: a.name, value: a.id };
        });
        setNodes(data);
        form.setFieldsValue({
          node: data[0].value,
          guests: [],
        });
      });
  };
  const onFinish = async (values) => {
    let datos = {};
    datos.title = values.title;
    datos.date = dateEvent;
    datos.start_time = startTime;
    datos.end_time = endTime;
    datos.description = values.description;
    datos.node = parseInt(props.currentNode.id);
    if (values.guests) datos.guests = values.guests;
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
    if (props.currentNode) {
      getPersons();
      getNodes();
    }
  }, [props.currentNode]);

  return (
    <MainLayout currentKey={["events"]} defaultOpenKeys={["comunication"]}>
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => route.push({ pathname: "/home/persons/" })}
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
                            notFoundContent={"No se encontraron resultados."}
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
                              notFoundContent={"No se encontraron resultados."}
                            />
                          </Form.Item>
                        </Col>
                      ) : (
                        <Col lg={10} xs={22} offset={1}>
                          <Form.Item label="Personas" name="guests">
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Selecciona invitados"
                              defaultValue={[]}
                              options={persons}
                              notFoundContent={"No se encontraron resultados."}
                            />
                          </Form.Item>
                        </Col>
                      )}

                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Descripción"
                          name="description"
                          rules={[
                            {
                              required: true,
                              message: "Por ingrese una descripción",
                            },
                          ]}
                        >
                          <TextArea
                            rows="4"
                            style={{ marginLeft: 6 }}
                            showCount
                            maxLength={100}
                          />
                        </Form.Item>
                      </Col>

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
                            <Button
                              disabled={loading}
                              type="primary"
                              htmlType="submit"
                            >
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

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(addEvent));
