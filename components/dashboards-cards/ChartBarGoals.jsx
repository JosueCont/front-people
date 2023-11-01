import React,{useEffect,useState} from "react";
import { Bar } from "react-chartjs-2";
import { Image, Col,Typography } from "antd";
import { Global, css } from "@emotion/core";
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
        },
    }

    const data = {
        labels: ['','','',''],
        datasets: [
            {
                 data: dataChart.map((item) => item.goals),
                    backgroundColor:"#F5AC00" /*dataChart.map((item) =>
                      item.goals === item.goals_completed ? "#F5AC00" : "#B45F06"
                    ),*/
                //backgroundColor: [
                //    "#F5AC00",
                //    "#B45F06",
                //],
                //borderColor:[ "#F5AC00","#B45F06",],
                //borderWidth: 1,
              },
              {
                //label: "Objetivos Totales",
                data: dataChart.map((item) => item.goals_completed),
                backgroundColor: "#B45F06",
              },
        ]

    }
    return(
        <div >
        <Global 
        styles={css`
        .cont-icons-chart{
            display: flex; 
            flex-direction: column;
            position: absolute;
            left:0; 
            top:140px; 
            width:50px;
            height:50%;
            
            
          }
        .cont-image{
            display: flex;
            flex-direction: column;
            justify-content: center; 
            align-items: center;
        }
        .icon{
            width: 20px;
            height: 25px
        }
        .lbl{
            font-size:6px
        }
        
        @media (min-width: 425px) {
            .lbl{
                font-size:6px
            }  
            .icon{
                width: 20px;
                height: 25px
            }
            .cont-icons-chart{
                top:140px;
            }
        }
        @media (min-width: 570px){
            .icon{
                width: 30px;
                height: 35px
            }
        }
        @media (min-width: 770px) {
            .cont-icons-chart{
                top:140px; 
            }
            .icon{
                width: 20px;
                height: 25px
            }
        }
        @media (min-width: 1024px) {
            .cont-icons-chart{
                top:140px; 
                
            }
            .icon{
                width: 20px;
                height: 25px
            }
            .lbl{
                font-size:6px
            }
        }
        @media (min-width: 1144px){
            .cont-icons-chart{
                top:135px; 
            }
            .lbl{
                font-size:6px
            }
            .icon{
                width: 20px;
                height: 25px
            }
            .cont-image{
                margin-bottom:8px
            }
        }
        @media (min-width: 1500px){
            .icon{
                width: 30px;
                height: 35px
            }
        }
        @media (min-width: 2500px){
            .cont-icons-chart{
                top:180px; 
            }
            .lbl{
                font-size:10px
            }
            .icon{
                width: 45px;
                height: 50px
            }
            .cont-image{
                margin-bottom:100px
            }
        }
        `}
        />

            <div style={{marginLeft:10, }}>
                <Bar data={data} options={options}  style={{minHeight:200}}/>

            </div>
          
            <div className="cont-icons-chart" /*style={{display:'flex', flexDirection:'column',position:'absolute',left:0, top:140, width:50,}}*/>
                {dataChart.map((item,index) => (
                    <Col className="cont-image" /*style={{display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}*/>
                        <Image className='icon' src={item.icon.url} /*style={{width:20, height:25, }}*/ preview={false}/>
                        <Text className="lbl" /*style={{fontSize:6}}*/>{item.name}</Text>
                    </Col>
                ))}

            </div>

        </div>
    )
}

export default ChartBarGoals;