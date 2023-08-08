import React, { useMemo } from 'react';
import MainConfig from '../../../components/config/MainConfig';
import { useRouter } from 'next/router';
import { catalogsCompany } from '../../../utils/constant';
import GetCatalog from '../../../components/config/catalogs/GetCatalog';

const index = () => {

    const router = useRouter();

    const nameCatalog = useMemo(() => {
        let current = router.query?.catalog;
        if (!current) return 'Catálogo';
        const _find = item => item.catalog == current;
        let result = catalogsCompany.find(_find);
        if (!result) return 'Catálogo';
        return result.name;
    }, [router.query?.catalog])

    const ExtraBread = [
        { name: 'Catálogos', URL: '/config/catalogs' },
        { name: nameCatalog }
    ]

    return (
        <MainConfig
            pageKey='catalogs'
            extraBread={ExtraBread}
        >
            <GetCatalog nameCatalog={nameCatalog}/>
        </MainConfig>
    )
}

export default index