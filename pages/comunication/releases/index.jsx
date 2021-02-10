import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Space,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axiosApi from "../../../libs/axiosApi";
import moment from "moment-timezone";
import { useRouter } from "next/router";
import cookie from "js-cookie";
import { EyeOutlined } from "@ant-design/icons";
import BreadcrumbHome from "../../../components/BreadcrumbHome";
import { withAuthSync } from "../../../libs/auth";

const Releases = () => {
  /* React */
  const { Column } = Table;
  const { Option } = Select;
  const { RangePicker } = DatePicker;
  /* const childRef = useRef(); */
  const route = useRouter();
  /* Variables */
  const [list, setList] = useState([]);
  const [personList, setPersonList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dateOne, setDateOne] = useState(null);
  const [dateTwo, setDateTwo] = useState(null);

  let userToken = cookie.get("userToken") ? cookie.get("userToken") : null;

  const getNotifications = async (
    created_by = null,
    category = null,
    dateOne = null,
    dateTwo = null
  ) => {
    setLoading(true);
    let url = `/noticenter/notification/?`;
    if (created_by) {
      url += `created_by__id=${created_by}&`;
    }
    if (category) {
      url += `category=${category}&`;
    }
    if (dateOne && dateTwo) {
      let d1 = moment(`${dateOne} 00:00:01`).tz("America/Merida").format();
      let d2 = moment(`${dateTwo} 23:59:00`).tz("America/Merida").format();
      console.log(d1);
      console.log(d2);
      url += `timestamp__gte=${d1}&timestamp__lte=${d2}&`;
    }
    try {
      let response = await axiosApi.get(url);
      let data = response.data;
      setList(data.results);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      /* setLoading(false); */
    }
  };

  const getAllPersons = async () => {
    try {
      let response = await axiosApi.get(`/person/person/`);
      let data = response.data.results;
      console.log(data);
      data = data.map((a) => {
        return {
          label: a.first_name + " " + a.flast_name,
          value: a.id,
          key: a.name + a.id,
        };
      });
      setPersonList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const GotoDetails = (details) => {
    console.log("details", details);
    route.push("./releases/" + details.id + "/details");
  };

  const GoToUserNotifications = (props) => {
    return (
      <Button
        onClick={() =>
          route.push("./releases/" + props.notification_id + "/users")
        }
        type="text"
      >
        Ver
      </Button>
    );
  };

  const onchangeRange = (date, dateString) => {
    console.log(date);
    console.log(dateString);
    setDateOne(dateString[0]);
    setDateTwo(dateString[1]);
  };

  const sendFilter = (values) => {
    console.log(values);
    getNotifications(values.send_by, values.category, dateOne, dateTwo);
  };

  useEffect(() => {
    getNotifications();
    getAllPersons();
  }, []);

  return (
    <MainLayout currentKey="4.1">
      <Breadcrumb key="Breadcrumb">
        <BreadcrumbHome />
        <Breadcrumb.Item key="releases">Comunicados</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Row justify="space-between" key="row1">
          <Col>
            <Form
              name="filter"
              layout="inline"
              key="form"
              onFinish={sendFilter}
            >
              <Form.Item key="send_by" name="send_by" label="Enviado por">
                <Select
                  options={personList}
                  style={{ width: 150 }}
                  placeholder={"Todos"}
                  allowClear
                />
              </Form.Item>
              <Form.Item key="category" name="category" label="Categoría">
                <Select style={{ width: 150 }} key="select" allowClear>
                  <Option key="item_1" value="1">
                    Aviso
                  </Option>
                  <Option key="item_2" value="2">
                    Noticia
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                name="send_date"
                label="Fecha de envio"
                key="send_date"
              >
                <RangePicker onChange={onchangeRange} />
              </Form.Item>
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                htmlType="submit"
              >
                Filtrar
              </Button>
            </Form>
          </Col>
          <Col>
            {/* <Button onClick={() => childRef.current.showModal()}  style={{background: "#fa8c16", fontWeight: "bold", color: "white" }} > */}
            <Button
              key="add"
              onClick={() => route.push("releases/new")}
              style={{
                background: "#fa8c16",
                fontWeight: "bold",
                color: "white",
              }}
            >
              <PlusOutlined />
              Agregar nuevo
            </Button>
          </Col>
        </Row>
        <Row key="row2">
          <Col span={24}>
            <Table
              dataSource={list}
              key="releases_table"
              className={"mainTable"}
              loading={loading}
            >
              <Column title="Categoría" dataIndex="title" key="title" />
              <Column
                title="Enviado por"
                dataIndex="created_by"
                key="send_by"
                render={(text, record) =>
                  text.first_name + " " + text.flast_name
                }
              />
              <Column
                title="Categoría"
                dataIndex="category"
                key="cat"
                render={(text, record) => (text == 1 ? "Aviso" : "Noticia")}
              />
              <Column
                title="Fecha"
                dataIndex="timestamp"
                key="date"
                render={(text, record) => moment(text).format("DD / MM / YYYY")}
              />
              <Column
                title="Recibieron"
                key="recibieron"
                render={(text, record) => (
                  <GoToUserNotifications
                    key={"goUser" + record.id}
                    notification_id={record.id}
                  />
                )}
              />
              <Column
                title="Acciones"
                key="action"
                render={(text, record) => (
                  <EyeOutlined
                    key={"goDetails_" + record.id}
                    onClick={() => GotoDetails(record)}
                  />
                )}
              />
            </Table>
          </Col>
        </Row>
      </div>
      {/* <ModalCreateNotification  reloadData={getNotifications} /> */}
    </MainLayout>
  );
};

export default withAuthSync(Releases);
