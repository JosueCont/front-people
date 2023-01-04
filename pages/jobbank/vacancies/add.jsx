import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditVancancies from '../../../components/jobbank/vacancies/AddOrEditVancancies';

const add = () => {
  return (
    <AddOrEditVancancies action='add'/>
  )
}

export default withAuthSync(add);