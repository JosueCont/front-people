import React, { useState } from 'react';
import { Menu } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { downloadBLOB } from '../../../utils/functions';
import WebApiPeople from '../../../api/WebApiPeople';

const DownloadPeople = () => {

    const {
        current_node
    } = useSelector(state => state.userStore);
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const actionDownload = async () => {
        try {
            setLoading(true)
            let body = { ...router.query, node: current_node?.id };
            let response = await WebApiPeople.exportPeople(body);
            setLoading(false)
            downloadBLOB({ data: response.data, name: 'Personas.xlsx' });
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    // return { actionDownload }

    // return {
    //     key: '1',
    //     label: 'Descargar personas',
    //     disabled: loading,
    //     icon: <DownloadOutlined />,
    //     onClick: actionDownload
    // }

    return (
        <Menu.Item
            key='1'
            icon={<DownloadOutlined />}
            disabled={loading}
            onClick={() => actionDownload()}
        >
            Descargar personas
        </Menu.Item>
    )
}

export default DownloadPeople;