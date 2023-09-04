import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainORG from '../../../components/structure/MainOrg';
import ListCatalogs from '../../../components/structure/catalogs/ListCatalogs';

const index = () => {
    return (
        <MainORG
            pageKey='org_catalogs'
            extraBread={[{name: 'Catálogos'}]}
        >
            <ListCatalogs/>
        </MainORG>
    )
}

export default withAuthSync(index)