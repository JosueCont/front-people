import React, { useEffect, useState } from 'react';
import MainRequets from '../MainRequets';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import DetailsRequets from './DetailsRequets';

const AddOrEditRequets = ({
    action = 'add',
    isAdmin = true,
    currentNode,
    getPersonsCompany
}) => {

    useEffect(() => {
        if (currentNode) {
            getPersonsCompany(currentNode.id);
        };
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
        >
            <DetailsRequets
                action={action}
                isAdmin={isAdmin}
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