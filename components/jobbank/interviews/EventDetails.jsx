import React, { useMemo, useContext, useEffect } from 'react';
import { Modal, Avatar, Tooltip, message } from 'antd';
import { MdOutlineEdit, MdOutlineClear } from 'react-icons/md';
import { VscTrash, VscCopy } from 'react-icons/vsc';
import { BiCheck } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import moment from 'moment';
import {
    ContentVertical,
    ContentBetween,
    ContentNormal,
    EvenTitle,
    BtnOption,
    BtnLink,
    TextDescripcion,
    StatusGuest
} from './StyledInterview';
import { copyContent } from '../../../utils/functions';
import { InterviewContext } from '../context/InterviewContext';
import { redirectTo } from '../../../utils/constant';

const EventDetails = ({
    visible = false,
    itemToDetail = {},
    close = () =>{},
    showModalForm = ()=>{},
    showModalDelete = ()=>{}
}) => {

    const format = 'dddd, DD MMMM • hh:mm a';
    const { googleCalendar } = useContext(InterviewContext);

    const getDescription = () =>{
        if(Object.keys(itemToDetail).length <= 0) return null;
        let start = itemToDetail?.all_data_response?.start?.dateTime;
        let end = itemToDetail?.all_data_response?.end?.dateTime;
        if(!start || !end) return null;
        let init = moment(start).locale('es-mx').format(format);
        let finish = moment(end).format('hh:mm a');
        return `${init} - ${finish}`;
    }

    const getGuests = () =>{
        let persons = itemToDetail?.all_data_response?.attendees ?? [];
        return persons?.reduce((acc, row) =>{
            if(!row.organizer) return [...acc, row];
            return [row, ...acc];
        }, [])
    }

    const getStatistics = () =>{
        let persons = itemToDetail?.all_data_response?.attendees ?? [];
        let results = persons.reduce((acc, row) => {
            let status = acc[row.responseStatus] ?? 0;
            return {...acc, [row.responseStatus]: status + 1};
        }, { accepted: 0, declined: 0, needsAction: 0});
        let accepted = results['accepted'] > 0 ? results['accepted'] + ' sí, ' : '';
        let declined = results['declined'] > 0 ? results['declined'] + ' no, ' : '';
        let needs = results['needsAction'] > 0 ? results['needsAction'] + ' pendiente(s)' : '';
        return `${accepted}${declined}${needs}`;
    }

    const getCanAction = () =>{
        if(Object.keys(itemToDetail).length <= 0) return false;
        let start = itemToDetail?.all_data_response?.start?.dateTime;
        if(!start) return false;
        return !moment().isAfter(moment(start).format('YYYY-MM-DD'), 'day');
    }

    const {
        guests,
        description,
        // statistics,
        canAction
     } = useMemo(()=>{
        return {
            guests: getGuests(),
            description: getDescription(),
            // statistics: getStatistics(),
            canAction: getCanAction()
        }
    },[itemToDetail])

    const copyLink = () =>{
        copyContent({
            text: itemToDetail?.all_data_response?.hangoutLink,
            onSucces: ()=> message.success('Link copiado'),
            onError: ()=> message.error('Link no copiado')
        })
    }

    const copyEmails = () =>{
        const copy_ = (acc, row) => acc += `${row.displayName ?? ''} <${row.email}>, `;
        let results = guests.reduce(copy_, '');
        copyContent({
            text: results,
            onSucces: ()=> message.success('Correos copiados'),
            onError: ()=> message.error('Correos no copiados')
        })
    }

    return (
        <Modal
            onCancel={() => close()}
            maskClosable={false}
            closable={false}
            visible={visible}
            footer={null}
            width={400}
            bodyStyle={{padding: 18}}
        >
            <ContentVertical gap={16}>
                <ContentVertical>
                    <ContentBetween>
                        <EvenTitle maxWidth={canAction ? 140 : 50}>
                            {itemToDetail.all_data_response?.summary}
                        </EvenTitle>
                        <ContentNormal gap={8}>
                            {canAction && (
                               <>
                                     <Tooltip title={googleCalendar.msg}>
                                        <BtnOption
                                            canClick={googleCalendar.valid}
                                            onClick={()=> googleCalendar.valid ? showModalForm() : {}}
                                        >
                                            <MdOutlineEdit/>
                                        </BtnOption>
                                    </Tooltip>
                                    <Tooltip title={googleCalendar.msg}>
                                        <BtnOption
                                            canClick={googleCalendar.valid}
                                            onClick={()=> googleCalendar.valid ? showModalDelete() : {}}
                                        >
                                            <VscTrash/>
                                        </BtnOption>
                                    </Tooltip>
                               </>
                            )}
                            <BtnOption onClick={()=> close()}><MdOutlineClear/></BtnOption>
                        </ContentNormal>
                    </ContentBetween>
                    <TextDescripcion>{description}</TextDescripcion>
                </ContentVertical>
                {canAction && (
                    <ContentVertical>
                        <ContentBetween>
                            <BtnLink onClick={()=> redirectTo(itemToDetail?.all_data_response?.hangoutLink, true)}>
                                Unirse con Google Meet
                            </BtnLink>
                            <BtnOption onClick={()=> copyLink()}><VscCopy/></BtnOption>
                        </ContentBetween>
                        <TextDescripcion>{itemToDetail?.all_data_response?.hangoutLink}</TextDescripcion>
                    </ContentVertical>
                )}
                {/* <ContentVertical>
                    <TextDescripcion>{itemToDetail?.process_selection?.vacant?.job_position}</TextDescripcion>
                    <TextDescripcion>
                        {itemToDetail?.process_selection?.candidate?.first_name}&nbsp;
                        {itemToDetail?.process_selection?.candidate?.last_name}
                    </TextDescripcion>
                </ContentVertical> */}
                <ContentBetween>
                    <ContentVertical>
                        <TextDescripcion isTitle>
                            {itemToDetail?.process_selection?.vacant?.job_position}
                        </TextDescripcion>
                        <TextDescripcion>
                            Invitados ({itemToDetail?.all_data_response?.attendees?.length ?? 0})
                        </TextDescripcion>
                        {/* <TextDescripcion>{statistics}</TextDescripcion> */}
                    </ContentVertical>
                    <BtnOption onClick={()=> copyEmails()}><VscCopy/></BtnOption>
                </ContentBetween>
                {guests.length > 0 && (
                    <ContentVertical gap={8} style={{maxHeight: '300px', overflow: 'auto'}} className='scroll-bar'>
                        {guests.map((record, idx) => (
                            <ContentNormal gap={16} key={idx}>
                                <div style={{position: 'relative'}}>
                                    <Avatar style={{backgroundColor: idx % 2 == 0 ? '#5d4037' : '#455a64'}}>
                                        {record.displayName ? record.displayName[0].toUpperCase() : record.email[0].toUpperCase()}
                                    </Avatar>
                                    {/* {['accepted','declined'].includes(record.responseStatus) ? (
                                        <StatusGuest status={record.responseStatus}>
                                            {record.responseStatus == 'accepted' && (<BiCheck/>)}
                                            {record.responseStatus == 'declined' && (<RiCloseLine/>)}
                                        </StatusGuest>
                                    ) : null} */}
                                </div>
                                <ContentVertical>
                                    <TextDescripcion isTitle>{record.displayName ?? record.email}</TextDescripcion>
                                    <TextDescripcion>{record.organizer ? 'Organizador': record.optional ? 'Opcional' : null}</TextDescripcion>
                                </ContentVertical>
                            </ContentNormal>
                        ))}
                    </ContentVertical>
                )}
            </ContentVertical>
        </Modal>
    )
}

export default EventDetails