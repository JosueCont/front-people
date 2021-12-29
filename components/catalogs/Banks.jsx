import React, {useState} from 'react'
import {Tabs, Tooltip, Typography, Form, Row, Col, Button, Table, Spin, Input} from 'antd';
import {userCompanyName} from '../../libs/auth';

const Banks = ({permissions, ruleRequired, onFinishForm, ...props}) => {

    let nodePeople = userCompanyName();
    const {Title} = Typography
    const { TabPane } = Tabs;

    const [edit, setEdit] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        form.resetFields();
        setEdit(false);
    }

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
              {permissions.edit_bank && (
                <Col className="gutter-row" offset={1}>
                  <EditOutlined onClick={() => editRegister(item, "bank")} />
                </Col>
              )}
              {permissions.delete_bank && (
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
            {edit && (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
            )}
            {permissions.create_bank && (
            <Form
                layout={"vertical"}
                form={form}
                onFinish={(values) =>
                onFinishForm(values, "/setup/banks/")
                }
            >
                <Row>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="name"
                    label="Nombre"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="code"
                    label="Código"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                </Row>
                <Row
                justify={"end"}
                gutter={20}
                style={{ marginBottom: 20 }}
                >
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
    )
}

export default Banks
