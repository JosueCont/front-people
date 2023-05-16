import React, { useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import {connect} from "react-redux";
import Calendar from "rc-year-calendar";



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



const DatePickerHoliDays=({withData=false,locale='es',concept=null,...props})=>{
    const [value, setValue] = useState();
    const arrayDates = []

    const validateData=()=>{
        let maxData = concept.value // el valor máximo que puede tener un concepto
        let currentValueData = 0;

        arrayDates.forEach((e)=>{
            debugger;
            currentValueData = currentValueData + parseInt(e.value);
        })
        console.log(concept, currentValueData)
    }

    const onChange=(dates)=>{

        if(dates){
            //validateData()
            let datesArray =dates?.join(",")?.split(',');
            let lastElement = datesArray[datesArray.length - 1];
            let objDate = {date:lastElement,value:1}
            if(withData){
                let value = prompt(`Agregar valor para la fecha ${lastElement}`, 1)
                objDate.value=Number.isInteger(parseInt(value))?parseInt(value):1;
            }
            arrayDates.push(objDate)
            props.onChangeData(arrayDates)
        }else{
            setValue(null)
        }

    }


    return<>
        <DatePicker
            onChange={array => {
                onChange(array)
            }}
            locale={locale==='es'?gregorian_es_lowercase:null}
            {...props}
            value={value}/>
    </>
}

export default DatePickerHoliDays;