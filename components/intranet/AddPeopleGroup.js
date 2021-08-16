import { Button, Col, Form, Layout, Modal, Row, Select, Space } from "antd";
import axios from "axios";
import { API_URL } from "../../config/config";
import React, { useEffect, useState } from "react";
import { userCompanyId } from "../../libs/auth";

const { Option } = Select;
const AddPeopleGroup = (props) => {
  const [form] = Form.useForm();
  const [persons, setPersons] = useState([]);
  let nodeId = userCompanyId();

  useEffect(() => {
    nodeId = userCompanyId();
    getPersons();
    getGroupPersons();
  }, []);

  const getGroupPersons = () => {
    let guestsid = [];
    let guests = props.group.user.map((a) => {
      return a.id;
    });
    guestsid = guests;
    form.setFieldsValue({
      guests: guestsid,
    });
  };

  const getPersons = async () => {
    axios
      .post(API_URL + `/person/person/get_list_persons/`, { node: nodeId })
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

  const onFinish = (values) => {
    let data = {};
    data.user = values.guests;
    axios
      .patch(API_URL + `/intranet/group/${props.group.id}/`, data)
      .then((res) => {
        props.setVisible();
      })
      .catch((e) => {
        console.log("error", e);
        props.setVisible();
      });
  };

  return (
    <>
      <Layout>
        <Modal
          maskClosable={false}
          title={
            props.group.user.length > 0
              ? "Editar lista de personas del " + props.group.name
              : "Agregar personas al " + props.group.name
          }
          centered
          visible={props.visible}
          onCancel={() => props.setVisible()}
          footer={null}
          width={"50%"}
        >
          <Form onFinish={onFinish} form={form} layout={"vertical"}>
            <Row>
              <Col lg={24} xs={12}>
                <Form.Item
                  label="Personas"
                  name="guests"
                  rules={[
                    {
                      required: false,
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
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item labelAlign="right">
              <Space style={{ float: "right" }}>
                <Button onClick={() => props.setVisible()}>Cancelar</Button>
                <Button type="primary" htmlType="submit">
                  {props.group.user.length > 0 ? "Editar" : "Guardar"}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </>
  );
};
export default AddPeopleGroup;
