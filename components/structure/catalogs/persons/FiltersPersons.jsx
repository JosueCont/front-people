import React, { useMemo, useState } from 'react';
import MyModal from '../../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';

const FiltersPersons = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }


    const optionsBoolean = [
        { value: 'true', label: 'Sí', key: '1' },
        { value: 'false', label: 'No', key: '2' }
    ]

    return (
        <MyModal
            title='Configurar filtros'
            visible={visible}
            close={close}
            closable={!loading}
            widthModal={700}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
            >
                <Row gutter={[16, 0]}>
                    <Col span={12}>
                        <Form.Item
                            name='name__unaccent__icontains'
                            label='Nombre'
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='prefix__unaccent__icontains'
                            label='Prefijo'
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Prefijo'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_automatic'
                            label='¿Automático?'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsBoolean}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_collaborator'
                            label='¿Colaborador?'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsBoolean}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_assignable'
                            label='¿Asignable a personas?'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsBoolean}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_active'
                            label='Estatus'
                        >
                            <Select
                                placeholder='Seleccionar una opción'
                                options={[
                                    { label: 'Todos', value: 'all', key: '3' },
                                    { label: 'Activo', value: 'true', key: '1' },
                                    { label: 'Inactivo', value: 'false', key: '2' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24} className='content-end' style={{ gap: 8 }}>
                        <Button onClick={() => close()}>
                            Cancelar
                        </Button>
                        <Button
                            loading={loading}
                            htmlType='submit'
                        >
                            Aplicar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </MyModal>
    )
}

export default FiltersPersons