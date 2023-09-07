import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import MainRequets from '../MainRequets';
import DetailsPermission from './DetailsPermission';

const AddOrEditPermission = ({
    action = 'add',
    currentNode,
}) => {

    const ExtraBread = [
        {name: 'Permisos', URL: '/comunication/requests/permission'},
        {name: action == 'add' ? 'Registrar' : 'Actualizar'}
    ]

    return (
        <MainRequets
            pageKey={['permission']}
            extraBread={ExtraBread}
        >
            <DetailsPermission action={action}/>
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(mapState)(AddOrEditPermission)