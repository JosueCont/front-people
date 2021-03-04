import React from 'react'
import { withAuthSync } from "../../libs/auth";
import { Form, Input, Row, Col, Typography } from 'antd'

const BankAccountsForm = (props) => {
    const { form } = Form.useForm();
    const { Title } = Typography;

    return (
        <>
            <Form.Item
                label="Colaborador"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Numero de cuenta"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Cuenta clabe"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Banco"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Mes"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Año"
                labelCol={{ span: 7 }}
                labelAlign={"left"}
            >
                <Input />
            </Form.Item>
        </>
    )
}

export default withAuthSync(BankAccountsForm);
