import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../libs/auth';
import MainIndexJB from '../../../components/jobbank/MainIndexJB';
import DetailsSelection from '../../../components/jobbank/selection/details/DetailsSelection';
import { deleteFiltersJb } from '../../../utils/functions';

const edit = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id', 'vacant', 'tab','person'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    const ExtraBread = [
        {name: 'Proceso de selección', URL: '/jobbank/selection'},
        {name: 'Expediente'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_selection'
            extraBread={ExtraBread}
            newFilters={newFilters}
        >
            <DetailsSelection newFilters={newFilters}/>
        </MainIndexJB>
    )
}

export default withAuthSync(edit);