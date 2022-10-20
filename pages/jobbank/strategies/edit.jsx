import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditStrategies from '../../../components/jobbank/strategies/AddOrEditStrategies';

const edit = () => {
  return (
    <AddOrEditStrategies action='edit'/>
  )
}

export default withAuthSync(edit);