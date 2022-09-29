import React, {useState, useEffect} from 'react'
import moment from 'moment';
import { Global, css } from '@emotion/core';

const Calendar = ({currentMonth = '01', ...props}) => {
    const [events, setEvents] = useState([])
    const [currentInterval, setCurrentInterval] = useState([])
    const [eventShow, setEventShow] = useState(false);
    const [days, setDays] = useState([])

    currentMonth = ("0" + currentMonth).toString().slice(-2);


    const getCalendar = () =>{
        moment.locale("es-mx");
        /* let currentMonth = moment().format("MM"); */

        let currentYear = moment().format("YYYY");

        const start_date = moment(`${currentYear}-${currentMonth}-01`);
        

        let result = [];
        while (start_date.format("MM") == currentMonth) {
            result.push({
                date: `${start_date.format("YYYY-MM-DD")}`,
                day: start_date.day(),
                events: [],
            });
            start_date.add(1, "day");
        }

        let prevArray = [];
        for (let index = 0; index < result[0].day; index++) {
            prevArray.push({ disabled: true });
        }
        setCurrentInterval([...prevArray, ...result]);
    }

    useEffect(() => {
        setDays([
            
        ])
      getCalendar();
    }, [])

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
        `}
      />
    <div class="flex flex-wrap">
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

export default Calendar