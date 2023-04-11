import React, { useEffect, useState } from 'react';
import MainLayout from '../../../layout/MainLayout_user';
import { Content } from 'antd/lib/layout/layout';
import { withAuthSync } from '../../../libs/auth';
import ProfileForm from '../../../components/user/profile/ProfileForm';

const index = () => {
  return (
    <MainLayout currentKey='dashboard'>
        <Content className="site-layout">
            <ProfileForm/>
        </Content>
    </MainLayout>
  )
}

export default withAuthSync(index);