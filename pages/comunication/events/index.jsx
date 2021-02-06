import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import {
  Row,
  Col,
  Table,
  Breadcrumb,
  Form,
  Select,
  Button,
  message,
  Modal,
  Spin,
} from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const Events = () => {
  const { Column } = Table;
  const { confirm } = Modal;
  const route = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(null);
  const { Option } = Select;
  const [evenstList, setEventList] = useState([]);

  const getAllEvents = async () => {
    try {
      setLoading(true);
      let response = await axiosApi.get(`/person/event/`);
      let data = response.data.results;
      setLoading(false);
      console.log(data);
      setEventList(data);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const deleteEvent = async (id) => {
    try {
      setLoading(true);
      let response = await axiosApi.delete(`/person/event/${id}/`);
      if (response.status === 204) {
        setLoading(false);
        message.success({
          content: "Evento eliminado satisfactoriamente",
          className: "custom-class",
          style: {
            marginTop: "20vh",
          },
        });
        console.log("Elemento Eliminado", id);
        getAllEvents();
      }
      console.log(response);
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  };

  const confirmDelete = (id) => {
    confirm({
      title: "Esta seguro de eliminar el elemento?",
      icon: <ExclamationCircleOutlined />,
      content: "Si elimina el elemento no podrá recuperarlo",
      onOk() {
        deleteEvent(id);
      },
      onCancel() {},
    });
  };

  useEffect(() => {
    getAllEvents();
  }, [route]);

  return (
    <MainLayout currentKey="4.2">
      <Breadcrumb>
        <Breadcrumb.Item>Inicio</Breadcrumb.Item>
        <Breadcrumb.Item>Eventos</Breadcrumb.Item>
      </Breadcrumb>
      <div className="container" style={{ width: "100%" }}>
        <Spin tip="Loading..." spinning={loading}>
          <Row justify={"end"}>
            <Col style={{ padding: "20px 0" }}>
              <Button
                style={{
                  background: "#fa8c16",
                  fontWeight: "bold",
                  color: "white",
                }}
                onClick={() => route.push("events/add")}
              >
                <PlusOutlined />
                Agregar nuevo evento
              </Button>
            </Col>
            <Col span={24}>
              <Table dataSource={evenstList} key="table_events">
                <Column title="ID" dataIndex="id" key="id"></Column>
                <Column title="title" dataIndex="title" key="title"></Column>
                <Column title="Date" dataIndex="date" key="date"></Column>
                <Column
                  title="Acciones"
                  key="actions"
                  render={(text, record) => (
                    <>
                      <a
                        onClick={() =>
                          route.push({
                            pathname: "/comunication/events/detail",
                            query: { type: "edit", id: record.id },
                          })
                        }
                      >
                        <EditOutlined
                          className="icon_actions"
                          key={"edit_" + record.id}
                        />
                      </a>
                      <DeleteOutlined
                        className="icon_actions"
                        key={"delete" + record.id}
                        onClick={() => confirmDelete(record.id)}
                      />
                    </>
                  )}
                ></Column>
              </Table>
            </Col>
          </Row>
        </Spin>
      </div>
    </MainLayout>
  );
};
export default Events;
