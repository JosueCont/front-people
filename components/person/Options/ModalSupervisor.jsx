import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import MyModal from '../../../common/MyModal';
import {
    Form,
    Row,
    Col,
    Select,
    Button,
    Space
} from 'antd';
import { ruleRequired } from '../../../utils/rules';
import { getFullName } from '../../../utils/functions';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const ModalSupervisor = ({
    visible = false,
    close = () => { },
    actionForm = async () => { },
    itemsSelected = [],
    typeAssign = 1
}) => {

    const [formAssign] = Form.useForm();
    const [loading, setLoading] = useState(false);


    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);

    const onFinish = (values) => {
        setLoading(true)
        setTimeout(async () => {
            let resp = await actionForm(values)
            if (resp && resp != 'ERROR') formAssign.setFields([{ name: 'immediate_supervisor', errors: [resp] }]);
            else if (!resp) onClose();
            setLoading(false)
        }, 2000)
    }

    const onClose = () => {
        close()
        formAssign.resetFields()
    }

    const disabledSubmit = useMemo(()=>{
        if(typeAssign == 1) return false;
        const some_ = item => item.immediate_supervisor;
        return !itemsSelected?.some(some_);
    },[itemsSelected, typeAssign])

    const list_to_select = useMemo(() => {
        if (typeAssign == 1) return persons_company;
        if (itemsSelected?.length <= 0) return persons_company;
        if (itemsSelected?.length > 1) return persons_company;
        let ids = itemsSelected.map(item => item?.immediate_supervisor?.id);
        return persons_company.filter(item => !ids.includes(item.id));
    }, [itemsSelected, persons_company, typeAssign])

    return (
        <MyModal
            title={typeAssign == 1
                ? 'Asignar jefe inmediato'
                : 'Asignar suplente de jefe inmediato'
            }
            visible={visible}
            close={onClose}
            widthModal={450}
            closable={!loading}
        >
            <Form
                form={formAssign}
                onFinish={onFinish}
                layout='vertical'
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='immediate_supervisor'
                            label={typeAssign == 1
                                ? 'Jefe inmediato'
                                : 'Suplete de jefe inmediato'
                            }
                            rules={[ruleRequired]}
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_persons}
                                loading={load_persons}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_to_select.length > 0 && list_to_select.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getFullName(item)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {itemsSelected?.length > 0 && (
                        <Col span={24} style={{ marginBottom: 24 }}>
                            <Space direction='vertical' style={{ width: '100%' }}>
                                <p style={{ marginBottom: 0, fontWeight: 500 }}>
                                    {itemsSelected?.length > 1
                                        ? 'Colaboradores a asignar'
                                        : 'Colaborador a asignar'
                                    }
                                </p>
                                <div className='items-selected scroll-bar'>
                                    {itemsSelected.length > 0 && itemsSelected.map((item, idx) => (
                                        <div key={idx}>
                                            <p>
                                                {getFullName(item)}
                                            </p>
                                            {!item.immediate_supervisor && typeAssign == 2 && (
                                                <ExclamationCircleOutlined style={{
                                                    color: 'red'
                                                }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                {itemsSelected?.some(item => !item.immediate_supervisor)
                                    && typeAssign == 2 && (
                                        <div style={{
                                            border: '1px solid #ddd',
                                            backgroundColor: '#ffff',
                                            padding: '4px 8px',
                                            borderRadius: 10
                                        }}>
                                            <ExclamationCircleOutlined style={{ color: 'red', marginRight: 8 }} />
                                            No se asignará el suplente a personas sin un jefe inmediato
                                        </div>
                                    )}
                            </Space>
                        </Col>
                    )}
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button disabled={loading} onClick={() => onClose()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                            disabled={disabledSubmit}
                        >
                            Asignar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default ModalSupervisor