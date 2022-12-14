import React, { useState, useEffect } from 'react';
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
        load_specialization_area,
        list_specialization_area
    } = useSelector(state => state.jobBankStore);
    const [loading, setLoading] = useState(false);
    const isOther = Form.useWatch('is_other', formSearch);

    const onFinishSearch = (values) =>{
        setLoading(true)
        setTimeout(()=>{
            close()
            setLoading(false)
            onFinish(values);
        },1000)
    }

    const setValue = (key, val) => formSearch.setFieldsValue({[key]: val});
    const setArea = (val = null) => setValue('area', val);
    const setOther = (val = null) => setValue('other_area', val);

    const onChangeOther = ({target : { checked }}) =>{
        if(checked) setArea();
        else setOther();
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
                initialValues={{is_other: false}}
            >
                <Row gutter={[16,0]}>
                    <Col span={12}>
                        <Form.Item
                            label='Nombre'
                            name='fisrt_name__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por nombre'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Apellidos'
                            name='last_name__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por apellidos'/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Correo'
                            name='email__icontains'
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
                            label='Puesto'
                            name='job'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input maxLength={200} placeholder='Buscar por puesto'/>
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
                            label='Área de especialización'
                            name='area'
                        >
                            <Select
                                allowClear
                                showSearch
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                disabled={isOther}
                                loading={load_specialization_area}
                                optionFilterProp='children'
                            >
                                {list_specialization_area?.length > 0 && list_specialization_area.map(item => (
                                    <Select.Option value={item.id} key={item.id}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12} className='turn_rotative_content'>
                        <div className='turn_rotative'>
                            <label>
                                ¿Otra área de especialización?
                            </label>
                            <Form.Item
                                name='is_other'
                                valuePropName='checked'
                                style={{marginBottom: 0}}
                            >
                                <Checkbox onChange={onChangeOther}/>
                            </Form.Item>
                        </div>
                        <Form.Item name='other_area'>
                             <Input
                                disabled={!isOther}
                                maxLength={200}
                                placeholder='Especifique la especialización'
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