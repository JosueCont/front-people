import React, { useState, useEffect } from 'react';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import DetailsLogs from '../../../components/timeclock/logs/DetailsLogs';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../utils/functions';

const details = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    const ExtraBread = [
        {name: 'Logs de eventos', URL: '/timeclock/logs'},
        {name: 'Detalle'}
    ]

    return (
        <MainIndexTM
            pageKey={["tm_logs"]}
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsLogs newFilters={newFilters}/>
        </MainIndexTM>
    )
}

export default details