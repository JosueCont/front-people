import React from 'react'
import { Typography } from 'antd'
import EventCard from './EventCard';
import {CrownOutlined} from '@ant-design/icons';

const WeekCard = ({  ...props}) => {
    const {Text, Title} = Typography;

    return (
        <div>
            <Title level={3} style={{textAlign:'end'}} >
                <small>
                    Semana
                </small>
                45
            </Title>
            <EventCard buttonIcon={<CrownOutlined />} />
        </div>
    )
}

export default WeekCard
