import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFiltersJb } from '../../utils/functions';

const TagFilters = ({
    listKeys = {},
    listGets = {},
    deleteKeys = [],
    discardKeys = [],
    defaultFilters = {},
}) => {

    const router = useRouter();
    const [tagFilters, SetTagFilters] = useState([]);

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0){
            SetTagFilters([])
            return;
        };
        let querys = deleteFiltersJb({...router.query}, [...discardKeys, 'page','size']);
        getValues(querys);
    },[router.query])

    const getValues = async (querys) =>{
        let values = Object.entries(querys);
        let params = [];
        for (const [key, val] of values) {
            let response = listGets[key] ? await listGets[key](val, key) : val;
            params.push([key, response]);
        }
        SetTagFilters(params)
    }
    
    const removeFilter = (key) =>{
        let filters = deleteFiltersJb({...router.query}, [...deleteKeys, key]);
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, {shallow:true})
    }


    return (
        <div className='body-list-items scroll-bar'>
            {(tagFilters.length > 0 || Object.keys(defaultFilters).length > 0) ? (
                <>
                    {Object.keys(defaultFilters).length > 0
                        && Object.entries(defaultFilters).map(([key, val], idx)=> (
                        <div className='item-list-row default' key={"record_"+idx}>
                            <p>{key}: {val}</p>
                        </div>
                    ))}
                    {tagFilters.length > 0 && tagFilters.map(([key, val], idx) => (
                        <div className='item-list-row normal' key={"item_"+idx}>
                            <p>{listKeys[key] ? listKeys[key] : key}: {val}</p>
                            <CloseOutlined onClick={()=> removeFilter(key)}/>
                        </div>
                    ))}
                </>
            ): (
                <div className='placeholder-list-items'>
                    <p>Ningún filtro aplicado</p>
                </div>
            )}
        </div>
    )
}

export default TagFilters;