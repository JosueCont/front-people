import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { DatePicker, Form, Row, Col, Button} from 'antd';
import {
    SearchOutlined,
    SyncOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const SearchHistory = ({
    infoPublication = {}
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
        let filters = {};
        if(values.dates){
            filters['start'] = values.dates[0].format(formatDate);
            filters['end'] = values.dates[1].format(formatDate);
        }
        router.replace({
            pathname: url,
            query: filters
        }, undefined, {shallow: true});
    }

    const deleteFilter = () =>{
        formSearch.resetFields();
        router.replace(url, undefined, {shallow: true});
    }

    return (
        <Form
            layout='inline'
            onFinish={onFinish}
            form={formSearch}
            style={{width: '100%'}}
        >
            <Row align='middle' style={{width: '100%'}}>
                <Col span={12} style={{display: 'flex'}}>
                    <div className='title-history'>
                        <p>{infoPublication?.vacant?.job_position}</p>
                        <p>&nbsp;/&nbsp;{infoPublication?.profile?.name}</p>
                    </div>
                </Col>
                <Col span={12} className='content-end' style={{gap: 8}}>
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
                    </div>
                </Col>
            </Row>
        </Form>
    )
}

export default SearchHistory