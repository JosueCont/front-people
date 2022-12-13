import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { CloseOutlined } from '@ant-design/icons';

const TagFilters = ({
    listKeys = {},
    listValues = {},
    listGets = {}
}) => {

    const router = useRouter();

    const removeFilter = (key) =>{
        let filters = {...router.query};
        if(filters[key]) delete filters[key];
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, {shallow:true})
    }

    const validateValue = useCallback((key, val)=>{
        if(listValues[val]) return listValues[val];
        if(listGets[key]) return listGets[key](val);
        return val;
    },[listGets])

    return (
        <div className='body-list-items scroll-bar'>
            {Object.keys(router.query).length > 0 ?
                Object.entries(router.query).map(([key, val], idx) =>(
                <div className='item-list-row' key={idx}>
                    <p>
                        {listKeys[key] ?? key}:&nbsp;
                        {validateValue(key, val)}
                    </p>
                    <CloseOutlined onClick={()=> removeFilter(key)}/>
                </div>
            )): (
                <div className='placeholder-list-items'>
                    <p>Ningún filtro aplicado</p>
                </div>
            )}
        </div>
    )
}

export default TagFilters;