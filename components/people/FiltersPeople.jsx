import React, { useState } from 'react';
import MyModal from '../../common/MyModal';
import { Button, Input, Row, Col, Form, Select } from 'antd';
import { useSelector } from 'react-redux';
import { ruleWhiteSpace } from '../../utils/rules';
import { genders } from '../../utils/constant';
import { getFullName } from '../../utils/functions';

const FiltersPeople = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        load_persons,
        persons_company
    } = useSelector(state => state.userStore);
    const {
        cat_departments,
        cat_job
    } = useSelector(state => state.catalogStore)

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
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
                <Row gutter={[16,0]}>
                    <Col span={12}>
                        <Form.Item
                            name='first_name'
                            label='Nombre(s)'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Nombre(s)'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='flast_name'
                            label='Apellido(s)'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Apellido(s)'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='code'
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
                                {cat_departments.length > 0 && cat_departments.map(item=> (
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
                                {cat_job.length > 0 && cat_job.map(item=> (
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
                                    {value: 'true', label: 'Activos'},
                                    {value: 'false', label: 'Inactivos'}
                                ]}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='immediate_supervisor'
                            label='Jefe inmediato'
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
                    <Col span={24} className='content-end' style={{gap: 8}}>
                        <Button onClick={()=> close()}>
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