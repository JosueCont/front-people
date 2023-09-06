import React, { useEffect, useState } from 'react'
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    ReloadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import {
    injectIntl,
    FormattedMessage
} from 'react-intl';
import { Avatar, List, Empty } from 'antd';
import WebApiPayroll from '../../api/WebApiPayroll';
import moment from 'moment';
import { useSelector } from 'react-redux';

const WidgetContracts = () => {

    const {
        user,
        current_node
    } = useSelector(state => state.userStore);

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (current_node) {
            getInfo()
        }

    }, [current_node])


    const getInfo = async () => {
        try {
            setLoading(true)
            const filters = `date_one=2023-09-01&date_two=2023-09-30&node_id=${current_node?.id}`
            let resp = await WebApiPayroll.getContractsInfo(filters)
            if (resp.status === 200) {
                setData(resp.data)
            }
            setLoading(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return (
        <CardInfo>
            <CardItem
                ai={data?.length > 0 ? 'flex-start' : 'center'}
                title={<p><FormattedMessage id={'dashboard.contracts'} /></p>}
                extra={data.length}
            >
                {
                    loading ?
                        <LoadingOutlined className="card-load" spin /> :
                        <CardScroll className="scroll-bar">
                            <List
                                dataSource={data}
                                size="small"
                                itemLayout="horizontal"
                                locale={{ emptyText: Void }}
                                renderItem={(item) => (
                                    <List.Item key={item.id}>
                                        <List.Item.Meta
                                            avatar={<Avatar /* src={item.picture.large} */ />}
                                            title={<a href="#">{item?.person?.first_name}</a>}
                                            description={`Fecha inicio: ${item.contract_start ? moment(item.contract_start).format("DD/MM/YYYY") : ""}`}
                                        />
                                        <div>
                                            <b>Vence:</b> <br />
                                            {item.contract_end ? moment(item.contract_end).format("DD/MM/YYYY") : ""}
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </CardScroll>
                }
            </CardItem>
        </CardInfo>
    )
}

export default WidgetContracts