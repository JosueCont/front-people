import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../../libs/auth';
import DetailsConnections from '../../../../components/jobbank/connections/DetailsConnections';
import { deleteFiltersJb } from '../../../../utils/functions';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';

const edit = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','code'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    const ExtraBread = [
        {name: 'Configuracions', URL: '/jobbank/settings'},
        {name: 'Conexiones', URL: '/jobbank/settings/connections'},
        {name: 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsConnections newFilters={newFilters}/>
        </MainIndexJB>
    )
}

export default withAuthSync(edit);