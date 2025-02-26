import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../utils/functions';
//Details
import DetailsTemplate from './Templates/DetailsTemplate';
//Esta modificación es para la librería html-to-draftjs
const DetailsMessages = dynamic(()=> import('./messages/DetailsMessages'), { ssr: false });

const GetViewAddOrEdit = ({action}) => {

    const router = useRouter();
    const catalog = router.query?.catalog;
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id','catalog'];

    const Components = {
        profiles: DetailsTemplate,
        messages: DetailsMessages,
        __default__: ()=> <></>
    }

    useEffect(()=>{
        setNewFilters({})
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    },[router.query])

    const Selected = Components[catalog] ?? Components['__default__'];

    return <Selected
        action={action}
        newFilters={newFilters}
    />;
}

export default GetViewAddOrEdit