import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';
import { getFullName } from '../../../utils/functions';
import { optionsStatusPermits } from '../../../utils/constant';

const FiltersIncapacity = ({
    visible,
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {

    const {
        persons_company,
        load_persons
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
            widthModal={500}
        >
            <Form
                onFinish={onFinishSearch}
                form={formSearch}
                layout='vertical'
            >
                <Row>
                    <Col span={24}>
                        <Form.Item
                            name='person__id'
                            label='Colaborador'
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
                                {persons_company.length > 0 && persons_company.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {getFullName(item)}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Estatus'
                            name='status'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusPermits}
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

export default FiltersIncapacity