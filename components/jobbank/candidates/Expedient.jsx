import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { BlobProvider } from '@react-pdf/renderer';
import { redirectTo } from '../../../utils/constant';
import DocExpedient from './DocExpedient';

const Expedient = ({
    infoCandidate,
    infoEducation,
    infoExperience,
    infoPositions
}) => {

    const MyDoc = () => <DocExpedient
        infoCandidate={infoCandidate}
        infoEducation={infoEducation}
        infoExperience={infoExperience}
        infoPositions={infoPositions}
    />;

    const MyBlob = ({blob, url, loading, error}) => (
        <>
            <Button loading={loading} onClick={()=> redirectTo(url+'#toolbar=0', true)}>
                Prueba
            </Button>
            <a href={url} download={`${infoCandidate.fisrt_name} ${infoCandidate.last_name}`}>
                Prueba
            </a>
        </>
    )

    return (
        <BlobProvider document={<MyDoc/>}>
            {MyBlob}
        </BlobProvider>
    )
}

export default Expedient;