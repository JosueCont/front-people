import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import MainIndexJB from '../MainIndexJB';
import { getSectors } from '../../../redux/jobBankDuck';
import { deleteFiltersJb } from '../../../utils/functions';
import DetailsPreselection from './DetailsPreselection';

const ViewEditPreSelection = ({
  action = 'edit',
  currentNode,
  getSectors
}) => {

  const router = useRouter();
  const [newFilters, setNewFilters] = useState({});
  const deleteKeys = ['id', 'tab'];

  useEffect(()=>{
    if(Object.keys(router.query).length <= 0) return;
    let filters = deleteFiltersJb(router.query, deleteKeys);
    setNewFilters(filters);
},[router.query])

useEffect(()=>{
    if(currentNode) getSectors(currentNode.id);
},[currentNode])

  const ExtraBread = [
    {name: 'Preselección', URL: '/jobbank/preselection'},
    {name: action == 'add' ? 'Nuevo' : 'Detalle de preselección'}
]

  return (
    <MainIndexJB
        pageKey='jb_preselection'
        extraBread={ExtraBread}
        newFilters={newFilters}
    >
        <DetailsPreselection 
          action={action}
          newFilters={newFilters}
        />
    </MainIndexJB>
)

}

const mapState = (state) =>{
  return{
      currentNode: state.userStore.current_node
  }
}

export default connect(
  mapState, { getSectors }
)(ViewEditPreSelection);

