import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getSectors } from '../../../redux/jobBankDuck';
import AutoRegister from '../../../components/jobbank/AutoRegister';
import DetailsClients from '../../../components/jobbank/clients/DetailsClients';

const customer = ({
    currentNode,
    getSectors
}) => {

    const router = useRouter();

    useEffect(()=>{
        if(currentNode) getSectors(currentNode.id);
    },[currentNode])

    return (
        <AutoRegister currentCode={router.query?.code}>
            <div className='content-center'>
                <div style={{width: '70%'}}>
                    <DetailsClients isAutoRegister={true} action='add'/>
                </div>
            </div>
        </AutoRegister>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(mapState, { getSectors })(customer);