import React, { useState, useEffect } from 'react';
import {
    List,
    Empty,
    Avatar,
    Tooltip
} from 'antd';
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
    getPhoto,
    getDomain,
    downLoadFileBlob
} from '../../utils/functions';
import moment from 'moment';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import { useRouter } from 'next/router';

const WidgetAnniversary = ({
    intl
}) => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [anniversaries, setAnniversaries] = useState([]);

    const formatStart = 'YYYY-MM-DD';
    const formatEnd = 'DD/MM/YYYY';

    useEffect(() => {
        if (!current_node) return;
        getAnniversaries()
    }, [current_node])

    const getAnniversaries = async () => {
        try {
            setLoading(true)
            let params = '&widget_code=ANNIVERSARY_CURRENT_MONTH';
            let response = await WebApi.getDashboardDataWidget(current_node?.id, params)
            setLoading(false)
            setAnniversaries(response.data?.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setAnniversaries([])
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem pd='16px 0px'
                ai={anniversaries?.length > 0 ? 'flex-start' : 'center'}
                title={<>
                    <img src='/images/newyearparty.png' />
                    <p><FormattedMessage id={'dashboard.anniversary'} /></p>
                </>}
                extra={<>{anniversaries?.length ?? 0}</>}
            >
                {!loading ?
                    <CardScroll className="scroll-bar">
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={anniversaries}
                            locale={{ emptyText: Void }}
                            renderItem={(item, idx) => (
                                <List.Item key={idx}>
                                    <List.Item.Meta
                                        avatar={<Avatar size='large' src={getPhoto(item, '/images/profile-sq.jpg')} />}
                                        title={<a onClick={() => router.push(`/home/persons/${item.id}`)}>{getFullName(item)}</a>}
                                        description={`${intl.formatMessage({ id: 'aniversary' })}: 
                                            ${item.date_of_admission
                                                ? moment(item.date_of_admission, formatStart).format(formatEnd)
                                                : 'No disponible'
                                            }`
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    </CardScroll> : <LoadingOutlined className="card-load" spin />
                }
            </CardItem>
        </CardInfo>
    )
}

export default injectIntl(WidgetAnniversary)