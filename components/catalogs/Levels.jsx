import React, { useState } from "react";
import {
  Tabs,
  Tooltip,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
} from "antd";
import { GoldOutlined } from "@ant-design/icons";
import { userCompanyName } from "../../libs/auth";
import { ruleRequired } from "../../utils/rules";

const Levels = ({ onFinishForm, ...props }) => {
  let nodePeople = userCompanyName();

  const { TabPane } = Tabs;
  const { Title } = Typography;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
  };

  const columns = [
    {
      title: "Empresa",
      render: (item) => {
        return <>{""}</>;
      },
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Nivel que precede",
      dataIndex: "level",
      key: "level",
    },
  ];

  return (
    <>
      {edit ? <Title style={{ fontSize: "20px" }}>Editar</Title> : <></>}

      <Form
        layout={"vertical"}
        form={form}
        onFinish={(values) => onFinishForm(values, "/person/person-type/")}
      >
        <Row>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item label="Empresa" rules={[ruleRequired]}>
              <Input readOnly value={nodePeople} />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
              <Input />
            </Form.Item>
          </Col>
          <Col lg={6} xs={22} offset={1}>
            <Form.Item
              name="level"
              label="Nivel del que procede"
              rules={[ruleRequired]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row justify={"end"} gutter={20} style={{ marginBottom: 20 }}>
          <Col>
            <Button onClick={resetForm}>Cancelar</Button>
          </Col>
          <Col>
            <Button type="primary" htmlType="submit">
              Guardar
            </Button>
          </Col>
        </Row>
      </Form>
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={columns}
          dataSource={[]}
          locale={{
            emptyText: loading
              ? "Cargando..."
              : "No se encontraron resultados.",
          }}
        />
      </Spin>
    </>
  );
};

export default Levels;
