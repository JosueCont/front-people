import React, { useMemo } from 'react';
import { withAuthSync } from '../../../../../libs/auth';
import { useRouter } from 'next/router';
import { catalogsJobbank } from '../../../../../utils/constant';
import GetViewCatalog from '../../../../../components/jobbank/catalogs/GetViewCatalog';
import MainIndexJB from '../../../../../components/jobbank/MainIndexJB';

const catalog = () => {

    const router = useRouter();

    const nameCatalog = useMemo(() =>{
        if(!router.query?.catalog) return 'Catálogo';
        const _find = item => item.catalog == router.query?.catalog;
        let result = catalogsJobbank.find(_find);
        if(!result) return 'Catálogo';
        return result.name;
    }, [router.query?.catalog])

    const ExtraBread = useMemo(()=>{
        return [
            {name: 'Configuraciones', URL: '/jobbank/settings'},
            {name: 'Catálogos', URL: '/jobbank/settings/catalogs'},
            {name: nameCatalog}
        ];
    },[nameCatalog])

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={ExtraBread}
        >
            <GetViewCatalog/>
        </MainIndexJB>
    )
}

export default withAuthSync(catalog);