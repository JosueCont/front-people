import React, {useState} from 'react'
import {Tabs, Tooltip, Typography, Form, Row, Col, Button, Table, Spin, Input} from 'antd';
import {GoldOutlined} from '@ant-design/icons';
import {userCompanyName} from '../../libs/auth';

const WorkTitle = ({ruleRequired, onFinishForm, ...props}) => {
    let nodePeople = userCompanyName();
    
    const {Title} = Typography;

    const [edit, setEdit] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        form.resetFields();
        setEdit(false);
    }

    const columns = [
    {
      title: "Empresa",
      render: (item) => {
        return <>{item.node.name}</>;
      },
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "key",
    },
    {
      title: "Departamento",
      dataIndex: "departament",
      key: "departament",
    },
    {
      title: "Puesto",
      key: "puesto",
    },
    {
      title: "Plaza a la que reporta",
      key: "place",
    },
    {
      title: "Nivel",
      key: "level",
    },
    {
      title: "Salario",
      key: "Salario",
    },
  ]

    return (
        <>
            {edit ? (
                <Title style={{ fontSize: "20px" }}>Editar</Title>
            ) : (
                <></>
            )}
                    
            <Form
                layout={"vertical"}
                form={form}
                onFinish={(values) =>
                onFinishForm(values, "/person/person-type/")
                }
            >
                <Row>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                        label="Empresa"
                        rules={[ruleRequired]}
                    >
                        <Input readOnly value={nodePeople} />
                    </Form.Item>
                </Col>
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
                    name="level"
                    label="Departamento"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="level"
                    label="Puesto"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="level"
                    label="Plaza a la que reporta"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="level"
                    label="Nivel"
                    rules={[ruleRequired]}
                    >
                    <Input />
                    </Form.Item>
                </Col>
                <Col lg={6} xs={22} offset={1}>
                    <Form.Item
                    name="level"
                    label="Salario"
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
    )
}

export default WorkTitle
