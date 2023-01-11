import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { getFiltersJB, deleteFiltersJb } from '../../../utils/functions';
//Catálogos
import ViewCategories from './views/ViewCategories';
import ViewSubcategories from './views/ViewSubcategories';
import ViewAcademics from './views/ViewAcademics';
import ViewCompetences from './views/ViewCompetences';
import ViewSectors from './views/ViewSectors';
import ViewJobBoards from './views/ViewJobBoards';
import ViewTemplates from './Templates/ViewTemplates';
import ViewMessages from './messages/ViewMessages';
import ViewTypes from './views/ViewTypes';
import ViewScholarship from './views/ViewScholarship';

const GetViewCatalog = () =>{

    const router = useRouter();
    const catalog = router.query?.catalog;
    const deleteKeys = ['catalog'];

    const Components = {
        categories: ViewCategories,
        subcategories: ViewSubcategories,
        academic: ViewAcademics,
        competences: ViewCompetences,
        sectors: ViewSectors,
        jobboars: ViewJobBoards,
        profiles: ViewTemplates,
        messages: ViewMessages,
        // types: ViewTypes,
        scholarship: ViewScholarship,
        __default__: ()=> <></>
    }

    const selectedProps = useMemo(()=>{
        let numPage = router.query?.page ? parseInt(router.query.page) : 1;
        let filtersQuery = deleteFiltersJb(router.query, deleteKeys);
        let filtersString = getFiltersJB(filtersQuery);
        return { numPage, filtersQuery, filtersString };
    },[router.query])

    const Selected = Components[catalog] ?? Components['__default__'];

    return <Selected {...selectedProps}/>;
}

export default GetViewCatalog;