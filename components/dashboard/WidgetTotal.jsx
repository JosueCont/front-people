import React, { useState, useEffect } from 'react'
import { Typography } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import WebApi from '../../api/webApi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';

const WidgetTotal = () => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);

    useEffect(()=>{
        if(!current_node) return;
        getTotal()
    },[current_node])

    const getTotal = async () =>{
        try {
            setLoading(true)
            let params = '&widget_code=TOTAL_PEOPLE_IN_NODE';
            let response = await WebApi.getDashboardDataWidget(current_node?.id, params)
            setLoading(false)
            setTotal(response.data?.count)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setTotal(0)
        }
    }

    return (
        <CardItem hg='50%'
            title={<>
                <img src='/images/people.png' />
                <p><FormattedMessage id={'dashboard.totalpeople'} /></p>
            </>}
            extra={<a onClick={() => router.push(`/home/persons/`)}><FormattedMessage id={'view'} /></a>}
        >
            {!loading ?
                <Typography.Title
                    style={{ cursor: 'pointer', marginBottom: 0 }}
                    onClick={() => router.push(`/home/persons/`)}
                    level={1}
                >
                    {total}
                </Typography.Title>
                : <LoadingOutlined className="card-load" spin />
            }
        </CardItem>
    )
}

export default WidgetTotal