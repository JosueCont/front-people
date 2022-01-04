import React, {useEffect, useState} from 'react'
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {Breadcrumb, Row, Col, Typography, Button, Divider, Card, Dropdown, Menu} from 'antd';

const ChartBars = ({title, icon, data, ...props}) => {
    const {Title, Text} = Typography

    const options = {
        responsive: true,
        plugins: {
            legend: null,
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <>
            <div className="title_card_dashboard">
                <Text>
                    <span className="card_element_icon">
                        {icon}
                    </span>
                    <span className="card_element_text">
                        {title}
                    </span>
                </Text>
            </div>
            <Bar options={options} data={data} /> 
        </>
    )
}

export default ChartBars
