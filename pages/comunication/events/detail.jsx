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
  const [personsSelect, setPersonsSelect] = useState([]);
  const [nodes, setNodes] = useState([]);
  const [edit, setEdit] = useState(false);

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
    try {
      let response = await axiosApi.get(`/person/person/`);
      let data = response.data.results;
      data = data.map((a) => {
        return { label: a.first_name + " " + a.flast_name, value: a.id };
      });
      setPersons(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getNodes = async () => {
    try {
      let response = await axiosApi.get(`/business/node/`);
      let data = response.data.results;
      data = data.map((a) => {
        return { label: a.name, value: a.id };
      });
      setNodes(data);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const getEvent = async (id) => {
    setLoading(true);

    Axios.get(API_URL + `/person/event/${id}/`)
      .then((response) => {
        console.log("res", response.data);
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
          console.log(guests);
        } else {
          setValue(1);
          type_select = 2;
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
    if (value === 1) {
      datos.node = values.node;
      datos.guests = [];
    } else {
      datos.guests = values.guests;
      datos.node = null;
    }
    setLoading(true);

    Axios.put(API_URL + `/person/event/${datos.id}/`, datos)
      .then((response) => {
        message.success("Editado correctamente");
        router.push("/comunication/events");
        console.log("res", response.data);
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
    const { id } = router.query;
    console.log(router.query);
    let type = router.query.type;
    if (type === "edit") {
      setEdit(true);
      if (id !== undefined) {
        getEvent(id);
      }
    } else {
      setEdit(false);
    }
  }, [router]);

  return (
    <MainLayout currentKey="4.2">
      <Breadcrumb style={{ margin: "16px 0" }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>Eventos</Breadcrumb.Item>
        <Breadcrumb.Item>Crear</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="site-layout">
        <Spin tip="Loading..." spinning={loading}>
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380, height: "100%" }}
          >
            <div style={{ padding: 24 }}>
              <Row>
                <Col span={24}>
                  <Title level={3}>Crear Eventos</Title>
                </Col>
                <Divider style={{ marginTop: "2px" }} />
                <Col span={24}>
                  <Form onFinish={onFinish} form={form}>
                    <Row>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          name="id"
                          rules={[
                            {
                              required: true,
                              message: "Please input the title!",
                            },
                          ]}
                          hidden
                        >
                          <Input type="text" placeholder="Titulo" />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          name="title"
                          rules={[
                            {
                              required: true,
                              message: "Please input the title!",
                            },
                          ]}
                        >
                          <Input type="text" placeholder="Titulo" />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          name="date"
                          rules={[
                            {
                              required: true,
                              message: "Please select the date!",
                            },
                          ]}
                        >
                          <DatePicker
                            style={{ width: "100%" }}
                            onChange={onChangeDate}
                            moment={"YYYY-MM-DD"}
                            placeholder="Fecha"
                            value={dateEvent}
                          />
                        </Form.Item>
                      </Col>
                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item
                          name="time"
                          rules={[
                            {
                              required: true,
                              message: "Please input the start and end time!",
                            },
                          ]}
                        >
                          <RangePicker
                            onChange={onChangeTime}
                            style={{ width: "100%" }}
                          />
                        </Form.Item>
                      </Col>

                      <Col lg={10} xs={22} offset={1}>
                        <Form.Item name="guest_node">
                          <Select
                            showSearch
                            defaultValue={value}
                            placeholder="Tipo de invitados"
                            onChange={selectNodeGests}
                          >
                            <Option value={1}>Organizacion</Option>
                            <Option value={2}>Personas</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      {value === 1 ? (
                        <Col lg={10} xs={22} offset={1}>
                          <Form.Item
                            name="node"
                            rules={[
                              {
                                required: true,
                                message: "Please select the Organization!",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              placeholder="Selecciona una organizacion"
                              options={nodes}
                            ></Select>
                          </Form.Item>
                        </Col>
                      ) : (
                        <Col lg={10} xs={22} offset={1}>
                          <Form.Item
                            name="guests"
                            rules={[
                              {
                                required: true,
                                message: "Please select the guests!",
                              },
                            ]}
                          >
                            <Select
                              mode="multiple"
                              allowClear
                              placeholder="Selecciona a los invitados"
                              options={persons}
                            ></Select>
                          </Form.Item>
                        </Col>
                      )}

                      <Col lg={22} xs={22} offset={1}>
                        <Form.Item labelAlign="right">
                          <Space style={{ float: "right" }}>
                            <Button
                              type="danger"
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
export default addEvent;
