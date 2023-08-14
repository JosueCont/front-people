import React, { useMemo } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import MainORG from '../../../../components/structure/MainOrg';
import { useRouter } from 'next/router';
import { catalogsOrgStructure } from '../../../../utils/constant';
import GetCatalog from '../../../../components/structure/catalogs/GetCatalog';

const index = () => {

    const router = useRouter();

    const nameCatalog = useMemo(() => {
        let current = router.query?.catalog;
        if (!current) return 'Catálogo';
        const _find = item => item.catalog == current;
        let result = catalogsOrgStructure.find(_find);
        if (!result) return 'Catálogo';
        return result.name;
    }, [router.query?.catalog])

    const ExtraBread = [
        { name: 'Catálogos', URL: '/structure/catalogs' },
        { name: nameCatalog }
    ]

    return (
        <MainORG
            pageKey='org_catalogs'
            extraBread={ExtraBread}
        >
            <GetCatalog nameCatalog={nameCatalog}/>
        </MainORG>
    )
}

export default withAuthSync(index)