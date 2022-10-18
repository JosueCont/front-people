import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditStrategies from '../../../components/jobbank/strategies/AddOrEditStrategies';

const add = () => {

  const router = useRouter();

  useEffect(()=>{
    router.prefetch('/jobbank/strategies/edit');
  },[])

  return (
    <AddOrEditStrategies action='add'/>
  )
}

export default withAuthSync(add);