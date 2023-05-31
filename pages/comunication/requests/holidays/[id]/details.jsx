import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../../libs/auth';
import MainRequets from '../../../../../components/comunication/MainRequets';
import InfoRequests from '../../../../../components/comunication/requets/InfoRequests';
import { getPersonsCompany } from '../../../../../redux/UserDuck';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    // useEffect(() => {
    //     if (currentNode) {
    //         getPersonsCompany(currentNode.id);
    //     };
    // }, [currentNode])

    const ExtraBread = [
        { name: 'Vacaciones', URL: '/comunication/requests/holidays' },
        { name: 'Detalle'}
    ]

    return (
        <MainRequets
            pageKey={['holidays']}
            extraBread={ExtraBread}
        >
            <InfoRequests/>
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
)(withAuthSync(index));