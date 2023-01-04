import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, Checkbox } from 'antd';
import { useSelector } from 'react-redux';
import { onlyNumeric, ruleWhiteSpace } from '../../../utils/rules';

const ModalFilters = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        load_main_categories,
        list_main_categories,
        list_states,
        load_states,
        list_sectors,
        load_sectors,
        load_sub_categories,
        list_sub_categories
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);
    const category = Form.useWatch('main_category', formSearch);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
    }

    const optionsByCategory = useMemo(()=>{
        if(!category) return [];
        const options = item => item.category === category;
        return list_sub_categories.filter(options);
    },[category])

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
                initialValues={{is_other: false}}
            >
                <Row gutter={[16,0]}>
                    <Col span={12}>
                        <Form.Item
                            label='Nombre'
                            name='fisrt_name__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Apellidos'
                            name='last_name__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por apellidos'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Correo'
                            name='email__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por correo'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Teléfono'
                            name='cell_phone'
                            rules={[onlyNumeric]}
                        >
                            <Input placeholder='Buscar por teléfono'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Estatus'
                            name='is_active'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                            >
                                <Select.Option value='true' key='true'>Activo</Select.Option>
                                <Select.Option value='false' key='false'>Inactivo</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Puesto'
                            name='last_job'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Buscar por puesto'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='sector'
                            label='Sector'
                        >
                            <Select
                                disabled={load_sectors}
                                loading={load_sectors}
                                placeholder='Seleccionar un opción'
                                notFoundContent='No se encontraron resultados'
                            >
                                {list_sectors.length > 0 && list_sectors.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Categoría'
                            name='main_category'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_main_categories}
                                loading={load_main_categories}
                                optionFilterProp='children'
                            >
                                {list_main_categories?.length > 0 && list_main_categories.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='sub_category'
                            label='Subcategoría'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una subcategoría'
                                notFoundContent='No se encontraron resultados'
                                disabled={optionsByCategory.length <= 0}
                                loading={load_sub_categories}
                                optionFilterProp='children'
                            >
                                {optionsByCategory.map(item=> (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='state'
                            label='Estado'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={load_states}
                                loading={load_states}
                                optionFilterProp='children'
                            >
                                {list_states?.length > 0 && list_states.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Municipio'
                            name='municipality__unaccent__icontains'
                        >
                             <Input
                                maxLength={200}
                                placeholder='Especifique el municipio'
                            />
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

export default ModalFilters