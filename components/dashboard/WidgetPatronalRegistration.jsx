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
    AuditOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApiPeople from '../../api/WebApiPeople';
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

const WidgetPatronalRegistration = ({
    redirectPerson = true
}) => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (!current_node) return;
        getPatronalRegistration()
    }, [current_node])

    const getPatronalRegistration = async () => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getPatronalRegistrationData(current_node?.id)
            setLoading(false)
            setItems(response.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setItems([])
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem pd='16px 0px'
                ai={items?.length > 0 ? 'flex-start' : 'center'}
                title={<>
                    <AuditOutlined />
                    <p><FormattedMessage id={'dashboard.patronalreg'} /></p>
                </>}
                extra={<a onClick={() => router.push('/business/patronalRegistrationNode')}>{items ? items.length : 0}</a>}
            >
                {!loading ?
                    <CardScroll className="scroll-bar">
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={items}
                            locale={{ emptyText: Void }}
                            renderItem={(item, idx) => (
                                <List.Item key={idx}>
                                    <List.Item.Meta
                                        //avatar={<Avatar size='large' src={getPhoto(item, '/images/profile-sq.jpg')} />}
                                        title={<a onClick={() => router.push(`/business/patronalRegistrationNode`)}>{item.code}</a>}
                                        description={`Razón social: 
                                            ${item?.social_reason}
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

export default WidgetPatronalRegistration