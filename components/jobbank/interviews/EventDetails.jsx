import React, { useMemo } from 'react';
import { Modal, Avatar } from 'antd';
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

const EventDetails = ({
    visible = false,
    itemToDetail = {},
    close = () =>{}
}) => {

    const format = 'dddd, DD MMMM ⋅ hh:mm';

    const description = useMemo(()=>{
        let size = Object.keys(itemToDetail).length;
        if(size <=0) return null;
        let start = itemToDetail.start?.dateTime;
        let end = itemToDetail.end?.dateTime;
        if(!start || !end) return null;
        let init = moment(start).locale('es-mx').format(format);
        let finish = moment(end).format('hh:mm a');
        return `${init} - ${finish}`;
    },[itemToDetail])

    const guests = useMemo(()=>{
        let persons = itemToDetail.attendees ?? [];
        return persons?.reduce((acc, row) =>{
            if(!row.organizer) return [...acc, row];
            let list = [...acc];
            list.unshift(row);
            return list;
        },[])
    },[itemToDetail])

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
                        <EvenTitle>{itemToDetail.summary}</EvenTitle>
                        <ContentNormal gap={8}>
                            <BtnOption><MdOutlineEdit/></BtnOption>
                            <BtnOption><VscTrash/></BtnOption>
                            <BtnOption onClick={()=> close()}><MdOutlineClear/></BtnOption>
                        </ContentNormal>
                    </ContentBetween>
                    <TextDescripcion>{description}</TextDescripcion>
                </ContentVertical>
                <ContentVertical>
                    <ContentBetween>
                        <BtnLink target='_blank' href={itemToDetail.hangoutLink}>
                            Unirse con Google Meet
                        </BtnLink>
                        <BtnOption><VscCopy/></BtnOption>
                    </ContentBetween>
                    <TextDescripcion>{itemToDetail.hangoutLink}</TextDescripcion>
                </ContentVertical>
                <TextDescripcion isTitle>Invitados ({itemToDetail.attendees?.length ?? 0})</TextDescripcion>
                <ContentVertical gap={8} style={{maxHeight: '300px', overflow: 'auto'}} className='scroll-bar'>
                    {guests.map((record, idx) => (
                        <ContentNormal gap={16} key={idx}>
                            <div style={{position: 'relative'}}>
                                <Avatar>
                                    {record.displayName
                                        ? record.displayName[0].toUpperCase()
                                        : record.email[0].toUpperCase()
                                    }
                                </Avatar>
                                {['accepted','needsAction'].includes(record.responseStatus) ? (
                                    <StatusGuest status={record.responseStatus}>
                                        {record.responseStatus == 'accepted' && (<BiCheck/>)}
                                        {record.responseStatus == 'needsAction' && (<RiCloseLine/>)}
                                    </StatusGuest>
                                ) : null}
                            </div>
                            <ContentVertical>
                                <TextDescripcion isTitle>{record.displayName ?? record.email}</TextDescripcion>
                                <TextDescripcion>{record.organizer ? 'Organizador': record.optional ? 'Opcional' : 'Pendiente'}</TextDescripcion>
                            </ContentVertical>
                        </ContentNormal>
                    ))}
                </ContentVertical>
            </ContentVertical>
        </Modal>
    )
}

export default EventDetails