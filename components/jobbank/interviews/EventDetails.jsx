import React, { useMemo } from 'react';
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

const EventDetails = ({
    visible = false,
    itemToDetail = {},
    close = () =>{},
    showModalForm = ()=>{}
}) => {

    const format = 'dddd, DD MMMM ⋅ hh:mm';

    const getDescription = () =>{
        let size = Object.keys(itemToDetail).length;
        if(size <=0) return null;
        let start = itemToDetail.event?.start?.dateTime;
        let end = itemToDetail.event?.end?.dateTime;
        if(!start || !end) return null;
        let init = moment(start).locale('es-mx').format(format);
        let finish = moment(end).format('hh:mm a');
        return `${init} - ${finish}`;
    }

    const getGuests = () =>{
        let persons = itemToDetail.event?.attendees ?? [];
        return persons?.reduce((acc, row) =>{
            if(!row.organizer) return [...acc, row];
            return [row, ...acc];
        }, [])
    }

    const getStatistics = () =>{
        let persons = itemToDetail.event?.attendees ?? [];
        let results = persons.reduce((acc, row) => {
            let status = acc[row.responseStatus] ?? 0;
            return {...acc, [row.responseStatus]: status + 1};
        }, { accepted: 0, declined: 0, needsAction: 0});
        return `${results['accepted']} sí, ${results['declined']} no, ${results['needsAction']} pendiente(s)`;
    }

    const {
        guests,
        description,
        statistics
     } = useMemo(()=>{
        return {
            guests: getGuests(),
            description: getDescription(),
            statistics: getStatistics(),
        }
    },[itemToDetail])

    const copyLink = () =>{
        copyContent({
            text: itemToDetail.event?.hangoutLink,
            onSucces: ()=> message.success('Link copiado'),
            onError: ()=> message.error('Link no copiado')
        })
    }

    const copyEmails = () =>{
        let results = guests.reduce((acc, row) =>{
            if(!row.displayName) return acc;
            return acc += ` ${row.displayName} <${row.email}>,`;
        }, '');
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
                        <EvenTitle>{itemToDetail.event?.summary}</EvenTitle>
                        <ContentNormal gap={8}>
                            <BtnOption onClick={()=> showModalForm()}><MdOutlineEdit/></BtnOption>
                            <BtnOption><VscTrash/></BtnOption>
                            <BtnOption onClick={()=> close()}><MdOutlineClear/></BtnOption>
                        </ContentNormal>
                    </ContentBetween>
                    <TextDescripcion>{description}</TextDescripcion>
                </ContentVertical>
                <ContentVertical>
                    <ContentBetween>
                        <BtnLink target='_blank' href={itemToDetail.event?.hangoutLink}>
                            Unirse con Google Meet
                        </BtnLink>
                        <BtnOption onClick={()=> copyLink()}><VscCopy/></BtnOption>
                    </ContentBetween>
                    <TextDescripcion>{itemToDetail.event?.hangoutLink}</TextDescripcion>
                </ContentVertical>
                <ContentBetween>
                    <ContentVertical>
                        <TextDescripcion isTitle>
                            Invitados ({itemToDetail.event?.attendees?.length ?? 0})
                        </TextDescripcion>
                        <TextDescripcion>{statistics}</TextDescripcion>
                    </ContentVertical>
                    <BtnOption onClick={()=> copyEmails()}><VscCopy/></BtnOption>
                </ContentBetween>
                {guests.length > 0 && (
                    <ContentVertical gap={8} style={{maxHeight: '300px', overflow: 'auto'}} className='scroll-bar'>
                        {guests.map((record, idx) => (
                            <ContentNormal gap={16} key={idx}>
                                <div style={{position: 'relative'}}>
                                    <Avatar style={{backgroundColor: '#455a64'}}>
                                        {record.displayName
                                            ? record.displayName[0].toUpperCase()
                                            : record.email[0].toUpperCase()
                                        }
                                    </Avatar>
                                    {['accepted','declined'].includes(record.responseStatus) ? (
                                        <StatusGuest status={record.responseStatus}>
                                            {record.responseStatus == 'accepted' && (<BiCheck/>)}
                                            {record.responseStatus == 'declined' && (<RiCloseLine/>)}
                                        </StatusGuest>
                                    ) : null}
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