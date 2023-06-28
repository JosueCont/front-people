import React, { useEffect, useState, useLayoutEffect } from 'react';
import Router, { useRouter } from 'next/router';
import { connect } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import VacantDetails from '../../../../components/jobbank/search/vacant/VacantDetails';
import { getScholarship } from '../../../../redux/jobBankDuck';
import MainSearch from '../../../../components/jobbank/search/MainSearch';
import { message } from 'antd';

const index = ({
    currentNode,
    getScholarship
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        if (!currentNode || redirect) return;
        if (Object.keys(infoVacant)?.length <= 0) return;
        if (currentNode?.id !== infoVacant?.node) {
            setRedirect(true)
            setTimeout(() => {
                message.error('Vacante no encontrada')
                Router.push('/jobbank/search');
            }, 2000)
        }else{
            setRedirect(false)
            setTimeout(()=>{
                setLoading(false)
                return;
            },2000)
        }
    }, [currentNode, infoVacant])

    useEffect(() => {
        if (router.query?.vacant) {
            getInfoVacant(router.query?.vacant)
        }
    }, [router.query?.vacant])

    useEffect(() => {
        if (!currentNode) return;
        getScholarship(currentNode?.id);
    }, [currentNode])

    const getInfoVacant = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setInfoVacant(response.data)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoVacant({})
        }
    }

    return (
        <MainSearch>
            <VacantDetails
                loading={loading}
                infoVacant={loading ? {} : infoVacant}
            />
        </MainSearch>
    )
}

const mapState = (state) => {
    return {
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState, {
    getScholarship
}
)(index);