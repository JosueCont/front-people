import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    message,
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import TableFile from './TabsFiles/TableFile';

const TabEconomic = ({ action }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoEconomic, setInfoEconomic] = useState([]);

    const fakeData = useMemo(()=>{
        return Array(20).fill(null).map((_, idx) =>{
            return {
                id: idx,
                name: 'Un archivo de estudio socioeconómico ' + idx,
                file: 'https://khorplus.s3.amazonaws.com/grupohuman/people/job_bank/customers/documents/3012023224739/diseno_info_cliente.pdf',
                fecha: '02/02/2023'
            }
        })
    },[])

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoEconomic(router.query.id);
        }
    },[router.query?.id])

    const getInfoEconomic = async (id) =>{
        try {
            setLoading(true);
            setTimeout(()=>{
                setInfoEconomic(fakeData);
                setLoading(false);
            },1000)
        } catch (e) {
            console.log(e)
            setLoading(false)
        }
    }

    const actionUpdate = async (itemToEdit, values) =>{
        const key = 'updatable';
        message.loading({content: 'Actualizando archivo...', key})
        try {
            message.success({content: 'Archivo actualizado', key})
            getInfoEconomic(router.query.id);
        } catch (e) {
            console.log(e)
            message.error({content: 'Archivo no actualizado', key})
        }
    }

    const actionCreate = async (values) =>{
        const key = 'updatable';
        message.loading({content: 'Guardando archivo...', key})
        try {
            values.append('candidate', router.query?.id)
            message.success({content: 'Archivo guardado', key})
            getInfoEconomic(router.query.id);
        } catch (e) {
            console.log(e)
            message.error({content: 'Archivo no guadado', key})
        }
    }

    const actionDelete = async (itemsToDelete) =>{
        try {
            let id = itemsToDelete.at(-1).id;
            message.success('Archivo eliminado')
            getInfoEconomic(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Archivo no eliminado')
        }
    }

    

    return (
        <TableFile
            // titleCreate='Agregar estudio socioeconómico'
            // titleUpdate='Actualizar estudio socioeconómico'
            // titleDelete='¿Estás de eliminar este estudio socioeconómico?'
            loading={loading}
            infoFiles={infoEconomic}
            actionUpdate={actionUpdate}
            actionCreate={actionCreate}
            actionDelete={actionDelete}
        />
    )
}

export default TabEconomic