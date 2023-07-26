import React from 'react';
import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../utils/functions';

export const useFiltersCenters = () => {

    const {
        list_companies,
        load_companies
    } = useSelector(state => state.timeclockStore);
    
    const listKeys = {
        name__icontains: 'Nombre',
        address__icontains: 'Dirección',
        is_active: 'Estatus',
        node: 'Empresa'
    }

    const getStatus = value => value == 'true'
        ? 'Activo' : 'Inactivo';

    const getCompany = (id) => getValueFilter({
        value: id,
        list: list_companies
    })

    const listGets = {
        is_active: getStatus,
        node: getCompany
    }

    return {
        listKeys,
        listGets
    }

}