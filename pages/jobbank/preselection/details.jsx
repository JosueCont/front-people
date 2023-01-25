import React from 'react';
import { withAuthSync } from '../../../libs/auth';
import ViewEditPreSelection from '../../../components/jobbank/preselection/ViewEditPreSelection';

const Details = () => {
  return (
    <ViewEditPreSelection action='edit'/>
  )
}

export default withAuthSync(Details)