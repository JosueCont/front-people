import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import AddOrEditStrategies from '../../../components/jobbank/strategies/AddOrEditStrategies';

const add = () => {
  return (
    <AddOrEditStrategies action='add'/>
  )
}

export default withAuthSync(add);