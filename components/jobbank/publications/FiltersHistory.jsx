import React, { useState, useEffect, useMemo } from 'react';
import MyModal from '../../../common/MyModal';
import { Button, Row, Col, Form, Select, DatePicker } from 'antd';
import { useSelector } from 'react-redux';;

const FiltersHistory = ({
    visible,
    close = () =>{},
    onFinish = ()=>{},
    formSearch
}) => {

    const {
        list_connections_options,
        load_connections_options,
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
                            name='account'
                            label='Cuenta'
                        >
                            <Select
                                allowClear
                                showSearch
                                disabled={load_connections_options}
                                loading={load_connections_options}
                                placeholder='Seleccionar una opción'
                                notFoundContent='No se encontraron resultados'
                                optionFilterProp='children'
                            >
                                {list_connections_options.length > 0 && list_connections_options.map(item=> (
                                    <Select.Option value={item.code} key={item.code}>
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item
                            name='dates'
                            label='Fecha'
                        >
                            <DatePicker.RangePicker
                                style={{width: '100%'}}
                                format='DD-MM-YYYY'
                                dropdownClassName='picker-range-jb'
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

export default FiltersHistory