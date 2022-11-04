import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { getSectors } from '../../../redux/jobBankDuck';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import RegisterClient from '../../../components/jobbank/clients/RegisterClient';

const client = ({
    currentNode,
    getSectors
}) => {

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    return (
        <AutoRegister>
            <RegisterClient/>
        </AutoRegister>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getSectors })(client);