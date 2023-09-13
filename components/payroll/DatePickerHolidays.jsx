import React, { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {connect} from "react-redux";
import Calendar from "rc-year-calendar";
import { Global, css } from "@emotion/core";
import { Space, Typography } from "antd";



const gregorian_es_lowercase = {
    name: "gregorian_en_lowercase",
    months: [
        ["enero", "en"],
        ["febrero", "feb"],
        ["marzo", "mar"],
        ["abril", "abr"],
        ["mayo", "may"],
        ["junio", "jun"],
        ["julio", "jul"],
        ["agosto", "ago"],
        ["septiembre", "sep"],
        ["octubre", "oct"],
        ["noviembre", "nov"],
        ["diciembre", "dic"],
    ],
    weekDays: [
        ["sábado", "sab"],
        ["domingo", "dom"],
        ["lunes", "lun"],
        ["martes", "mar"],
        ["miercoles", "mie"],
        ["jueves", "jue"],
        ["viernes", "vie"],
    ],
    digits: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"],
    meridiems: [
        ["AM", "am"],
        ["PM", "pm"],
    ],
};



const DatePickerHoliDays=({withData=false, data_config=null, locale='es',concept=null, daysActives=[], disabledDays=[], showCount=false, ...props})=>{
    const [value, setValue] = useState([]); 
    const [arrayDates, setArrayDates] = useState([])
    const [isFestive, setIsFestive] = useState(false)
    const [isRest, setIsRest] = useState(false)
    const [isSunday, setIsSunday] = useState(false)
    const [disability, setDisability] = useState(false)
    const [count, setCount] = useState(0)
    const [showError, setShowError] = useState(false)
    const [openCalendar, setOpenCalendar] = useState(true) // para abrir todo el calendario
    const [typeRange, setTypeRange] = useState(false)
    const [typeMultiple, setMultiple] = useState(true)

    const { Text } = Typography

    useEffect(() => {
        if(concept?.description?.toLowerCase().includes("dominical")){
            setIsSunday(true)
            console.log('concepto', concept)
            setOpenCalendar(false)
        }
    }, [concept])


    

    useEffect(() => {
        let n = 0
        arrayDates.map(item => {
            n += item.value
        })
        setCount(n)
        props.onChangeData(arrayDates)
    }, [arrayDates])

    

    const dateSelected = (dateFocused, dateClicked) => {
        let current_date = dateClicked?.format?.()
        /* Validamos si la fecha no esta seleccionada */
        if(value.includes(current_date)){
            /* Quitamos la fecha y los dias seleccionados */
            let listDates = [...arrayDates]
            let new_list = listDates.filter(item => item.date !== current_date)
            let newDates = new_list.map(item =>  item.date)
            setValue(newDates)
            setArrayDates(new_list)
        }else{
            /* horas acomuladas */
            let hours = 0
            concept.dates?.map(item => {
                hours += withData ? item.value : 1
            })
            /* Validamos si ya llego al total de horas */
            if(hours >= concept.value){
                alert("No puedes agregar mas datos")
                return
            }

            /* Preparamos el obj */
            let objDate = {date:current_date,value:1}

            if(withData){
                let value = prompt(`Agregar valor para la fecha ${current_date}`, 1)
                if(concept.code==='P119' && value > 3){
                    alert("Solo puedes agregar maximo 3 horas por dia")
                    return
                }else if((parseInt(value) + parseInt(hours)) > concept.value ) {
                    alert(`Solo puedes agregar ${concept.value - hours} hora(s) más`)
                    return
                }else{
                    objDate.value=Number.isInteger(parseInt(value))?parseInt(value):1;
                }
            }
            setArrayDates(dates => [...dates, objDate ])
            setValue(dates => [...dates, current_date ])
        }    
    }
    


    function CustomInput({ onFocus }) {
        return (
          <input
            onFocus={onFocus}
            value={value}
          />
        )
      }


    return<>
        <Global styles={css`
                .marker{
                    background-color: #0074d9;
                    box-shadow: 0 0 3px #8798ad;
                    color: #fff;   
                }

                .no_marker{
                    background: none !important;
                    color: black !important;
                    box-shadow: none !important;
                }
            `
        } />
        <Space align="start">
            <div>
                <DatePicker
                    onFocusedDateChange={dateSelected}
                    locale={locale==='es'?gregorian_es_lowercase:null}
                    {...props}
                    range={typeRange}
                    multiple={typeMultiple}
                    value={value}
                    render={<CustomInput />}
                    mapDays={( { date, today, selectedDate, currentMonth, isSameDate }) => {

                        let propsDate = {} 
                        let d = ("0"+date.day).slice(-2)
                        let m = ("0"+date.month.number).slice(-2)
                        let y = date.year

                        let format_date = y+"-"+m+"-"+d
                        let current = date?.format?.()

                        if(openCalendar){
                            //calendario abierto
                        }
                        else if(isSunday){
                            if(date?.weekDay?.number != '1'){
                                propsDate.disabled = true
                                return propsDate
                            }
                        }
                        

                        
                        /* Validamos si esta seleccionado para agregarle la clase para marcarlo */
                        let exist = value.includes(current)
                        if (exist){
                            propsDate.className = "marker"
                        }else{
                            propsDate.className = "no_marker"
                        }
                        return propsDate
                    }}
                /><br/>
                {
                    showError === true && 
                    (<Text type="danger" >
                        Datos incompletos
                    </Text>)
                }
                
            </div>
            <span>
            ({count})
            </span>
        </Space>
    </>
}

export default DatePickerHoliDays;