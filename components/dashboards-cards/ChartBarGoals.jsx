import React,{useEffect,useState} from "react";
import { Bar } from "react-chartjs-2";
import { Image, Col,Typography } from "antd";
const {Text} = Typography;

const ChartBarGoals = ({dataChart, }) => {

    const [dataCharts, setDataChart] = useState([]);
    useEffect(() => {
       
      }, [dataChart])


    const options = {
        responsive: true,
        indexAxis:'y',
        plugins: {
            legend: null,
        },
        scales: {
            x: {
                beginAtZero: true,
                precision: 0
            }
        }
    }

    const data = {
        labels: ['','','',''],
        datasets: [
            {
                 data: dataChart.map((item) => item.goals_completed),
                    backgroundColor: dataChart.map((item) =>
                      item.goals === item.goals_completed ? "#F5AC00" : "#B45F06"
                    ),
                //backgroundColor: [
                //    "#F5AC00",
                //    "#B45F06",
                //],
                //borderColor:[ "#F5AC00","#B45F06",],
                //borderWidth: 1,
              },
              {
                //label: "Objetivos Totales",
                data: dataChart.map((item) => item.goals),
                backgroundColor: "lightgray",
              },
        ]

    }
    return(
        <>
            <div style={{marginLeft:10}}>
                <Bar data={data} options={options}/>

            </div>
            <div style={{display:'flex', flexDirection:'column',position:'absolute',left:0, top:140, width:50,}}>
                {dataChart.map((item,index) => (
                    <Col style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                        <Image src={item.icon.url} style={{width:20, height:25, }}/>
                        <Text style={{fontSize:6}}>{item.name}</Text>
                    </Col>
                ))}

            </div>
        </>
    )
}

export default ChartBarGoals;