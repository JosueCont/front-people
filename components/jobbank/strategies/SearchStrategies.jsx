import React, { useState } from 'react';
import {
  SearchOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { Button, Input, Row, Col } from 'antd';
import { connect } from 'react-redux';
import { useRouter } from 'next/router';
import { getStrategies } from '../../../redux/jobBankDuck';

const SearchStrategies = ({
  currentNode,
  getStrategies
}) => {

  const router = useRouter();
  const [toSearch, setToSearch] = useState('');

  const onFinishSearch = () =>{
    if(toSearch.trim()){
      let query = `&product__icontains=${toSearch.trim()}`;
      getStrategies(currentNode.id, query);
    } else deleteFilter();
  }

  const deleteFilter = () =>{
    setToSearch('')
    getStrategies(currentNode.id)
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
        <Button onClick={()=> router.push('/jobbank/strategies/add')}>Agregar</Button>
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
    getStrategies
  }
)(SearchStrategies)