import React from 'react';
import { Button } from 'antd';
import MyModal from '../../common/MyModal';
import dynamic from 'next/dynamic';
const OptionsExport = dynamic(() => import('../assessment/reports/ReportPDF/OptionsExport'), { ssr: false });

const ModalCompetences = ({
    visible = false,
    close = () => { },
    itemReport = [],
    itemPerson = {}
}) => {

    const columns = [
        {
            title: 'Competencia',
            dataIndex: ['competence','name'],
        },
        {
            title: 'Nivel',
            dataIndex: 'level',
        },
        {
            title: 'Descripción',
            dataIndex: 'description'
        }
    ]

    const ButtonActions = ({
        generatePDF,
        generateExcel,
        loading
    }) => (
        <>
            <Button onClick={()=> close()} disabled={loading}>
                Cerrar
            </Button>
            <Button onClick={()=> generatePDF()} loading={loading}>
                Descargar reporte
            </Button>
        </>
    )

    return (
        <MyModal
            title='Reporte competencias'
            close={close}
            visible={visible}
        >
            <div className='competence_list scroll-bar'>
                {itemReport?.length > 0 && itemReport?.map((item, idx) => (
                    <div key={idx} className='competence_content'>
                        <div className='competence_title'>
                            <p>{idx + 1}.- {item.competence?.name}</p>
                            <p>Nivel: {item.level}</p>
                        </div>
                        <div className='competence_level'>
                            <div className='competence_level_type'>
                                <p>{item?.description}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='content-end' style={{ gap: 8 }}>
                <OptionsExport
                    typeReport='p'
                    infoReport={itemReport}
                    currentUser={itemPerson}
                    currentProfile={{}}
                    columns={columns}
                >
                    <ButtonActions/>
                </OptionsExport>
            </div>
        </MyModal>
    )
}

export default ModalCompetences