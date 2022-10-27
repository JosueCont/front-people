import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditVancancies from '../../../components/jobbank/vacancies/AddOrEditVancancies';

const add = () => {

  const router = useRouter();

  useEffect(()=>{
    router.prefetch('/jobbank/vacancies/edit');
  },[])

  return (
    <AddOrEditVancancies action='add'/>
  )
}

export default withAuthSync(add);