import React from 'react';
import {
    CardItem,
    CardTitle,
    CardDescription,
    ButtonPrimary,
    ContentEnd
} from './SearchStyled';
import { useRouter } from 'next/router';

const SearchCard = ({
    item = {}
}) => {

    const router = useRouter();

    return (
        <CardItem>
            <CardTitle>
                <span />
                <p>{item?.job_position}</p>
            </CardTitle>
            <CardDescription className='scroll-bar'>
                <p>Estado: <span>{item?.location?.name || 'no disponible'}</span></p>
                <p>Categoría: <span>{item?.education_and_competence?.main_category?.name || 'No disponible'}</span></p>
                <p>Folio: <span>{item?.num_project || 'No disponible'}</span></p>
                <p>Producto: <span>{item?.product || 'No disponible'}</span></p>
            </CardDescription>
            <ContentEnd>
                <ButtonPrimary
                    onClick={() => router.push({
                        pathname: '/jobbank/search/details/',
                        query: {...router.query, vacant: item.id}
                    })}
                >
                    Ver detalle
                </ButtonPrimary>
            </ContentEnd>
        </CardItem>
    )
}

export default SearchCard