import React, { useState } from "react";
import {
  Tabs,
  Typography,
  Form,
  Row,
  Col,
  Button,
  Table,
  Spin,
  Input,
} from "antd";
import { ruleRequired } from "../../utils/rules";
import { connect } from "react-redux";

const Banks = ({ permissions, onFinishForm, ...props }) => {
  const { Title } = Typography;
  const { TabPane } = Tabs;

  const [edit, setEdit] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    form.resetFields();
    setEdit(false);
  };

  const colBank = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Código",
      dataIndex: "code",
    },
    {
      title: "Acciones",
      render: (item) => {
        return (
          <div>
            <Row gutter={16}>
              {permissions.edit && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "bank")} />
                </Col>
              )}
              {permissions.delete && (
                <Col className="gutter-row" offset={1}>
                  <DeleteOutlined
                    onClick={() => {
                      setDeleteRegister({
                        id: item.id,
                        url: "/setup/banks/",
                      });
                    }}
                  />
                </Col>
              )}
            </Row>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {edit && <Title style={{ fontSize: "20px" }}>Editar</Title>}
      {permissions.create && (
        <Form
          layout={"vertical"}
          form={form}
          onFinish={(values) => onFinishForm(values, "/setup/banks/")}
        >
          <Row>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="name" label="Nombre" rules={[ruleRequired]}>
                <Input />
              </Form.Item>
            </Col>
            <Col lg={6} xs={22} offset={1}>
              <Form.Item name="code" label="Código" rules={[ruleRequired]}>
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
      )}
      <Spin tip="Cargando..." spinning={loading}>
        <Table
          columns={colBank}
          dataSource={props.cat_bank}
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

const mapState = (state) => {
  return {
    cat_bank: state.catalogStore.cat_bank,
  };
};

export default connect(mapState)(Banks);
