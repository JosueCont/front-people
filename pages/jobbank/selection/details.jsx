import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import ViewEditSelection from '../../../components/jobbank/selection/ViewEditSelection';

const Details = () => {
  return (
    <ViewEditSelection action='edit'/>
  )
}

export default withAuthSync(Details)