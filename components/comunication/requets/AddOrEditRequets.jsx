import React, { useEffect, useState } from 'react';
import MainRequets from '../MainRequets';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import DetailsRequets from './DetailsRequets';
import { useRouter } from 'next/router';
import { deleteFiltersJb } from '../../../utils/functions';

const AddOrEditRequets = ({
    action = 'add',
    isAdmin = true,
    currentNode,
    getPersonsCompany
}) => {

    const router = useRouter();
    const [newFilters, setNewFilters] = useState({});
    const deleteKeys = ['id'];

    useEffect(() => {
        if (Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deleteKeys);
        setNewFilters(filters);
    }, [router.query])

    useEffect(() => {
        if (!currentNode) return;
        getPersonsCompany(currentNode.id);
    }, [currentNode])

    const ExtraBread = [
        { name: 'Vacaciones', URL: isAdmin ? '/comunication/requests/holidays' : '/user/requests/holidays' },
        { name: action == 'add' ? 'Registrar' : 'Actualizar' }
    ]

    return (
        <MainRequets
            pageKey={['holidays']}
            extraBread={ExtraBread}
            isAdmin={isAdmin}
            newFilters={newFilters}
        >
            <DetailsRequets
                action={action}
                isAdmin={isAdmin}
                newFilters={newFilters}
            />
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
    getPersonsCompany
}
)(AddOrEditRequets);