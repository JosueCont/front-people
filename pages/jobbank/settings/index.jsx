import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import { useRouter } from 'next/router';
import {
    LinkOutlined,
    FileTextOutlined
} from '@ant-design/icons';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';

const index = () => {

    const router = useRouter();

    const listAccess = [
        {
            name: 'Catálogos',
            icon: <FileTextOutlined/>,
            redirect: ()=> router.push('/jobbank/settings/catalogs')
        },
        {
            name: 'Conexiones',
            icon: <LinkOutlined/>,
            redirect: ()=> router.push('/jobbank/settings/connections')
        }
    ]

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={[{name: 'Configuraciones'}]}
        >
            <div className='list-access'>
                {listAccess.map((item, idx) => (
                    <div key={idx} className='card-access' onClick={()=> item.redirect()}>
                        {item.icon}<p>{item.name}</p>
                    </div>
                ))}
            </div>
        </MainIndexJB>
    )
}

export default withAuthSync(index);