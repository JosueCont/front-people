import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getFiltersJB, deleteFiltersJb } from '../../../utils/functions';
//Catálogos
import ViewCategories from './Views/ViewCategories';
import ViewSubcategories from './Views/ViewSubcategories';
import ViewAcademics from './Views/ViewAcademics';
import ViewCompetences from './Views/ViewCompetences';
import ViewSectors from './Views/ViewSectors';
import ViewJobBoards from './Views/ViewJobBoards';
import ViewTemplates from './Templates/ViewTemplates';
import ViewMessages from './Messages/ViewMessages';
import ViewTypes from './Views/ViewTypes';

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
        messages: ViewMessages,
        types: ViewTypes,
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