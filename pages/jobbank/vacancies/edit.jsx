import React, { useEffect } from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditVancancies from '../../../components/jobbank/vacancies/AddOrEditVancancies';

const edit = () => {
  return (
    <AddOrEditVancancies action='edit'/>
  )
}
export default withAuthSync(edit);