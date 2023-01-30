import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, InputNumber } from 'antd';
import { useSelector } from 'react-redux';
import { ruleWhiteSpace } from '../../../utils/rules';
import { optionsStatusAcademic, optionsLangVacant } from '../../../utils/constant';
import { validateNum, validateMaxLength } from '../../../utils/functions';
import RangeAge from '../RangeAge';

const FiltersPreselection = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_states,
        load_states,
        load_main_categories,
        list_main_categories,
        list_scholarship,
        load_scholarship
    } = useSelector(state => state.jobBankStore);
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
                            label='Correo electrónico'
                            name='email__unaccent__icontains'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input placeholder='Buscar por correo'/>
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
                                    <Select.Option value={item.id+""} key={item.id+""}>
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
                            rules={[ruleWhiteSpace]}
                        >
                             <Input
                                maxLength={200}
                                placeholder='Especifique el municipio'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='study_level'
                            label='Nivel de estudios'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_scholarship}
                                loading={load_scholarship}
                                placeholder='Selecionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_scholarship.length > 0 && list_scholarship.map(item => (
                                    <Select.Option value={item.id+""} key={item.id+""}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name='status_level_study'
                            label='Estatus académico'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusAcademic}
                            />
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
                            label='Edad'
                            name='age'
                        >
                            <InputNumber
                                type='number'
                                max={99}
                                min={1}
                                allowClear
                                maxLength={2}
                                controls={false}
                                placeholder='Buscar por edad'
                                onKeyDown={validateNum}
                                onKeyPress={validateMaxLength}
                                style={{
                                    width: '100%',
                                    border: '1px solid black'
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label='Idioma'
                            name='language'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsLangVacant}
                            />
                        </Form.Item>
                    </Col>
                    <RangeAge
                        minAgeKey='age_start'
                        maxAgeKey='age_end'
                        maxAgeRequired={false}
                        minAgeRequired={false}
                        sizeCol={{span: 12}}
                    />
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

export default FiltersPreselection