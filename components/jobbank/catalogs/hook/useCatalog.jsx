import { useState, useEffect, useLayoutEffect } from 'react';
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
import { useActions } from './useActions';

export const catalogsJobbank = [
    { catalog: 'categories', name: 'Categorías'},
    // { catalog: 'subcategories', name: 'Subcategorías' },
    // { catalog: 'academic', name: 'Carreras'},
    // { catalog: 'competences', name: 'Competencias'},
    // { catalog: 'profiles', name: 'Perfiles de template'},
    // { catalog: 'sectors', name: 'Sectores'}
];

export const useCatalog = () =>{

    const router = useRouter();
    const dispatch = useDispatch();
    const { listKeysCatalog } = useActions();
    const catalogs = useSelector(state => state.jobBankStore);
    const [currentCatalog, setCurrentCatalog] = useState({});
    const [infoCatalog, setInfoCatalog] = useState({});

    useEffect(()=>{
        let info = getSelected();
        let results = catalogs[info.data];
        let loading = catalogs[info.load];
        setInfoCatalog({...info, results, loading});
        setCurrentCatalog({results, loading});
    },[catalogs])

    const getSelected = () =>{
        const selected = router.query.catalog;
        return listKeysCatalog[selected];
    }

    const getCatalog = (node) =>{
        let info = getSelected();
        if(info.data == 'list_sub_categories') info.getAction(node);
        else dispatch(info.getAction(node));
    }

    return {
        infoCatalog,
        currentCatalog,
        setCurrentCatalog,
        getCatalog,
    }

}