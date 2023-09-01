import React, { useMemo, useEffect, useState, memo } from 'react';
import { useRouter } from 'next/router';
import { Skeleton } from 'antd';
import styled from '@emotion/styled';
import { CloseOutlined } from '@ant-design/icons';
import { deleteFiltersJb } from '../../utils/functions';

const LoadTag = styled(Skeleton.Input)`
    height: 26px;
    border-radius: 12px;
    & .ant-skeleton-input-sm {
        height: 26px;
        line-height: 26px;
    }
`;

const TagFilters = ({
    listKeys = {},
    listAwait = {},
    deleteKeys = [],
    discardKeys = [],
    defaultFilters = {},
}) => {

    const router = useRouter();
    const [params, setParams] = useState([]);
    const [values, setValues] = useState({});

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            let ignore = [...discardKeys, 'page', 'size'];
            let filters = deleteFiltersJb(router.query, ignore);
            getValuesFilters(filters)
            setParams(Object.entries(filters))
            return;
        }
        setParams([])
        setValues({})
    }, [router.query])

    const getValuesFilters = async (querys) => {
        let keys = Object.keys(listAwait);
        let values = Object.entries(querys);

        const filter_ = item => keys.includes(item[0]);
        let records = values.filter(filter_);
        if (records?.length <= 0) {
            setValues({})
            return;
        }

        for (const [key, val] of records) {
            let response = listAwait[key] ? await listAwait[key](val, key) : val;
            setValues(prev => ({...prev, [key]: response}))
        }
    }

    const removeFilter = (record, key) => {
        if (record?.delete) record?.delete(key);

        let ignore = [...deleteKeys, key];
        let filters = deleteFiltersJb(router.query, ignore);
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, { shallow: true })
    }

    const TagItem = ({ item: [key, val], type = 'default' }) => {
        const record = listKeys[key];
        let value_ = values[key] ? values[key]
            : record?.get ? record.get(val) : val;
        return !record?.loading ? (
            <div className={`item-list-row ${type}`}>
                <p>{record?.name ? record.name : key}: {value_}</p>
                {type == 'normal' && <CloseOutlined onClick={() => removeFilter(record, key)} />}
            </div>
        ) : <LoadTag active size='small' />
    }

    const default_ = useMemo(() => Object.entries(defaultFilters), [defaultFilters]);
    const showTags = useMemo(() => {
        return params?.length > 0 || Object.keys(defaultFilters)?.length > 0;
    }, [defaultFilters, params])

    return (
        <div className='body-list-items'>
            {showTags ? (
                <>
                    {default_?.length > 0 && default_.map((item, idx) => (
                        <TagItem item={item} key={idx} />
                    ))}
                    {params.length > 0 && params.map((item, idx) => (
                        <TagItem item={item} key={idx} type='normal' />
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