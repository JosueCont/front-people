import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../../common/MyModal';
import { Button, Input, Row, Col, Form, Select, DatePicker } from 'antd';
import { ruleWhiteSpace } from '../../../../utils/rules';
import { optionsStatusApply } from '../../../../utils/constant';

const FiltersAssign = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const [loading, setLoading] = useState(false);

    const onFinishSearch = (values) =>{
        if(values.date_finish) values.date_finish = values.date_finish.format('DD-MM-YYYY');
        setLoading(true)
        setTimeout(()=>{
            setLoading(false)
            onFinish(values);
            close()
        },1000)
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
                <Row gutter={[16,0]}>
                    <Col span={24}>
                        <Form.Item
                            label='Nombre'
                            name='name_assessment'
                            rules={[ruleWhiteSpace]}
                        >
                            <Input
                                allowClear
                                className='input-with-clear'
                                placeholder='Buscar por nombre'
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Estatus'
                            name='status_apply'
                        >
                            <Select
                                allowClear
                                placeholder='Seleccionar una opción'
                                options={optionsStatusApply}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            label='Fecha fin'
                            name='date_finish'
                        >
                            <DatePicker
                                style={{width: '100%'}}
                                placeholder='Seleccionar una fecha'
                                format='DD-MM-YYYY'
                                inputReadOnly
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

export default FiltersAssign