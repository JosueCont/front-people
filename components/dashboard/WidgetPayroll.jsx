import React, { useState, useEffect } from 'react';
import {
    List,
    Empty,
    Avatar,
    Tooltip,
    Col,
    Row
} from 'antd';
import {
    CardInfo,
    CardItem,
    CardScroll
} from './Styled';
import {
    LinkOutlined,
    FileTextOutlined,
    ReloadOutlined,
    FilePdfOutlined,
    EyeOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import WebApiPayroll from '../../api/WebApiPayroll';
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
import _ from 'lodash';
import { API_URL_TENANT } from '../../config/config';

const WidgetPayroll = () => {

    const {
        user,
        current_node,
        applications
    } = useSelector(state => state.userStore);

    const [loading, setLoading] = useState(false);
    const [payrolls, setPayrolls] = useState([]);

    useEffect(()=>{
        if(!current_node) return;
        let exist = applications?.payroll?.active;
        if(!exist) return;
        getCfdiPayrrol()
    },[current_node])

    const getCfdiPayrrol = async () => {
        try {
            setLoading(true)
            let response = await WebApiPayroll.getCfdiPayrrol(`node=${current_node?.id}&person=${user?.id}`)
            setPayrolls(response?.data?.results)
            setLoading(false)
        } catch (e) {
            setPayrolls([])
            setLoading(false)
        }
    }

    const downLoadFile = (item, file) => {
        let data = {
            type_request: 3,
            type_file: file,
            id_facturama: item.id_facturama,
        };
        let url = `${getDomain(
            API_URL_TENANT
        )}/payroll/cfdi_multi_emitter_facturama/cfdi_multi_emitter/`;

        downLoadFileBlob(
            url,
            `${item.payroll_person.person.rfc}_${item.payment_period.start_date}_${item.payment_period.end_date
            }.${file == 1 ? "xml" : "pdf"}`,
            "POST",
            data
        );
    }

    const Void = (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={'nodata'} />} />
    )

    return applications?.payroll?.active ? (
        <Col md={8} xs={24} lg={12}>
        <CardInfo>
            <CardItem jc='center' hg='100%' pd='16px 0px'
                ai={payrolls?.length > 0 ? 'flex-start' : 'center'}
                title={<>
                    <img src='/images/voucher.png' />
                    <p>Mis recibos de nómina</p>
                </>}
                extra={<>{payrolls?.length ?? 0}</>}
            >
                {!loading ?
                    <CardScroll className="scroll-bar">
                        <List
                            size="small"
                            itemLayout="horizontal"
                            dataSource={payrolls}
                            locale={{ emptyText: Void }}
                            renderItem={(item, idx) => (
                                <List.Item
                                    key={idx}
                                    actions={[
                                        <>
                                            {item.id_facturama ? (
                                                <Tooltip title="XML">
                                                    <FileTextOutlined
                                                        onClick={() => downLoadFile(item, 1)}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                item.xml_file && (
                                                    <Tooltip title="XML">
                                                        <a href={item.xml_file} target="_blank" download>
                                                            <FileTextOutlined />
                                                        </a>
                                                    </Tooltip>
                                                )
                                            )}
                                        </>,
                                        <>
                                            {item.id_facturama ? (
                                                <Tooltip title="PDF">
                                                    <FilePdfOutlined
                                                        onClick={() => downLoadFile(item, 2)}
                                                    />
                                                </Tooltip>
                                            ) : (
                                                item.pdf_file && (
                                                    <Tooltip title="PDF">
                                                        <a href={item.pdf_file} target="_blank" download>
                                                            <FilePdfOutlined />
                                                        </a>
                                                    </Tooltip>
                                                )
                                            )}
                                        </>
                                    ]}
                                >
                                    <List.Item.Meta
                                        // avatar={<Avatar size='large' src={getPhoto(item?.payroll_person?.person, '/images/profile-sq.jpg')} />}
                                        title={<>Fecha de pago: {item?.pay_date ? item?.pay_date : 'No disponible'}</>}
                                    />
                                </List.Item>
                            )}
                        />
                    </CardScroll>
                    : <LoadingOutlined className="card-load" spin />
                }
            </CardItem>
        </CardInfo>
        </Col>
    ) : <></>;
}

export default WidgetPayroll