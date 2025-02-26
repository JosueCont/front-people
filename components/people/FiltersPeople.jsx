import React, { useMemo, useState } from 'react';
import MyModal from '../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { ruleWhiteSpace } from '../../utils/rules';
import { genders } from '../../utils/constant';
import SelectPeople from './utils/SelectPeople';

const FiltersPeople = ({
    visible,
    listData = {},
    close = () => { },
    onFinish = () => { },
    formSearch
}) => {
    
    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) => {
        setLoading(true)
        setTimeout(() => {
            close()
            setLoading(false)
            onFinish(values);
        }, 1000)
    }

    const itemSupervisor = useMemo(() => {
        if (!visible) return [];
        let supervisor = listData?.supervisor || {};
        if (Object.keys(supervisor).length <= 0) return [];
        return [supervisor];
    }, [listData?.supervisor, visible])

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
                            name='first_name__icontains'
                            label='Nombre'
                            rules={[ruleWhiteSpace]}
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
                            name='flast_name__icontains'
                            label='Apellido paterno'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Apellido paterno'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='mlast_name__icontains'
                            label='Apellido materno'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Apellido materno'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='code__icontains'
                            label='No. empleado'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='No. empleado'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='gender'
                            label='Género'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={genders}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='department'
                            label='Departamento'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_departments.length > 0 && cat_departments.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='job'
                            label='Puesto'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {cat_job.length > 0 && cat_job.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='is_active'
                            label='Estatus'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={[
                                    { value: 'true', label: 'Activo' },
                                    { value: 'false', label: 'Inactivo' }
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <SelectPeople
                            name='immediate_supervisor'
                            label='Jefe inmediato'
                            itemSelected={itemSupervisor}
                        />
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

export default FiltersPeople