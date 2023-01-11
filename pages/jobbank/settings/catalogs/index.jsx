import React, { useEffect } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import ListCatalogs from '../../../../components/jobbank/catalogs/ListCatalogs';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';

const index = () => {

    const ExtraBread = [
        {name: 'Configuraciones', URL: '/jobbank/settings'},
        {name: 'Catálogos'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={ExtraBread}
        >
            <ListCatalogs/>
        </MainIndexJB>
    )
}

export default withAuthSync(index);