import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import MainLayout from "../../../layout/MainLayout";
import { Row, Col, Table, Breadcrumb, Form, Select, Button } from "antd";
import { useRouter } from "next/router";
import axiosApi from "../../../libs/axiosApi";
import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  SearchOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const Events = () => {
  const { Column } = Table;
  const route = useRouter();
  const [form] = Form.useForm();
  const { Option } = Select;

  const [evenstList, setEventList] = useState([]);

  const getAllEvents = async () => {
    try {
      let response = await axiosApi.get(`/person/event/`);
      let data = response.data.results;
      console.log(data);
      setEventList(data);
    } catch (e) {
      console.log(e);
    }
  };

  const GotoDetails = (data) => {
    console.log(data);
    route.push("events/" + data.id + "/details");
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
                    <EyeOutlined
                      className="icon_actions"
                      key={"goDetails_" + record.id}
                      onClick={() => GotoDetails(record)}
                    />
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
                  </>
                )}
              ></Column>
            </Table>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
};
export default Events;
