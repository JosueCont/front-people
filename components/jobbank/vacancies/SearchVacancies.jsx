import React, { useState } from 'react';
import { Button, Input, Row, Col, message } from 'antd';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { getVacancies } from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';

const SearchVacancies = ({
  currentNode,
  getVacancies
}) => {

    const router = useRouter();
    const [toSearch, setToSearch] = useState('');

    const onFinishSearch = () =>{
        if(toSearch.trim()){
            let query = `&job_position__icontains=${toSearch.trim()}`;
            getVacancies(currentNode.id, query);
        } else deleteFilter();
    }

    const deleteFilter = () =>{
        setToSearch('')
        getVacancies(currentNode.id)
    }

    return (
        <Row gutter={[24,24]}>
            <Col xs={18} sm={18} md={16} lg={12} style={{display: 'flex', gap: '16px'}}>
                <Input
                    value={toSearch}
                    placeholder={'Buscar por nombre'}
                    onChange={e=> setToSearch(e.target.value)}
                />
                <Button icon={<SearchOutlined />} onClick={()=> onFinishSearch()}/>
                <Button icon={<SyncOutlined />} onClick={()=> deleteFilter()} />
            </Col>
            <Col xs={6} sm={6} md={8}  lg={12} style={{display: 'flex', justifyContent: 'flex-end'}}>
                <Button onClick={()=> router.push('/jobbank/vacancies/add')}>Agregar</Button>
            </Col>
        </Row>
    )
}

const mapState = (state) =>{
    return{
        currentNode: state.userStore.current_node
    }
}

export default connect(
    mapState,{
        getVacancies
    }
)(SearchVacancies)