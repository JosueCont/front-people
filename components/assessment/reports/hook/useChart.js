import React, { useState, useEffect } from 'react';

const getSize = (type) =>{
    const list = {
        'psp': 10,
        'pps': 10,
        'psc': 2
    }
    return list[type] ?? 1.5;
}

const getOptions = (active, type) => ({
    aspectRatio: 1.5,
    scales: {
        r: {
            beginAtZero: true,
            ticks: {
                stepSize: getSize(type),
                backdropPadding: {
                    y: 8
                }
            },
            grid: {
                circular: active,
            }
        }
    }
})

const colorGen = () => {   
    let r = Math.floor(Math.random() * 255) + 1;
    let g = Math.floor(Math.random() * 255) + 1;
    let b = Math.floor(Math.random() * 255) + 1;
    return `${r}, ${g}, ${b}`;
}

const getProperties = (haveProfile = false, random = false) =>{
    const red = '255, 0, 0';
    const blue = '0, 0, 255';
    // const colors = [
    //     'rgba(243, 110, 55, 1)',
    //     'rgba(243, 110, 55, 0.2)',
    //     'rgba(123, 37, 241, 1)',
    //     'rgba(123, 37, 241, 0.2)'
    // ]
    const colors = [
        `rgba(${blue}, 1)`,
        `rgba(${blue}, 0.2)`,
        `rgba(${red}, 1)`,
        `rgba(${red}, 0.2)`
    ]
    let color1 = haveProfile ? colors[2] : random ? `rgba(${colorGen()}, 1)` : colors[0];
    let color2 = haveProfile ? colors[3] : random ? `rgba(${colorGen()}, 0.2)` : colors[1];
    
    return {
        backgroundColor: color2,
        borderColor: color1,
        pointBackgroundColor: color1,
        poingBorderColor: '#ffff',
        pointHoverBackgroundColor: '#ffff',
        pointHoverBorderColor: color1,
        pointHoverRadius: 5,
        borderWidth: 1,
    };
}

const getCompatibility = (value, string = true) => {
    if(typeof value == 'string') return value;
    let num = value.toFixed(2);
    return string ? `${num}%` : num;
}

const getInfoP = (report) =>{
    let list = report?.data?.length > 0 ? report.data : [];
    let {data, labels} = list.reduce((acc, current) =>{
        let labels = acc['labels'] ?? [];
        let data = acc['data'] ?? [];
        labels.push(current.competence?.name);
        data.push(current.level);
        return {...acc, labels, data};
    }, {data: [], labels: []})

    let datasets = [{...getProperties(), data, label: 'Nivel'}];

    return {
        circular: list?.length <= 2,
        fullName: report.fullName,
        data: {datasets, labels}
    }
}

const getInfoPP = (report) =>{
    let record = report?.profiles;
    let profiles = record?.length > 0 ? record?.at(-1) : {};
    let percent = getCompatibility(profiles?.compatibility);
    let fullName = `${report.persons?.fullName} / ${profiles?.name} (${percent})`;
    let { labels, person, profile } = profiles?.competences?.reduce((acc, current)=>{
        let labels = acc['labels'] ?? [];
        let person = acc['person'] ?? [];
        let profile = acc['profile'] ?? [];
        person.push(current.level_person);
        profile.push(current.level_profile);
        labels.push([current.name, getCompatibility(current.compatibility)]);
        return {...acc, labels, person, profile};
    }, {labels: [], person: [], profile: []});

    let datasets = [
        {...getProperties(), data: person, label: 'Persona'},
        {...getProperties(true), data: profile, label: 'Perfil'}
    ]

    return {
        fullName,
        data: {datasets, labels},
        circular: profiles?.competences?.length <= 2,
    }
}

const getInfoPSP = (report) =>{
    let list = report?.data?.length > 0 ? report.data : [];
    let {data, labels} = list.reduce((acc, current) =>{
        let labels = acc['labels'] ?? [];
        let data = acc['data'] ?? [];
        let num = current.profiles?.at(-1)?.compatibility;
        data.push(getCompatibility(num, false));
        labels.push(current.persons?.fullName);
        return {...acc, data, labels};
    },{labels: [], data: []})

    let datasets = [{...getProperties(), data, label: 'Compatibilidad'}];

    return {
        circular: list?.length <= 2,
        data: {datasets, labels},
        fullName: report?.profile?.at(-1)?.name,
    }
}

const getInfoPPS = (report) =>{
    let list = report?.data?.length > 0 ? report.data : [];
    let {data, labels} = list.reduce((acc, current) =>{
        let data = acc['data'] ?? [];
        let labels = acc['labels'] ?? [];
        labels.push(current.name);
        data.push(getCompatibility(current.compatibility, false));
        return {...acc, data, labels};
    },{data: [], labels: []})

    let datasets = [{...getProperties(), data, label: 'Compatibilidad'}];

    return {
        circular: list?.length <= 2,
        fullName: report?.fullName,
        data: {datasets, labels}
    }
}

const getInfoPSC = (args) =>{
    let { nameLabels } = args;
    let valueCompetence = {};
    let dataRandom = [];

    const { profile, data } = infoReport?.at(-1);
    if(data?.length <=2) setActiveCircular(true);
    setFullName(profile?.at(-1).name);

    data?.map(item =>{
        let { compatibility,  competences} = item.profiles?.at(-1);
        nameLabels.push([item.persons.fullName, getCompatibility(compatibility)]);
        competences.map(record =>{
            let nums = valueCompetence[record.id] ?? [];
            nums.push(record.level_person);
            valueCompetence = {...valueCompetence, [record.id]: nums};
        })
    })

    profile?.at(-1)?.competences?.map(item =>{
        dataRandom.push({
            label: item.competence.name,
            data: valueCompetence[item.competence.id],
            ...getProperties(false, true)
        })
    })

    return {
        nameLabels,
        dataRandom,
        withPerson: false,
        withProfile: false, 
        withRandom: true
    }
}

export const actions = {
    'p': getInfoP,
    'pp': getInfoPP,
    'psp': getInfoPSP,
    'pps': getInfoPPS,
    // 'psc': getInfoPSC
}

export const generateConfig = ({
    infoReport = [],
    typeReport = 'p'
}) =>{
    let {circular, ...args} = actions[typeReport](infoReport?.at(-1));
    let options = getOptions(circular, typeReport);
    return {...args, options};
}