import React, { useState, useEffect, useMemo } from "react";
import {
    Form,
    Button,
    Row,
    Col,
    Space,
    Table,
    Input,
    Typography
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import MyModal from "../../../common/MyModal";
import { ruleRequired } from "../../../utils/rules";
import { getFullName } from "../../../utils/functions";
import SelectPeople from "../../people/utils/SelectPeople";

const PersonsGroup = ({
    title = '',
    visible = false,
    close = () => { },
    actionForm = () => { },
    itemToEdit = {}
}) => {

    const [formGroup] = Form.useForm();
    const [membersTable, setMembersTable] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    useEffect(() => {
        if (Object.keys(itemToEdit)?.length <= 0) return;
        formGroup.setFieldsValue({ name: itemToEdit?.name });
        setMembersTable(itemToEdit?.persons)
    }, [itemToEdit])

    const orderElements = (array) => {
        const order = (x, y) => {
            return x.first_name.localeCompare(y.first_name);
        }
        let ordered = array.sort(order);
        return ordered;
    }

    const onFinish = (values) => {
        setShowError(false)
        if (membersTable?.length < 1) {
            setShowError(true);
            return;
        }
        let persons = membersTable.map(item => item.id);
        let body = { name: values.name, persons };
        setLoading(true)
        setTimeout(() => {
            actionForm(body)
            setLoading(false)
            onClose()
        }, 2000)
    }

    const onClose = () => {
        close()
        setMembersTable([])
        setShowError(false)
        formGroup.resetFields()
    }

    const onChangePerson = (value, list) => {
        let result = list.find(item => item.id == value);
        let newList = [...membersTable, result];
        setMembersTable(newList)
        formGroup.setFieldsValue({ person: null })
    }

    const deleteItem = (index) => {
        let newList = [...membersTable];
        newList.splice(index, 1);
        setMembersTable(newList)
    }

    const watchCallback = (options) =>{
        if(membersTable?.length <=0) return options;
        let ids = membersTable.map(item => item.id);
        return options.filter(item => !ids.includes(item.id));
    }

    const colums = [
        {
            title: "Nombre",
            render: (item) => getFullName(item),
        },
        {
            title: "Acciones",
            width: 50,
            render: (item, record, index) => (
                <DeleteOutlined
                    onClick={() => deleteItem(index)}
                />
            ),
        }
    ]

    return (
        <MyModal
            title={title}
            visible={visible}
            close={onClose}
            closable={!loading}
        >
            <Form
                onFinish={onFinish}
                form={formGroup}
                layout='vertical'
            >
                <Row gutter={[24, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name'
                            label='Nombre del grupo'
                            rules={[ruleRequired]}
                        >
                            <Input
                                allowClear
                                maxLength={50}
                                placeholder="Ingresa un nombre"
                                style={{ border: '1px solid black' }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <SelectPeople
                            name='person'
                            label='Seleccionar una persona'
                            onChangeSelect={onChangePerson}
                            watchParam={membersTable}
                            watchCallback={watchCallback}
                        />
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            required
                            label={`Personas seleccionadas (${membersTable?.length})`}
                            style={{ marginBottom: showError ? 8 : 24 }}
                        >
                            <Table
                                rowKey='id'
                                columns={colums}
                                showHeader={false}
                                dataSource={membersTable}
                                size='small'
                                locale={{ emptyText: "No se encontraron resultados" }}
                                scroll={{ y: 200 }}
                                pagination={false}
                            />
                        </Form.Item>
                        {showError && (
                            <Typography.Text type='danger'>
                                Selecciona al menos dos colaboradores
                            </Typography.Text>
                        )}
                    </Col>
                </Row>
                <Row align='end'>
                    <Space>
                        <Button disabled={loading} onClick={() => close()}>
                            Cancelar
                        </Button>
                        <Button
                            htmlType="submit"
                            loading={loading}
                        >
                            Guardar
                        </Button>
                    </Space>
                </Row>
            </Form>
        </MyModal>
    )
}

export default PersonsGroup