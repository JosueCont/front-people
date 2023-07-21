import React, { useState } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { ruleWhiteSpace } from '../../../utils/rules';
import { useSelector } from 'react-redux';

const FiltersCenters = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        list_companies,
        load_companies
    } = useSelector(state => state.userStore);
    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

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
                            label='Nombre'
                            name='name__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                maxLength={150}
                                placeholder='Nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Dirección'
                            name='address__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                maxLength={250}
                                placeholder='Dirección'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='is_active'
                        >
                            <Select
                                allowClear
                                placeholder='Selecciona una opción'
                                notFoundContent='No se encontraron resultados'
                            >
                                <Select.Option value='true' key='true'>Activo</Select.Option>
                                <Select.Option value='false' key='false'>Inactivo</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Empresa'
                            name='node'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_companies}
                                loading={load_companies}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_companies?.length > 0
                                    && list_companies?.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
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

export default FiltersCenters