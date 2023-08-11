import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainORG from '../../../components/structure/MainOrg';
import SearchCatalogs from '../../../components/structure/catalogs/SearchCatalogs';
import TableCatalogs from '../../../components/structure/catalogs/TableCatalogs';

const index = () => {
    return (
        <MainORG
            pageKey='org_catalogs'
            extraBread={[{name: 'Catálogos'}]}
        >
            <SearchCatalogs
                showBack={false}
                showAdd={false}
            />
            <TableCatalogs/>
        </MainORG>
    )
}

export default withAuthSync(index)