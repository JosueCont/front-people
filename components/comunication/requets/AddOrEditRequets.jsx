import React, { useEffect, useState } from 'react';
import MainRequets from '../MainRequets';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import DetailsRequets from './DetailsRequets';

const AddOrEditRequets = ({
    action = 'add',
    currentNode,
    getPersonsCompany
}) => {

    useEffect(() => {
        if (currentNode) {
            getPersonsCompany(currentNode.id);
        };
    }, [currentNode])

    const ExtraBread = [
        { name: 'Vacaciones', URL: '/comunication/requests/holidays' },
        { name: action == 'add' ? 'Registrar' : 'Actualizar' }
    ]

    return (
        <MainRequets
            pageKey={['holidays']}
            extraBread={ExtraBread}
        >
            <DetailsRequets action={action}/>
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