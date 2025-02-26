import React, {
    useState,
    useEffect
} from 'react';
import MainConfig from '../../../components/config/MainConfig';
import SearchCatalogs from '../../../components/config/catalogs/SearchCatalogs';
import TableCatalogs from '../../../components/config/catalogs/TableCatalogs';

const index = () =>{
    return (
        <MainConfig
            pageKey='catalogs'
            extraBread={[{name: 'Catálogos'}]}
        >
            <SearchCatalogs
                showBack={false}
                showOptions={true}
                showAdd={false}
            />
            <TableCatalogs/>
        </MainConfig>
    )
}

export default index;
