import React from 'react';
import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../utils/functions';

export const useFiltersCenters = () => {

    const {
        list_companies,
        load_companies
    } = useSelector(state => state.timeclockStore);

    const getStatus = value => value == 'true'
        ? 'Activo' : 'Inactivo';

    const getCompany = (id) => getValueFilter({
        value: id,
        list: list_companies
    })

    const listKeys = {
        name__unaccent__icontains: {
            name: 'Nombre',
        },
        address__unaccent__icontains: {
            name: 'Dirección'
        },
        is_active: {
            name: 'Estatus',
            get: getStatus
        },
        node: {
            name: 'Empresa',
            get: getCompany,
            loading: load_companies
        }
    }

    return {
        listKeys
    }

}