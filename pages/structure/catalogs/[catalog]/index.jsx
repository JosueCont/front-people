import React, { useMemo, useState, useEffect } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import MainORG from '../../../../components/structure/MainOrg';
import { useRouter } from 'next/router';
import { catalogsOrgStructure } from '../../../../utils/constant';
import GetCatalog from '../../../../components/structure/catalogs/GetCatalog';
import { deleteFiltersJb } from '../../../../utils/functions';

const index = () => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['catalog'];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    }, [router.query])

    const catalog = useMemo(() => {
        let current = router.query?.catalog;
        if (!current) return { name: 'Catálogo' };
        const _find = item => item.catalog == current;
        let result = catalogsOrgStructure.find(_find);
        if (!result) return { name: 'Catálogo' };
        return result;
    }, [router.query?.catalog])

    const ExtraBread = [
        { name: 'Catálogos', URL: '/structure/catalogs' },
        { name: catalog?.name }
    ]

    return (
        <MainORG
            pageKey='org_catalogs'
            extraBread={ExtraBread}
        >
            <GetCatalog
                catalog={catalog}
                newFilters={newFilters}
            />
        </MainORG>
    )
}

export default withAuthSync(index)