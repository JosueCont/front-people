import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../libs/auth';
import MainIndexTM from '../../../components/timeclock/MainIndexTM';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';

const index = ({
    currentNode,
    currentUser
}) => {

    const router = useRouter();

    return (
        <MainIndexTM
            pageKey={["tm_logs"]}
            extraBread={[{ name: 'Logs de eventos' }]}
        >
        </MainIndexTM>
    )
}

const mapState = (state) => {
    return {
        currentUser: state.userStore.user,
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState, {}
)(withAuthSync(index));