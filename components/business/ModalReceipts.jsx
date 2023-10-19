import React, { useMemo, useState } from 'react';
import MyModal from '../../common/MyModal';
import { Button, Col, Input, Row, Space, Table, Tag } from 'antd';
import { DownloadOutlined, FileTextOutlined, LoadingOutlined, UserOutlined } from '@ant-design/icons';
import { monthsName } from '../../utils/constant';
import { getValueFilter } from '../../utils/functions';
import WebApiPeople from '../../api/WebApiPeople';
import { downloadBLOB } from '../../utils/functions';

const ModalReceipts = ({
    iconNomi,
    visible = false,
    close = () => { },
    receipts = [],
    itemNode = {},
}) => {

    const [loading, setLoading] = useState({});

    const getNameMonth = (item) => getValueFilter({
        list: monthsName,
        value: item,
        keyEquals: 'value',
        keyShow: 'label'
    })

    const downloadReport = async (item) => {
        try {
            setLoading({ ...loading, [item.month]: true })
            let year = new Date().getFullYear();
            let params = `?month=${item?.month}&year=${year}&export=true`;
            let response = await WebApiPeople.getCfdiReport(itemNode?.id, params, { responseType: 'blob' });
            setLoading({ ...loading, [item.month]: false })
            let name = `${itemNode?.name} (${getNameMonth(item?.month)} ${year}).xlsx`;
            downloadBLOB({ data: response.data, name })
        } catch (e) {
            console.log(e)
            setLoading({ ...loading, [item.month]: false })
        }
    }

    const total = useMemo(() => {
        if (receipts.length <= 0) return {};
        return receipts?.reduce((acc, item) => {
            let receipts = (acc['receipts'] || 0) + item?.total_cfdi;
            let nomikhor = (acc['nomikhor'] || 0) + item?.total_cfdi_nomikhor;
            return { ...acc, receipts, nomikhor };
        }, {});
    }, [receipts])

    const columns = [
        {
            title: 'Mes',
            dataIndex: 'month',
            render: (item) => getNameMonth(item)
        },
        {
            title: 'Colaboradores',
            dataIndex: 'num_collaborators',
            render: (item) => (
                <Tag icon={<UserOutlined />}>
                    {item}
                </Tag>
            )
        },
        {
            title: 'Recibos',
            render: (item) => (
                <Space>
                    <Tag icon={iconNomi}>
                        {item?.total_cfdi_nomikhor}
                    </Tag>
                    <Tag icon={<FileTextOutlined />}>
                        {item?.total_cfdi}
                    </Tag>
                </Space>
            )
        },
        {
            title: 'Acciones',
            width: 40,
            render: (item) => (item?.total_cfdi > 0 || item?.total_cfdi_nomikhor > 0) ? (
                <Space>
                    {loading[item.month] ? (
                        <LoadingOutlined />
                    ) : (
                        <DownloadOutlined onClick={() => downloadReport(item)} />
                    )}
                </Space>
            ) : <></>
        }
    ]

    return (
        <MyModal
            title={itemNode?.name}
            visible={visible}
            close={close}
            widthModal={500}
        >
            <Row gutter={[0, 8]}>
                {receipts.length > 0 ? (
                    <Col span={24}>
                        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                            <p style={{marginBottom: 0}}>
                                Recibos
                            </p>
                            <p style={{marginBottom: 0}}>
                                nomikor: {total?.nomikhor || 0},
                                timbrados: {total?.receipts || 0}
                            </p>
                        </Space>
                        <Table
                            rowKey='month'
                            size='small'
                            showHeader={false}
                            dataSource={receipts}
                            columns={columns}
                            pagination={false}
                        />
                    </Col>
                ) : (
                    <Col span={24}>
                        <div className='placeholder-list-items' style={{ background: '#ffff', borderRadius: 8 }}>
                            <p>Ningún recibo encontrado</p>
                        </div>
                    </Col>
                )}
                <Col span={24}>
                    <Space style={{ justifyContent: 'flex-end', width: '100%' }}>
                        <Button onClick={() => close()}>
                            Cerrar
                        </Button>
                    </Space>
                </Col>
            </Row>
        </MyModal>
    )
}

export default ModalReceipts