import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import VacantDetails from '../../../../components/jobbank/search/vacant/VacantDetails';
import AutoRegister from '../../../../components/jobbank/AutoRegister';
import { getScholarship } from '../../../../redux/jobBankDuck';
import { LayoutSearch } from '../../../../components/jobbank/search/SearchStyled';

const index = ({
    currentNode,
    getScholarship
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoVacant, setInfoVacant] = useState({});

    useEffect(() => {
        if (router.query?.vacant) {
            getInfoVacant(router.query?.vacant)
        }
    }, [router.query?.vacant])

    useEffect(() => {
        if (Object.keys(infoVacant).length <= 0) return;
        getScholarship(infoVacant?.node)
    }, [infoVacant])

    const getInfoVacant = async (id) => {
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoVacant(id);
            setInfoVacant(response.data)
            setTimeout(() => {
                setLoading(false)
            }, 1500)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setInfoVacant({})
        }
    }

    return (
        <LayoutSearch>
            <AutoRegister
                currentNode={infoVacant?.node}
                logoAlign='right'
            >
                <VacantDetails
                    loading={loading}
                    infoVacant={infoVacant}
                />
            </AutoRegister>
        </LayoutSearch>
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