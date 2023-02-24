import React, { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFiltersJb } from '../../utils/functions';

const TagFilters = ({
    listKeys = {},
    listGets = {},
    deleteKeys = [],
    discardKeys = [],
    defaultFilters = [],
}) => {

    const router = useRouter();
    const [tags, setTags] = useState([]);

    useEffect(()=>{
        setTags([])
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb({...router.query}, [...discardKeys, 'page','size']);
        setTags(Object.entries(filters))
    },[router.query])
    
    const removeFilter = (key) =>{
        let filters = deleteFiltersJb({...router.query}, [...deleteKeys, key]);
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, {shallow:true})
    }

    return (
        <div className='body-list-items scroll-bar'>
            {(tags.length > 0 || defaultFilters.length > 0) ? (
                <>
                    {defaultFilters.length > 0 && defaultFilters.map(([key, val], idx)=> (
                        <div className='item-list-row default' key={"record_"+idx}>
                            <p>{key}: {val}</p>
                        </div>
                    ))}
                    {tags.length > 0 && tags.map(([key, val], idx) => (
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