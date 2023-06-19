import React, { useMemo } from 'react';
import SearchCard from './SearchCard';
import SearchFilters from './SearchFilters';
import {
    ContentCards,
    SearchContent,
    SearchHeader,
    SearchAside,
    SearchBody,
    SearchLogo,
    SearchTitle,
    SearchPagination,
    CardItem,
    CardsVoid
} from './SearchStyled';
import { useSelector } from 'react-redux';
import {
    Pagination,
    Skeleton,
    Empty,
    Image
} from 'antd';
import { useRouter } from 'next/router';

const SearchVacants = () => {

    const {
        load_vacancies_search,
        list_vacancies_search,
        jobbank_page,
        jobbank_page_size
    } = useSelector(state => state.jobBankStore);
    const router = useRouter();

    const onChangePage = (page, size) => {
        router.replace({
            pathname: '/jobbank/search',
            query: { ...router.query, page }
        }, undefined, { shallow: true })
    }

    const sizeSkeleton = useMemo(() => {
        if (Object.keys(list_vacancies_search)?.length <= 0) return 10;
        return list_vacancies_search?.results?.length;
    }, [list_vacancies_search])

    return (
        <SearchContent>
            <SearchLogo grid={true}>
                <Image
                    src='/images/portadaHex.png'
                    preview={false}
                />
            </SearchLogo>
            <SearchHeader>
                <SearchTitle>
                    <p>Vacantes encontradas: {list_vacancies_search?.count ?? 0}</p>
                </SearchTitle>
                <SearchPagination>
                    <Pagination
                        size='small'
                        current={jobbank_page}
                        pageSize={jobbank_page_size}
                        total={list_vacancies_search?.count}
                        showSizeChanger={false}
                        onChange={onChangePage}
                        disabled={
                            load_vacancies_search ||
                            list_vacancies_search?.count < 10 ||
                            Object.keys(list_vacancies_search)?.length <= 0
                        }
                    />
                </SearchPagination>
            </SearchHeader>
            <SearchAside>
                <SearchFilters />
            </SearchAside>
            <SearchBody>
                {!load_vacancies_search ? (
                    <>
                        {list_vacancies_search?.results?.length > 0 ? (
                            <ContentCards size={list_vacancies_search?.results?.length}>
                                {list_vacancies_search?.results?.map((item, idx) => (
                                    <SearchCard item={item} key={idx}/>
                                ))}
                            </ContentCards>
                        ) : (
                            <CardsVoid>
                                <Empty description='Ningún resultado encontrado' />
                            </CardsVoid>
                        )}
                    </>
                ) : (
                    <ContentCards>
                        {Array(sizeSkeleton).fill(null).map((_, idx) => (
                            <CardItem key={idx}>
                                <Skeleton avatar active />
                                <div
                                    className='content-end'
                                    style={{ marginTop: 24 }}
                                >
                                    <Skeleton.Button active />
                                </div>
                            </CardItem>
                        ))}
                    </ContentCards>
                )}
            </SearchBody>
        </SearchContent>
    )
}

export default SearchVacants