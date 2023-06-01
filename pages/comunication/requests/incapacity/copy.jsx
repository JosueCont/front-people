import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../../libs/auth';
import { getPersonsCompany } from '../../../../redux/UserDuck';
import MainRequets from '../../../../components/comunication/MainRequets';
import WebApiPeople from '../../../../api/WebApiPeople';
import WebApiFiscal from '../../../../api/WebApiFiscal';
import SearchPermission from '../../../../components/comunication/permission/SearchPermission';
import TableIncapacity from '../../../../components/comunication/inpacity/TableIncapacity';

const index = ({
    currentNode,
    getPersonsCompany
}) => {

    const [loading, setLoading] = useState(false);
    const [disabilities, setDisabilities] = useState([]);

    const [loadDisability, setLoadDisability] = useState(false);
    const [listDisability, setListDisability] = useState([]);

    useEffect(() => {
        if (!currentNode) return;
        getDisabilities(currentNode?.id)
    }, [currentNode])

    useEffect(() => {
        if (!currentNode) return;
        getPersonsCompany(currentNode)
    }, [currentNode])

    useEffect(() => {
        getTypeDisability()
    }, [])

    const getDisabilities = async (node, query = '') => {
        try {
            setLoading(true)
            let response = await WebApiPeople.getDisabilitiesRequest(node, query);
            // console.log("🚀 ~ file: copy.jsx:25 ~ getDisabilities ~ response:", response)
            setDisabilities(response.data)
            setLoading(false)
        } catch (e) {
            console.log(e)
            setLoading(false)
            setDisabilities([])
        }
    }

    const getTypeDisability = async () => {
        try {
            setLoadDisability(true)
            let response = await WebApiFiscal.getDisabilityType();
            setListDisability(response.data?.results)
            setLoadDisability(false)
        } catch (e) {
            console.log(e)
            setListDisability([])
            setLoadDisability(false)
        }
    }

    return (
        <MainRequets
            pageKey={['incapacity']}
            extraBread={[{ name: 'Incapacidad' }]}
        >
            {/* Se utiliza el mismo componente de permisos para filtrar,
                ya que los filtros son los mismos, crear nuevo componente en caso
                de que los filtros de incacidad cambien.
            */}
            <SearchPermission />
            <TableIncapacity
                loading={loading}
                disabilities={disabilities}
                loadDisability={loadDisability}
                listDisability={listDisability}
            />
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
)(withAuthSync(index))