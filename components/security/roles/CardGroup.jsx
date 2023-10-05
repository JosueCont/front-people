import React, {
    useEffect
} from 'react';
import { Card, Col, Row, Typography, Collapse } from 'antd';

const CardGroup = ({
    catalogs = [],
    module = []
}) => {

    useEffect(() => {
        console.log('asi cambia-->', catalogs)
    }, [catalogs])

    return (
        <Collapse ghost>
            {catalogs?.length > 0 ? (
                <>{catalogs?.map((cat, idx) => (
                    <Collapse.Panel header={cat?.khorplus_module?.name} key={idx}>
                        {cat?.groups?.length > 0 ? (
                            <Collapse>
                            </Collapse>
                        ):(<div>vacio</div>)}
                    </Collapse.Panel>
                ))}</>
            ):(<div>vacio</div>)}
        </Collapse>
    )
}

export default CardGroup