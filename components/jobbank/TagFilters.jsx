import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFiltersJb } from '../../utils/functions';

const TagFilters = ({
    listKeys = {},
    listGets = {},
    deleteKeys = [],
    defaultFilters = [],
}) => {

    const router = useRouter();

    const newFilters = useMemo(()=>{
        let exist = Object.keys(router.query).length <= 0;
        if(exist) return [];
        let filters = deleteFiltersJb(router.query, [...deleteKeys, 'page','size']);
        return Object.entries(filters);
    },[router.query])

    const removeFilter = (key) =>{
        let filters = {...router.query};
        if(filters[key]) delete filters[key];
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, {shallow:true})
    }

    return (
        <div className='body-list-items scroll-bar'>
            {(newFilters.length > 0 || defaultFilters.length > 0) ? (
                <>
                    {defaultFilters.length > 0 && defaultFilters.map(([key, val], idx)=> (
                        <div className='item-list-row default' key={"record_"+idx}>
                            <p>{key}: {val}</p>
                        </div>
                    ))}
                    {newFilters.length > 0 && newFilters.map(([key, val], idx) => (
                        <div className='item-list-row normal' key={"item_"+idx}>
                            <p>{listKeys[key] ?? key}: {listGets[key] ? listGets[key](val) : val}</p>
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