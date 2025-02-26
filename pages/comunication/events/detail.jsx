import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {
  Breadcrumb,
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Layout,
  message,
  Row,
  Select,
  Space,
  Spin,
  TimePicker,
  Typography,
} from "antd";

import MainLayout from "../../../layout/MainInter";
import moment from "moment";
import {withAuthSync} from "../../../libs/auth";
import TextArea from "antd/lib/input/TextArea";
import {connect} from "react-redux";
import locale from "antd/lib/date-picker/locale/es_ES";
import axiosApi from "../../../api/axiosApi";
import {verifyMenuNewForTenant} from "../../../utils/functions"

const { Content } = Layout;
const { Title } = Typography;
const { RangePicker } = TimePicker;
const { Option } = Select;

const addEvent = ({ ...props }) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [value, setValue] = useState(1);
  const [dateEvent, setDateEvent] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [persons, setPersons] = useState([]);
  const [personsSelect, setPersonsSelect] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edit, setEdit] = useState(false);
  const [description, setDescription] = useState(null);

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
        guests: [],
        node: data,
      });
    } else {
      form.setFieldsValue({
        node: null,
      });
    }
  };

  const getPersons = async () => {
    axiosApi
      .post(`/person/person/get_list_persons/`, {
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
    axiosApi
      .get(`/business/node/?id=${props.currentNode.id}`)
      .then((response) => {
        let data = response.data.results;
        data = data.map((a) => {
          return { label: a.name, value: a.id };
        });
        setNodes(data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getEvent = async (id) => {
    setLoading(true);

    axiosApi
      .get(`/person/event/${id}/`)
      .then((response) => {
        let data = response.data;
        let node_id = null;
        let guestsid = [];
        let type_select = 1;

        if (data.node === null) {
          setValue(2);
          type_select = 2;
          let guests = data.guests.map((a) => {
            return a.id;
          });
          guestsid = guests;
        } else {
          setValue(1);
          type_select = 1;
          node_id = data.node.id;
          setPersonsSelect([]);
        }
        form.setFieldsValue({
          id: data.id,
          title: data.title,
          date: moment(data.date),
          time: [
            moment(data.start_time, "HH:mm:ss"),
            moment(data.end_time, "HH:mm:ss"),
          ],
          node: node_id,
          guests: guestsid,
          guest_node: type_select,
          description: data.description,
        });
        setStartTime(data.start_time);
        setEndTime(data.end_time);
        setDateEvent(data.date);
        setLoading(false);
      })
      .catch((response) => {
        setLoading(false);
        message.error("Error al obtener los datos, intente de nuevo");
      });
  };

  const onFinish = async (values) => {
    let datos = {};
    datos.id = values.id;
    datos.title = values.title;
    datos.date = dateEvent;
    datos.start_time = startTime;
    datos.end_time = endTime;
    datos.description = values.description;
    if (value === 1) {
      datos.node = values.node;
      datos.guests = [];
    } else {
      datos.guests = values.guests;
      datos.node = null;
    }
    setLoading(true);

    axiosApi
      .put(`/person/event/${datos.id}/`, datos)
      .then((response) => {
        message.success("Editado correctamente");
        router.push("/comunication/events");
        setLoading(false);
      })
      .catch((response) => {
        setLoading(false);
        message.error("Error al agregar, intente de nuevo");
      });
  };

  useEffect(() => {

    console.log(router.query)
    if (props.currentNode) {
      getPersons();
      getNodes();
      let type = router.query.type;
      if (type === "edit") {
        setEdit(true);
        getEvent(router.query.id);
      } else {
        setEdit(false);
      }
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
        {verifyMenuNewForTenant() && 
          <>
            <Breadcrumb.Item>Administración de RH</Breadcrumb.Item>
            <Breadcrumb.Item>Concierge</Breadcrumb.Item>
          </>
        }
        <Breadcrumb.Item
          className={"pointer"}
          onClick={() => router.push({ pathname: "/comunication/events" })}
        >
          Eventos
        </Breadcrumb.Item>
        <Breadcrumb.Item>Editar evento</Breadcrumb.Item>
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
                  <Title level={3}>Editar eventos</Title>
                </Col>
                <Divider style={{ marginTop: "2px" }} />
                <Col span={24}>
                  <Form onFinish={onFinish} form={form} layout={"vertical"}>
                    <Row>
                      <Col>
                        <Form.Item
                          name="id"
                          rules={[
                            {
                              required: true,
                              message: "Id requediro",
                            },
                          ]}
                          hidden
                        >
                          <Input hidden type="text" placeholder="Título" />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Título"
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Por favor ingresa un titulo",
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
                            value={dateEvent}
                            locale={locale}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item name="guest_node" label="Tipo de invitados">
                          <Select
                            showSearch
                            defaultValue={value}
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
                              placeholder="Selecciona una organizacion"
                              options={nodes}
                              notFoundContent={"No se encontraron resultados."}
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
                              options={persons}
                              notFoundContent={"No se encontraron resultados."}
                            ></Select>
                          </Form.Item>
                        </Col>
                      )}
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          label="Descripción"
                          name="description"
                          /* rules={[
                            {
                              required: true,
                              message: "Por favor selecciona un rango de horas",
                            },
                          ]} */
                        >
                          <TextArea
                            rows="4"
                            style={{ marginLeft: 6 }}
                            onChange={(e) => setDescription(e.target.value)}
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

const mapState = (state) => {
  return {
    currentNode: state.userStore.current_node,
  };
};

export default connect(mapState)(withAuthSync(addEvent));
