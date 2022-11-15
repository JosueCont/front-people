import { useState, useEffect, useLayoutEffect } from 'react';
import { message } from 'antd';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
    getMainCategories,
    getSubCategories,
    getAcademics,
    getCompetences,
    getProfilesTypes,
    getSectors
} from '../../../../redux/jobBankDuck';
import WebApiJobBank from '../../../../api/WebApiJobBank';

export const useCatalog = () =>{

    const router = useRouter();
    const dispatch = useDispatch();
    const setKeys = { results: [], loading: false };
    const catalogs = useSelector(state => state.jobBankStore);

    const catalogsJobbank = [
        { catalog: 'categories', name: 'Categorías'},
        { catalog: 'subcategories', name: 'Subcategorías' },
        { catalog: 'academic', name: 'Carreras'},
        { catalog: 'competences', name: 'Competencias'},
        { catalog: 'profiles', name: 'Perfiles de template'},
        { catalog: 'sectors', name: 'Sectores'}
    ];

    const listKeysCatalog = {
        categories: {
            data: 'list_main_categories',
            load: 'load_main_categories',
            titleBread: 'Categorías',
            titleModal: 'categoría',
            getAction: getMainCategories,
            // updateAction: updateMainCategory,
            ...setKeys
        },
        academic: {
            data: 'list_academics',
            load: 'load_academics',
            titleBread: 'Carreras',
            titleModal: 'carrera',
            getAction: getAcademics,
            ...setKeys 
        },
        competences: {
            data: 'list_competences',
            load: 'load_competences',
            titleBread: 'Competencias',
            titleModal: 'competencia',
            getAction: getCompetences,
            ...setKeys
        },
        profiles: {
            data: 'list_profiles_types',
            load: 'load_profiles_types',
            titleBread: 'Perfiles template',
            titleModal: 'perfil template',
            getAction: getProfilesTypes,
            ...setKeys
        },
        sectors: {
            data: 'list_sectors',
            load: 'load_sectors',
            titleBread: 'Sectores',
            titleModal: 'sector',
            getAction: getSectors,
            ...setKeys
        },
        subcategories: {
            data: 'list_sub_categories',
            load: 'load_sub_categories',
            titleBread: 'Subcategorías',
            titleModal: 'subcategoría',
            getAction: getSubCategories,
            ...setKeys
        }
    };

    const [infoCatalog, setInfoCatalog] = useState({});

    useEffect(()=>{
        const info = getSelected();
        let results = info ? catalogs[info.data] : [];
        let loading = info ? catalogs[info.load] : false;
        setInfoCatalog({...info, results, loading});
    },[catalogs])

    const getSelected = () =>{
        const selected = router.query.catalog;
        return listKeysCatalog[selected];
    }

    const getCatalog = (node) =>{
        const info = getSelected();
        dispatch(info.getAction(node))
    }

    return {
        infoCatalog,
        catalogsJobbank,
        getCatalog
    }

}