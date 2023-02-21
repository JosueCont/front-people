import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { connect } from 'react-redux';
import MainIndexJB from '../MainIndexJB';
import { getSectors } from '../../../redux/jobBankDuck';
import { deleteFiltersJb } from '../../../utils/functions';
import DetailsPreselection from './DetailsPreselection';

const ViewEditSelection = ({
  action = 'edit',
  currentNode,
  getSectors
}) => {

  const router = useRouter();
  const [newFilters, setNewFilters] = useState({});
  const deleteKeys = ['id', 'vacant', 'tab'];

  useEffect(()=>{
    if(Object.keys(router.query).length <= 0) return;
    let filters = deleteFiltersJb(router.query, deleteKeys);
    setNewFilters(filters);
},[router.query])

useEffect(()=>{
    if(currentNode) getSectors(currentNode.id);
},[currentNode])

  const ExtraBread = [
    {name: 'Proceso de selección', URL: '/jobbank/selection'},
    {name: action == 'add' ? 'Nuevo' : 'Detalle de proceso de selección'}
]

  return (
    <MainIndexJB
        pageKey='jb_selection'
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
)(ViewEditSelection);

