import React, { useState, useEffect } from 'react';
import { List, Empty, Avatar } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
    LoadingOutlined,
    LinkOutlined,
    CalendarOutlined,
    ContactsOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApiPayroll from '../../api/WebApiPayroll';
import {
    getFullName,
    getPhoto
} from '../../utils/functions';
import moment from 'moment';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import { useRouter } from 'next/router';

const WidgetPayRollCalendar = ({
    redirectPerson = true
}) => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [calendars, setCalendars] = useState([]);
    const [totalCalendars, setTotalCalendars] = useState(null);
    const [hasNext, setHasNext] = useState(false);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (!current_node) return;
        getPayrollCalendar()
    }, [current_node])

    const getPayrollCalendar = async () => {
        try {
            setLoading(true)
            let response = await WebApiPayroll.getPaymentCalendar(current_node?.id)
            setLoading(false)
            setCalendars(response.data?.results)
            setTotalCalendars(response.data?.count)
            setHasNext(response.data?.next ? true : false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setCalendars([])
            setHasNext(false)
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem pd='16px 0px'
                ai={calendars?.length > 0 ? 'flex-start' : 'center'}
                title={<>
                    <ContactsOutlined />
                    <p><FormattedMessage id={'dashboard.payrollcalendar'} /></p>
                </>}
                extra={<a onClick={() => router.push('/payroll/paymentCalendar')}>{totalCalendars ?? 0}</a>}
            >
                {!loading ?
                    <CardScroll className="scroll-bar">
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={calendars}
                            locale={{ emptyText: Void }}
                            renderItem={(item, idx) => (
                                <List.Item key={idx}>
                                    <List.Item.Meta
                                        //avatar={<Avatar size='large' src={getPhoto(item, '/images/profile-sq.jpg')} />}
                                        title={<a onClick={() => router.push(`/payroll/paymentCalendar/${item.id}/edit?calendar_id=${item.id}&id=${current_node?.id}`)}>{item.name}</a>}
                                        description={`Periodicidad: 
                                            ${item?.periodicity?.description}
                                        `}
                                    />
                                </List.Item>
                            )}
                        />
                        <p style={{ textAlign: 'center' }}>
                            {
                                hasNext && <a onClick={() => router.push('/payroll/paymentCalendar')}> <LinkOutlined /> Ver todos</a>
                            }
                        </p>


                    </CardScroll>
                    : <LoadingOutlined tlined className="card-load" spin />
                }

            </CardItem>
        </CardInfo>
    )
}

export default WidgetPayRollCalendar