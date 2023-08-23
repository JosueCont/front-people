import { useSelector } from 'react-redux';
import { getValueFilter } from '../../../../utils/functions';

export const useFiltersRanks = () => {

    const {
        list_org_nodes_options,
        load_org_nodes_options
    } = useSelector(state => state.orgStore);

    const getNode = (id) => getValueFilter({
        value: id,
        list: list_org_nodes_options
    })

    const getLevel = (value) => value == 'true'
        ? 'Sí' : 'No';

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
        organizational_node: {
            name: 'Nodo organizacional',
            loading: load_org_nodes_options,
            get: getNode
        },
        includeGlobal: {
            name: 'Ver niveles globales',
            get: getLevel
        }
    }

    return {
        listKeys
    }
}