import React, {useState, useEffect} from 'react'
import moment from 'moment';
import { Global, css } from '@emotion/core';
import {
    LeftOutlined, RightOutlined
} from "@ant-design/icons";
import { connect } from "react-redux";
import { exit } from 'process';

const Calendar = ({ reportPerson, ...props}) => {
    const [events, setEvents] = useState([])
    const [startDate, setStartDate] = useState(null)
    const [currentInterval, setCurrentInterval] = useState([])
    const [currentMonth, setCurrentMonth] = useState(null)
    const [currentYear, setCurrentYear] = useState(null)
    const [eventShow, setEventShow] = useState(false);
    const [days, setDays] = useState([])

    /* currentMonth = ("0" + currentMonth).toString().slice(-2); */

    moment.locale("es-mx");

    useEffect(() => {
      console.log('reportPerson',reportPerson);
    }, [reportPerson])
    

    const getCalendar = () =>{
        
        console.log('cm',currentMonth);
        console.log('cy',currentYear);
        console.log('sd', startDate );
    
        let result = [];
        while (startDate.format("MM") === currentMonth) {
            result.push({
                date: `${startDate.format("YYYY-MM-DD")}`,
                day: startDate.day(),
                events: [],
            });
            startDate.add(1, "day");
        }

        let prevArray = [];
        if(result.length > 0){
            for (let index = 0; index < result[0].day; index++) {
                prevArray.push({ disabled: true });
            }
            setCurrentInterval([...prevArray, ...result]);
        }
        
    }

    useEffect(() => {
        let cm = moment().format("MM");
        setCurrentMonth(cm)

        let cy = moment().format("YYYY");
        setCurrentYear(cy);

        const start_date = moment(`${cy}-${cm}-01`);
        setStartDate(start_date);
        /* if(cy && cm){
            getCalendar(cm, cy);   
        } */
    }, [])

    useEffect(() => {
        if(currentMonth && startDate){
            console.log('get_calendar');
            getCalendar()
        }
        
    }, [startDate])
    

    const validateDay = (date) =>  {
        let color = {};
        /* console.log('date',date) */
        if (reportPerson.data){
            reportPerson?.data[0]?.per_day?.map(day => {
            /* console.log('day', day)
            console.log('day-format',moment(day.day).add(1, 'day') .format("YYYY-MM-DD")) */
            if(moment(day.day).add(1, 'day') .format("YYYY-MM-DD") === date){
                if(day.last.color){
                    console.log('OK => #', day.last.color, " =>", day.day );
                    color = {backgroundColor: `#${day.last.color}`}
                }
                
            }
        })
        }
        
        return color;
    }

    const prevMonth = () => {
        console.log('currentMonth',currentMonth);
        let newDate = moment(startDate).subtract(2,"month");
        setStartDate(newDate)
        setCurrentMonth(newDate.format("MM"))
        setCurrentYear(newDate.format("YYYY"))
    }

    const nextMonth = () => {
        console.log('currentMonth',currentMonth);
        let newDate = moment(startDate);
        setStartDate(newDate)
        setCurrentMonth(newDate.format("MM"))
        setCurrentYear(newDate.format("YYYY"))
    }


  return (
      <>
      <Global 
        styles={css`
            .flex{
                display:flex;
            }
            .flex-wrap{
                flex-wrap: wrap;
            }
            .cell-day{
                width: calc(100%/7) !important;
                text-align: center;
                padding: 10px;
            }
            .title-date{
                padding: 10px;
            }
            .calendar_controls_content{
                padding: 0 10px;
                display:flex;
                justify-content: space-between;
                width:100%;
            }
            .calendar_controls{
                font-size: 20px;
                cursor:pointer;
            }
        `}
      />
    <div class="flex flex-wrap">
        <div className='calendar_controls_content'>
            <div className='calendar_controls'>
                <LeftOutlined onClick={() => prevMonth()} />
            </div>
            <div style={{ fontSize:20 }}>
                {moment(currentMonth).format("MMMM").toUpperCase()} ,
                {currentYear}
            </div>
            <div className='calendar_controls'>
                <RightOutlined onClick={() => nextMonth() } />
            </div>
            
        </div>
        <div class="flex flex-wrap calendarDaysHeader">
              <div class="cell-day brtl-1">Domingo</div>
              <div class="cell-day">Lunes</div>
              <div class="cell-day">Martes</div>
              <div class="cell-day">Miercoles</div>
              <div class="cell-day">Jueves</div>
              <div class="cell-day">Viernes</div>
              <div class="cell-day brtr-1">Sabado</div>
          </div>
        {currentInterval.map((day, idx) => {
            return (
                <div class="cell-day" >
                    {!day.disabled && (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                position: "relative",
                            }}
                        >
                            <span
                                className={`title-date ${
                                    day.events.length === 1
                                        ? "title-day-white"
                                        : "title-day-gray"
                                }`}
                                style={validateDay(day.date)}
                            > 
                                {moment(day.date).format("DD")}
                            </span>
                        </div>
                    )}
                </div>
            );
        })}
    </div>
    </>
  )
}

const mapState = (state) => {
    return {
      reportPerson: state.ynlStore.reportPerson,
    };
};

export default connect(mapState)(Calendar)