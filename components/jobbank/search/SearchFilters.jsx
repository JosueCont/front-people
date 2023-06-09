import React, { useMemo } from 'react';
import {
    SectionTitle,
    SectionBody,
    SectionSubtitle,
    SectionTags,
    SectionVoid,
    ContentVertical
} from './SearchStyled';
import { useSelector } from 'react-redux';
import { Tag, Skeleton } from 'antd';
import { useRouter } from 'next/router';
import SearchForm from './SearchForm';
import { deleteFiltersJb } from '../../../utils/functions';

const SearchFilters = () => {

    const {
        list_states,
        load_states,
        load_main_categories,
        list_main_categories,
    } = useSelector(state => state.jobBankStore);

    const router = useRouter();

    const statesWithVacant = useMemo(() => {
        if (list_states?.length <= 0) return [];
        return list_states?.filter(item => item.vacant_count > 0);
    }, [list_states])

    const categoriesWithVacant = useMemo(() => {
        if (list_main_categories?.length <= 0) return [];
        return list_main_categories?.filter(item => item.vacant_count > 0);
    }, [list_main_categories])

    const existLocation = useMemo(() => {
        const some_ = item => item.id == router.query?.location;
        return router.query?.location && statesWithVacant.some(some_);
    }, [statesWithVacant, router.query?.location])

    const existCategory = useMemo(() => {
        const some_ = item => item.id == router.query?.category;
        return router.query?.category && categoriesWithVacant.some(some_);
    }, [categoriesWithVacant, router.query?.category])

    const SectionEmpty = (
        <SectionVoid>
            <p>Ningún resultado encontrado</p>
        </SectionVoid>
    )

    const SectionSkeleton = (
        <SectionTags>
            {Array(10).fill(null).map((_, idx) => (
                <Skeleton.Input
                    active
                    size='small'
                    key={idx}
                />
            ))}
        </SectionTags>
    )

    const updateFilters = (obj = {}) => {
        router.replace({
            pathname: '/jobbank/search',
            query: obj
        }, undefined, { shallow: true })
    }

    const setFilter = (key, value) => {
        if (router?.query[key] == value) return;
        let filters = deleteFiltersJb({ ...router.query, [key]: value }, ['page'])
        updateFilters(filters)
    }

    const cleanFilter = (key) => {
        let filters = deleteFiltersJb({ ...router.query }, [key])
        updateFilters(filters)
    }

    return (
        <>
            <ContentVertical>
                <SectionTitle>
                    <p>Búsqueda de vacantes</p>
                </SectionTitle>
                <SectionBody>
                    <SearchForm />
                </SectionBody>
            </ContentVertical>
            <ContentVertical>
                <SectionTitle>
                    <p>Empleos disponibles</p>
                </SectionTitle>
                <SectionBody>
                    <SectionSubtitle>
                        <p>Ubicación</p>
                        {existLocation && (
                            <span onClick={() => cleanFilter('location')}>
                                Limpiar filtro
                            </span>
                        )}
                    </SectionSubtitle>
                    {!load_states ? (
                        <>{statesWithVacant?.length > 0 ? (
                            <SectionTags>
                                {statesWithVacant.map((item, idx) => (
                                    <Tag
                                        key={idx}
                                        onClick={() => setFilter('location', item?.id)}
                                        color={router.query?.location == item.id ? '#108ee9' : ''}
                                    >
                                        {item.name} ({item?.vacant_count})
                                    </Tag>
                                ))}
                            </SectionTags>
                        ) : SectionEmpty}</>
                    ) : SectionSkeleton}
                    <SectionSubtitle>
                        <p>Categoría</p>
                        {existCategory && (
                            <span onClick={() => cleanFilter('category')}>
                                Limpiar filtro
                            </span>
                        )}
                    </SectionSubtitle>
                    {!load_main_categories ? (
                        <>{categoriesWithVacant?.length > 0 ? (
                            <SectionTags>
                                {categoriesWithVacant.map((item, idx) => (
                                    <Tag
                                        key={idx}
                                        onClick={() => setFilter('category', item?.id)}
                                        color={router.query?.category == item.id ? '#108ee9' : ''}
                                    >
                                        {item.name} ({item?.vacant_count})
                                    </Tag>
                                ))}
                            </SectionTags>
                        ) : SectionEmpty}</>
                    ) : SectionSkeleton}
                </SectionBody>
            </ContentVertical>
        </>
    )
}

export default SearchFilters