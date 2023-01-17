import React, { useMemo } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import GetViewAddOrEdit from './GetViewAddOrEdit';
import MainIndexJB from '../MainIndexJB';
import { catalogsJobbank } from '../../../utils/constant';

const AddOrEditCatalog = ({
    action = 'add',
    currentNode
}) => {

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
            {name: nameCatalog, URL: `/jobbank/settings/catalogs/${router.query?.catalog}`},
            {name: action == 'add' ? 'Nuevo' : 'Expediente'}
        ];
    },[nameCatalog])

    return (
        <MainIndexJB
            pageKey='jb_settings'
            extraBread={ExtraBread}
        >
            <GetViewAddOrEdit action={action}/>
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState)(AddOrEditCatalog);