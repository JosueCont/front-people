import React, { useEffect, useState } from 'react';
import { withAuthSync } from '../../../../libs/auth';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import SearchHistory from '../../../../components/jobbank/publications/SearchHistory';
import TableHistory from '../../../../components/jobbank/publications/TableHistory';
import { deleteFiltersJb } from '../../../../utils/functions';
import { getConnectionsOptions } from '../../../../redux/jobBankDuck';
import MainIndexJB from '../../../../components/jobbank/MainIndexJB';
import WebApiJobBank from '../../../../api/WebApiJobBank';
import moment from 'moment';

const index = ({
    currentNode,
    getConnectionsOptions
}) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoPublication, setInfoPublication] = useState({});
    const [infoHistory, setInfoHistory] = useState([]);
    const [newFilters, setNewFilters] = useState({});
    const deletekeys = ['id', 'dates', 'account'];

    useEffect(()=>{
        if(Object.keys(router.query).length <= 0) return;
        let filters = deleteFiltersJb(router.query, deletekeys);
        setNewFilters(filters);
    },[router.query])

    useEffect(()=>{
        if(currentNode){
            getConnectionsOptions(currentNode.id, '&conection_type=1');
        }
    },[currentNode])

    useEffect(()=>{
        if(!router.query?.id) return;
        getInfoHistory(router.query?.id)
    },[router.query])

    const getInfoHistory = async (id) =>{
        try {
            setLoading(true)
            let response = await WebApiJobBank.getInfoPublication(id);
            setInfoPublication(response.data);
            onFilterHistory(response.data?.history)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const searchItems = (size, list) =>{
        let range = router.query?.dates?.split(',');
        return list?.filter(item =>{
            let date = moment(item.timestamp).format('DD-MM-YYYY');
            let check_start = range && date >= range[0];
            let check_end = range && date <= range[1];
            let check_code = item.code_post == router.query?.account;
            if(size == 2 && check_start && check_end && check_code) return true;
            if(size == 1 && check_start && check_end) return true;
            if(size == 1 && check_code) return true;
            return false;
        });
    }

    const onFilterHistory = (list) =>{
        let valid = ['dates','account'];
        let keys = Object.keys(router.query);
        let results = keys.filter(item => valid.includes(item));
        if(results.length > 0){
            let records = searchItems(results.length, list);
            setInfoHistory(records);
            setLoading(false)
            return;
        }
        setInfoHistory(list);
        setLoading(false)
    }

    const ExtraBread = [
        {name: 'Publicaciones', URL: '/jobbank/publications'},
        {name: 'Historial'}
    ]

    return (
        <MainIndexJB
            pageKey='jb_publications'
            newFilters={newFilters}
            extraBread={ExtraBread}
        >
            <SearchHistory
                infoPublication={infoPublication}
                newFilters={newFilters}
            />
            <TableHistory
                loading={loading}
                infoHistory={infoHistory}
            />
        </MainIndexJB>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node,
    }
}

export default connect(
    mapState,{
        getConnectionsOptions
    }
)(withAuthSync(index));