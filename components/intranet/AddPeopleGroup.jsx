import { Button, Col, Form, Layout, Modal, Row, Select, Space } from "antd";
import axios from "axios";
import { API_URL } from "../../config/config";
import React, { useEffect, useState } from "react";
import SelectCollaborator from "../selects/SelectCollaborator";
import WebApiIntranet from "../../api/WebApiIntranet";
import { connect } from "react-redux";

const { Option } = Select;
const AddPeopleGroup = ({ ...props }) => {
  const [form] = Form.useForm();
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    if (props.currentNode) {
      getPersons();
      getGroupPersons();
    }
  }, [props.currentNode]);

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

  const onFinish = async (values) => {
    let data = {};
    data.user = values.guests;
    await WebApiIntranet.updGroup(props.group.id, data)
      .then((res) => {
        props.setVisible();
      })
      .catch((e) => {
        console.log(e);
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
              ? "Editar lista de personas de" + props.group.name
              : "Agregar personas a " + props.group.name
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
                <SelectCollaborator
                  label="Personas"
                  name="guests"
                  mode="multiple"
                  showSearch
                />
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

const mapState = (state) => {
  return { currentNode: state.userStore.current_node };
};

export default connect(mapState)(AddPeopleGroup);
