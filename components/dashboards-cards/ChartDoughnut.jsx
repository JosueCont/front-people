import React, {useEffect, useState} from 'react'
import { Doughnut } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import {Breadcrumb, Row, Col, Typography, Button, Divider, Card, Dropdown, Menu} from 'antd';

const ChartDoughnut = ({title, icon, ...props}) => {
    const {Title, Text} = Typography

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                position: 'left'
            },
        },
    };


    // const data = {
    //     labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    //     datasets: [
    //         {
    //         label: '# of Votes',
    //         data: [12, 19, 3, 5, 2, 3],
    //         backgroundColor: [
    //             'rgba(255, 99, 132, 0.2)',
    //             'rgba(54, 162, 235, 0.2)',
    //             'rgba(255, 206, 86, 0.2)',
    //             'rgba(75, 192, 192, 0.2)',
    //             'rgba(153, 102, 255, 0.2)',
    //             'rgba(255, 159, 64, 0.2)',
    //         ],
    //         borderColor: [
    //             'rgba(255, 99, 132, 1)',
    //             'rgba(54, 162, 235, 1)',
    //             'rgba(255, 206, 86, 1)',
    //             'rgba(75, 192, 192, 1)',
    //             'rgba(153, 102, 255, 1)',
    //             'rgba(255, 159, 64, 1)',
    //         ],
    //         borderWidth: 1,
    //         },
    //     ],
    //     };
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
            {
              props.data ?   <Doughnut options={options} data={props.data} /> : null
            }

        </>
        
    )
}

export default ChartDoughnut
