import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../../utils/functions';

export const useFiltersNodes = () => {

    const {
        list_org_levels_options,
        load_org_levels_options,
        list_org_nodes_options,
        load_org_nodes_options
    } = useSelector(state => state.orgStore);

    const getNode = (id) => getValueFilter({
        value: id,
        list: list_org_nodes_options
    })

    const getLevel = (id) => getValueFilter({
        value: id,
        list: list_org_levels_options
    })

    const listKeys = {
        name__unaccent__icontains: {
            name: 'Nombre'
        },
        description__unaccent__icontains: {
            name: 'Descripción'
        },
        is_active: {
            name: 'Estatus',
            get: e => e == 'all' ? 'Todos'
                : e == 'true' ? 'Activo' : 'Inactivo'
        },
        parent: {
            name: 'Precede',
            loading: load_org_nodes_options,
            get: getNode
        },
        organizational_level:{
            name: 'Nivel organizacional',
            loading: load_org_levels_options,
            get: getLevel
        }
    }

    return {
        listKeys
    }
}