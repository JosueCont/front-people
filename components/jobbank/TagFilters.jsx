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
    deleteKeys = [],
    discardKeys = [],
    defaultFilters = {},
}) => {

    const router = useRouter();
    const [params, setParams] = useState([]);

    useEffect(() => {
        if (Object.keys(router.query).length > 0) {
            let ignore = [...discardKeys, 'page', 'size'];
            let filters = deleteFiltersJb(router.query, ignore);
            setParams(Object.entries(filters))
            return;
        }
        setParams([])
    }, [router.query])

    const removeFilter = (key) => {
        let ignore = [...deleteKeys, key];
        let filters = deleteFiltersJb(router.query, ignore);
        router.replace({
            pathname: router.asPath?.split('?')[0],
            query: filters
        }, undefined, { shallow: true })
    }

    const TagItem = ({ item: [key, val], type = 'default' }) => {
        const record = listKeys[key];
        return !record?.loading ? (
            <div className={`item-list-row ${type}`}>
                <p>{record?.name ? record.name : key}: {record?.get ? record.get(val) : val}</p>
                {type == 'normal' && <CloseOutlined onClick={() => removeFilter(key)} />}
            </div>
        ) : <LoadTag active size='small' />
    }

    const default_ = useMemo(() => Object.entries(defaultFilters), [defaultFilters]);

    return (
        <div className='body-list-items'>
            {(params?.length > 0 || default_?.length > 0) ? (
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