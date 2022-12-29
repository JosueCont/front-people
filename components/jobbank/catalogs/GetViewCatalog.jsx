import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFiltersJB, deleteFiltersJb } from '../../../utils/functions';
//Catálogos
import ViewCategories from './ViewsCatalogs/ViewCategories';
import ViewSubcategories from './ViewsCatalogs/ViewSubcategories';
import ViewAcademics from './ViewsCatalogs/ViewAcademics';
import ViewCompetences from './ViewsCatalogs/ViewCompetences';
import ViewSectors from './ViewsCatalogs/ViewSectors';
import ViewJobBoards from './ViewsCatalogs/ViewJobBoards';
import ViewTemplates from './ViewsCatalogs/ViewTemplates';

const GetViewCatalog = () =>{

    const router = useRouter();
    const catalog = router.query?.catalog;
    const deleteKeys = ['catalog'];
    const [filtersString, setFiltersString] = useState('');
    const [filtersQuery, setFiltersQuery] = useState({});
    const [numPage, setNumPage] = useState(1);

    const Components = {
        categories: ViewCategories,
        subcategories: ViewSubcategories,
        academic: ViewAcademics,
        competences: ViewCompetences,
        sectors: ViewSectors,
        jobboars: ViewJobBoards,
        profiles: ViewTemplates,
        __default__: <></>
    }

    useEffect(()=>{
        let page = router.query.page
            ? parseInt(router.query.page)
            : 1;
        let params = deleteFiltersJb(router.query, deleteKeys);
        let filters = getFiltersJB(params);
        setNumPage(page)
        setFiltersQuery(params)
        setFiltersString(filters)
    },[router.query])

    const Selected = Components[catalog] ?? Components['__default__'];

    return <Selected
        filtersQuery={filtersQuery}
        filtersString={filtersString}
        currentPage={numPage}
    />;
}

export default GetViewCatalog;