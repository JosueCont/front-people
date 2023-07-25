import React, {useEffect, useState, useLayoutEffect, useMemo, useRef} from 'react';
import MyModal from '../../../common/MyModal';
import { Row, Col } from 'antd';
import dynamic from 'next/dynamic';
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  } from 'chart.js';
import { Radar } from 'react-chartjs-2';
import zoomPlugin from 'chartjs-plugin-zoom';
import { actions } from './hook/useChart';

ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    zoomPlugin
);

const ViewChart = ({
    visible = false,
    close = ()=>{},
    infoReport = [],
    typeReport = 'p',
    isModal = true
}) => {

    const config = { labels: [], datasets : [] };
    const [fullName, setFullName] = useState('');
    const [parameters, setParameters] = useState(config);
    const [activeCircular, setActiveCircular] = useState(false);

    useLayoutEffect(()=>{
        if(infoReport?.length > 0 && (visible || !isModal)) generateConfig();
        else setParameters(config);
    },[infoReport])

    // const getCompatibility = (value, string = true) => {
    //     if(typeof(value) == 'string') return value;
    //     let num = value.toFixed(2);
    //     return string ? `${num}%` : num;
    // }

    // const getInfoP = (args) =>{
    //     let { nameLabels, levelsPerson } = args;
    //     const { fullName, data } = infoReport?.at(-1);
    //     if(data?.length <=2) setActiveCircular(true);
    //     setFullName(fullName);

    //     data?.map(item =>{
    //         nameLabels.push(item.competence.name);
    //         levelsPerson.push(item.level);
    //     })

    //     return {
    //         nameLabels,
    //         levelsPerson,
    //         setNamePerson: 'Nivel'
    //     };
    // }

    // const getInfoPP = (args) =>{
    //     let { nameLabels, levelsPerson, levelsProfile } = args;
    //     const { profiles, persons: { fullName } } = infoReport?.at(-1);
    //     const { name, compatibility, competences } = profiles?.at(-1);

    //     if(competences.length <=2) setActiveCircular(true);
    //     setFullName(`${fullName} (${name} - ${getCompatibility(compatibility)})`);

    //     competences.map(item =>{
    //         nameLabels.push([item.name, getCompatibility(item.compatibility)]);
    //         levelsPerson.push(item.level_person);
    //         levelsProfile.push(item.level_profile);
    //     })
        
    //     return {
    //         nameLabels,
    //         levelsPerson,
    //         levelsProfile,
    //         setNamePerson: 'Persona',
    //         setNameProfile: 'Perfil',
    //         withProfile: true
    //     }
    // }

    // const getInfoPSP = (args) =>{
    //     let { nameLabels, levelsPerson } = args;
    //     const { profile, data } = infoReport.at(-1);
    //     if(data?.length <=2) setActiveCircular(true);
    //     setFullName(profile?.at(-1).name);

    //     data?.map(item=>{
    //         let compatibility = item.profiles?.at(-1)?.compatibility;
    //         let percent = getCompatibility(compatibility, false);
    //         levelsPerson.push(percent);
    //         nameLabels.push(item.persons.fullName);
    //     })
    //     return {
    //         nameLabels, 
    //         levelsPerson,
    //         setNamePerson: 'Compatibilidad'
    //     }
    // }

    // const getInfoPPS = (args) =>{
    //     let { nameLabels, levelsProfile } = args;
    //     const { fullName, data } = infoReport?.at(-1);
    //     if(data?.length <=2) setActiveCircular(true);
    //     setFullName(fullName);

    //     data?.map(item =>{
    //         let percent = getCompatibility(item.compatibility, false);
    //         levelsProfile.push(percent);
    //         nameLabels.push(item.name);
    //     })
        
    //     return {
    //         nameLabels,
    //         levelsProfile,
    //         setNameProfile: 'Compatibilidad',
    //         withPerson: false,
    //         withProfile: true
    //     }
    // }

    // const getInfoPSC = (args) =>{
    //     let { nameLabels } = args;
    //     let valueCompetence = {};
    //     let dataRandom = [];

    //     const { profile, data } = infoReport?.at(-1);
    //     if(data?.length <=2) setActiveCircular(true);
    //     setFullName(profile?.at(-1).name);

    //     data?.map(item =>{
    //         let { compatibility,  competences} = item.profiles?.at(-1);
    //         nameLabels.push([item.persons.fullName, getCompatibility(compatibility)]);
    //         competences.map(record =>{
    //             let nums = valueCompetence[record.id] ?? [];
    //             nums.push(record.level_person);
    //             valueCompetence = {...valueCompetence, [record.id]: nums};
    //         })
    //     })

    //     profile?.at(-1)?.competences?.map(item =>{
    //         dataRandom.push({
    //             label: item.competence.name,
    //             data: valueCompetence[item.competence.id],
    //             ...getProperties(false, true)
    //         })
    //     })

    //     return {
    //         nameLabels,
    //         dataRandom,
    //         withPerson: false,
    //         withProfile: false, 
    //         withRandom: true
    //     }
    // }

    // const processInfo = () =>{
    //     let nameLabels = [];
    //     let levelsPerson = [];
    //     let levelsProfile = [];
    //     let args = {
    //         nameLabels,
    //         levelsPerson,
    //         levelsProfile
    //     };

    //     if(typeReport == 'p') return getInfoP(args);
    //     if(typeReport == 'pp') return getInfoPP(args);
    //     if(typeReport == 'psp') return getInfoPSP(args);
    //     if(typeReport == 'pps') return getInfoPPS(args);
    //     if(typeReport == 'psc') return getInfoPSC(args);
    // }

    // const colorGen = () => {   
    //     let r = Math.floor(Math.random() * 255) + 1;
    //     let g = Math.floor(Math.random() * 255) + 1;
    //     let b = Math.floor(Math.random() * 255) + 1;
    //     return `${r}, ${g}, ${b}`;
    // }

    // const getProperties = (haveProfile = false, random = false) =>{
    //     const colors = [
    //         'rgba(243, 110, 55, 1)',
    //         'rgba(243, 110, 55, 0.2)',
    //         'rgba(123, 37, 241, 1)',
    //         'rgba(123, 37, 241, 0.2)',
    //         '#ffff'
    //     ]
    //     let color1 = haveProfile ? colors[2] : random ? `rgba(${colorGen()}, 1)` : colors[0];
    //     let color2 = haveProfile ? colors[3] : random ? `rgba(${colorGen()}, 0.2)` : colors[1];
        
    //     return {
    //         backgroundColor: color2,
    //         borderColor: color1,
    //         pointBackgroundColor: color1,
    //         poingBorderColor: colors[4],
    //         pointHoverBackgroundColor: colors[4],
    //         pointHoverBorderColor: color1,
    //         pointHoverRadius: 5,
    //         borderWidth: 1,
    //     };
    // }

    const generateConfig = () =>{
        const selected = actions[typeReport];
        if(!selected) return;
        let params = selected(infoReport?.at(-1));
        setActiveCircular(params.circular)
        setFullName(params.fullName)
        setParameters(params.data)

        // let {
        //     nameLabels = [],
        //     levelsPerson = [],
        //     levelsProfile = [],
        //     setNamePerson = '',
        //     setNameProfile = '',
        //     withPerson = true,
        //     withProfile = false,
        //     withRandom = false,
        //     dataRandom = []
        // } = processInfo();
        // let setParams = [];
        
        // if(withPerson){
        //     setParams.push({
        //         label: setNamePerson,
        //         data: levelsPerson,
        //         ...getProperties()
        //     })
        // }

        // if(withProfile){
        //     setParams.push({
        //         label: setNameProfile,
        //         data: levelsProfile,
        //         ...getProperties(true)
        //     })
        // }
         
        // setParameters({
        //     labels: nameLabels,
        //     datasets: withRandom ? dataRandom : setParams
        // });
    }

    const getSize = () =>{
        const list = {
            'psp': 10,
            'pps': 10,
            'psc': 2
        }
        return list[typeReport] ?? 1.5;
    }

    const options = {
        responsive: true,
        aspectRatio: 1.5,
        animation: {
            duration: 2000,
            easing: 'easeOutElastic'
        },
        scales: {
            r: {
                beginAtZero: true,
                ticks: {
                    stepSize: getSize(),
                    backdropPadding: {
                        y: 8
                    }
                },
                grid: {
                    circular: activeCircular,
                }
            }
        },
        plugins: {
            zoom: {
                zoom: {
                    wheel: {
                        enabled: isModal
                    },
                    mode: "xy",
                    speed: 50,
                },
                pan: {
                    enabled: isModal,
                    mode: "xy",
                    speed: 50
                }
            }
        }
    };
    
    const Grahp = (
        <Radar
            data={parameters}
            options={options}
        />
    )
    
    return isModal ? (
        <MyModal
            visible={visible}
            close={close}
            title={fullName}
            widthModal={800}
        >
            {Grahp}
        </MyModal>
    ) : Grahp;
}

export default ViewChart