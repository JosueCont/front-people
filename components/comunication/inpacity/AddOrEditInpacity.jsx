import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getPersonsCompany } from '../../../redux/UserDuck';
import MainRequets from '../MainRequets';
import DetailsIncapacity from './DetailsIncapacity';

const AddOrEditIncapacity = ({
    action = 'add',
    currentNode,
    getPersonsCompany
}) => {

    useEffect(()=>{
        if(!currentNode) return;
        getPersonsCompany(currentNode?.id)
    },[currentNode])

    const ExtraBread = [
        {name: 'Incapacidad', URL: '/comunication/requests/incapacity'},
        {name: action == 'add' ? 'Registrar' : 'Actualizar'}
    ]

    return (
        <MainRequets
            pageKey={['incapacity']}
            extraBread={ExtraBread}
        >
            <DetailsIncapacity action={action}/>
        </MainRequets>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {
        getPersonsCompany
    }
)(AddOrEditIncapacity)