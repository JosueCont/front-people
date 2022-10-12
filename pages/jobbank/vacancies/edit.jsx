import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditVancancies from '../../../components/jobbank/vacancies/AddOrEditVancancies';
import { getInfoVacant } from '../../../redux/jobBankDuck';
import { useRouter } from 'next/router';

const edit = ({
  currentNode,
  getInfoVacant
}) => {

  const router = useRouter();

  useEffect(()=>{
    if(router.query.id){
      getInfoVacant(router.query.id)
    }
  },[router])

  return (
    <AddOrEditVancancies action={'edit'}/>
  )
}

const mapState = (state) =>{
  return{
    currentNode: state.userStore.current_node
  }
}

export default connect(
  mapState,{
    getInfoVacant
  }
)(withAuthSync(edit));