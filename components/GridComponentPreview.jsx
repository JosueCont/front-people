import React, { useEffect, useState } from "react";
import { Grid, Input, Select } from 'react-spreadsheet-grid'
import {civilStatusSelectGrid} from "../utils/constant";


const GridComponentPreview = ({ data,onFieldChange, ...props }) => {

    const columnsGrid=[
        {
            title: () => 'Clave',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.code}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'code',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Nombre',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.first_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'first_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Apellido paterno',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.flast_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'flast_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Apellido materno',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.mlast_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'mlast_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Correo',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.email}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'email',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'CURP',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.curp}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'curp',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'RFC',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.rfc}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'rfc',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Estado civil',
            value: (row, { focus }) => {
                return (
                    <Select
                        selectedId={row?.civil_status}
                        isOpen={focus}
                        items={civilStatusSelectGrid}
                        onChange={onFieldChange(row.id, 'civil_status',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Fecha de nacimiento',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.birth_date}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'birth_date',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Puesto',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.job_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'job_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Departamento',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.department_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'job_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Plaza',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.work_title_name}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'work_title_name',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Fecha de ingreso',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.date_of_admission}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'date_of_admission',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Banco',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.bank}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'bank',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Cuenta bancaria',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.bank_account}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'bank_account',row.rowIndex)}
                    />
                );
            }
        },
        {
            title: () => 'Cuenta interb.',
            value: (row, { focus }) => {
                return (
                    <Input
                        value={row?.interbank_account}
                        focus={focus}
                        onChange={onFieldChange(row.id, 'interbank_account',row.rowIndex)}
                    />
                );
            }
        },

    ]

    return <Grid
        columns={columnsGrid}
        isScrollable
        rows={data && data.map((ele,index)=> ({...ele, rowIndex:index}))}
        getRowKey={(row) => row.id}
    />
}

export default GridComponentPreview;