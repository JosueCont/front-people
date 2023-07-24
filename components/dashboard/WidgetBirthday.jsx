import React, { useState, useEffect } from 'react';
import { List, Empty, Avatar } from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApi from '../../api/webApi';
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

const WidgetBirthday = ({
    redirectPerson = true
}) => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [birthdays, setBirthdays] = useState([]);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(()=>{
        if(!current_node) return;
        getBirthdays()
    },[current_node])

    const getBirthdays = async () =>{
        try {
            setLoading(true)
            let params = '&widget_code=BIRTHDAY_CURRENT_MONTH';
            let response = await WebApi.getDashboardDataWidget(current_node?.id, params)
            setLoading(false)
            setBirthdays(response.data?.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setBirthdays([])
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem pd='16px 0px'
                ai={birthdays?.length > 0 ? 'flex-start' : 'center'}
                title={<>
                    <img src='/images/ballon.png'/>
                    <p><FormattedMessage id={'dashboard.birthdaymonth'} /></p>
                </>}
                extra={<>{birthdays?.length ?? 0}</>}
            >
                {!loading ?
                    <CardScroll className="scroll-bar">
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={birthdays}
                            locale={{ emptyText: Void }}
                            renderItem={(item, idx) => (
                                <List.Item key={idx}>
                                    <List.Item.Meta
                                        avatar={<Avatar size='large' src={getPhoto(item, '/images/profile-sq.jpg')} />}
                                        title={redirectPerson
                                            ? <a onClick={() => router.push(`/home/persons/${item.id}`)}>{getFullName(item)}</a>
                                            : getFullName(item)}
                                        description={`Fecha de cumpleaños: 
                                            ${item.birth_date
                                                ? moment(item?.birth_date, formatStart).format(formatEnd)
                                                : 'No disponible'
                                            }
                                        `}
                                    />
                                </List.Item>
                            )}
                        />
                    </CardScroll>
                    : <LoadingOutlined tlined className="card-load" spin />
                }
            </CardItem>
        </CardInfo>
    )
}

export default WidgetBirthday