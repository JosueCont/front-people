import React, { useState, useEffect, useMemo } from 'react';
import {
    Table,
    message,
} from 'antd';
import WebApiJobBank from '../../../api/WebApiJobBank';
import { useRouter } from 'next/router';
import TableFile from './TabsFiles/TableFile';

const TabReferences = ({ action }) => {

    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [infoReferences, setInfoReferences] = useState([]);

    const fakeData = useMemo(()=>{
        return Array(20).fill(null).map((_, idx) =>{
            return {
                id: idx,
                name: 'Un archivo de referencia ' + idx,
                file: 'https://khorplus.s3.amazonaws.com/grupohuman/people/job_bank/customers/documents/3012023224739/diseno_info_cliente.pdf',
                fecha: '01/02/2023'
            }
        })
    },[])

    useEffect(()=>{
        if(router.query.id && action == 'edit'){
            getInfoReference(router.query.id);
        }
    },[router.query?.id])

    const getInfoReference = async (id) =>{
        try {
            setLoading(true);
            setTimeout(()=>{
                setInfoReferences(fakeData);
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
            getInfoReference(router.query.id);
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
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error({content: 'Archivo no guadado', key})
        }
    }

    const actionDelete = async (itemsToDelete) =>{
        try {
            let id = itemsToDelete.at(-1).id;
            message.success('Archivo eliminado')
            getInfoReference(router.query.id);
        } catch (e) {
            console.log(e)
            message.error('Archivo no eliminado')
        }
    }

    

    return (
        <TableFile
            // titleCreate='Agregar referencia'
            // titleUpdate='Actualizar referencia'
            // titleDelete='¿Estás de eliminar esta referencia?'
            loading={loading}
            infoFiles={infoReferences}
            actionUpdate={actionUpdate}
            actionCreate={actionCreate}
            actionDelete={actionDelete}
        />
    )
}

export default TabReferences