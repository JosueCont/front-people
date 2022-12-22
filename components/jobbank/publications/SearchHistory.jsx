import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { DatePicker, Form, Row, Col, Button, Select} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import moment from 'moment';
import { accounstJobbank } from '../../../utils/constant';

const SearchHistory = ({
    infoPublication = {},
    newFilters = {}
}) => {

    const router = useRouter();
    const [formSearch] = Form.useForm();
    const url = router?.asPath?.split('?')[0];
    const formatDate = 'DD-MM-YYYY';

    useEffect(()=>{
        let filters = {...router.query};
        if(filters.start && filters.end){
            filters.dates = [
                moment(filters.start, formatDate),
                moment(filters.end, formatDate)
            ]
        }
        formSearch.setFieldsValue(filters);  
    },[router])

    const onFinish = (values) =>{
        let filters = {...newFilters};
        if(values.dates){
            filters['start'] = values.dates[0].format(formatDate);
            filters['end'] = values.dates[1].format(formatDate);
        }
        if(values.account) filters['account'] = values.account;
        router.replace({
            pathname: url,
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace({
            pathname: url,
            query: newFilters
        }, undefined, {shallow: true});
    }

    const actionBack = () =>{
        router.push({
            pathname: '/jobbank/publications',
            query: newFilters
        })
    }

    return (
        <Form
            layout='inline'
            onFinish={onFinish}
            form={formSearch}
            style={{width: '100%'}}
        >
            <Row align='middle' style={{width: '100%'}}>
                <Col span={8} style={{display: 'flex'}}>
                    <div className='title-history'>
                        <p>{infoPublication?.vacant?.job_position}</p>
                        <p>&nbsp;/&nbsp;{infoPublication?.profile?.name ?? 'Personalizado'}</p>
                    </div>
                </Col>
                <Col span={16} className='content-end' style={{gap: 8}}>
                    <Form.Item name='account' style={{margin:0}}>
                        <Select
                            allowClear
                            showSearch
                            placeholder='Cuenta'
                            notFoundContent='No se encontraron resultados'
                            optionFilterProp='label'
                            options={accounstJobbank}
                            style={{width: '110px'}}
                        />
                    </Form.Item>
                    <Form.Item name='dates' style={{margin:0}}>
                        <DatePicker.RangePicker
                            style={{width: '100%'}}
                            placeholder={['Fecha inicio','Fecha final']}
                            format='DD-MM-YYYY'
                        />
                    </Form.Item>
                    <div span={6} style={{display: 'flex', gap: 8}}>
                        <Button htmlType='submit'>
                            <SearchOutlined />
                        </Button>
                        <Button onClick={()=> deleteFilter()}>
                            <SyncOutlined />
                        </Button>
                        <Button
                            onClick={()=> actionBack()}
                            icon={<ArrowLeftOutlined />}
                        >
                            Regresar
                        </Button>
                    </div>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchHistory