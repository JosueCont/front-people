import React, { useMemo, useEffect, useState, memo } from 'react';
import { useRouter } from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFiltersJb } from '../../utils/functions';

const TagFilters = ({
    listKeys = {},
    listGets = {},
    listAwait = {},
    deleteKeys = [],
    discardKeys = [],
    defaultFilters = {},
}) => {

    const router = useRouter();
    const [params, setParamms] = useState([]);
    const [querys, setQuerys] = useState([]);

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            let ignore = [...discardKeys, 'page', 'size'];
            let filters = deleteFiltersJb(router.query, ignore);
            getValues(filters);
            return;
        }
        setParamms([])
        setQuerys([])
    }, [router.query])

    const getValues = async (querys) => {
        let keys = Object.keys(listAwait);
        let values = Object.entries(querys);
        if(keys?.length <=0){
            setQuerys([])
            setParamms(values)
            return;
        }

        const filter_ = item => keys.includes(item[0]);
        let records = values.filter(filter_);
        if (records?.length <= 0) {
            setQuerys([])
            setParamms(values)
            return;
        }

        let results = [];
        const rows_ = item => !keys.includes(item[0]);
        let rows = values.filter(rows_);
        for (const [key, val] of records) {
            let response = listAwait[key] ? await listAwait[key](val, key) : val;
            results.push([key, response]);
        }

        setParamms(rows)
        setQuerys(results)
    }

    const removeFilter = (key) => {
        let ignore = [...deleteKeys, key];
        let filters = deleteFiltersJb(router.query, ignore);
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, { shallow: true })
    }

    const showFilters = useMemo(() => {
        return params?.length > 0
            || querys?.length > 0
            || Object.keys(defaultFilters)?.length > 0
    }, [defaultFilters, params, querys])

    const TagItem = ({ item: [key, val], type = 'default' }) => (
        <div className={`item-list-row ${type}`}>
            <p>{listKeys[key] ?? key}: {listGets[key] ? listGets[key](val) : val}</p>
            {type == 'normal' && <CloseOutlined onClick={() => removeFilter(key)} />}
        </div>
    )

    const default_ = useMemo(() => Object.entries(defaultFilters), [defaultFilters]);
    const filters_ = useMemo(() => ([...params, ...querys]), [params, querys]);

    return (
        <div className='body-list-items'>
            {showFilters ? (
                <>
                    {default_?.length > 0 && default_.map((item, idx) => (
                        <TagItem item={item} key={idx} />
                    ))}
                    {filters_?.length > 0 && filters_.map((item, idx) => (
                        <TagItem item={item} type='normal' key={idx} />
                    ))}
                </>
            ) : (
                <div className='placeholder-list-items'>
                    <p>Ningún filtro aplicado</p>
                </div>
            )}
        </div>
    )
}

export default memo(TagFilters);