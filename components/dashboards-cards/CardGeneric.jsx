import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Card, Space } from "antd";
import styled from '@emotion/styled';

export const CustomCard = styled(Card)`
    background: ${props=> props.color};
    border-radius: 12px;
    & .ant-card-body{
      padding: 12px;
    }
    :hover{
      cursor: pointer;
      box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.2);
    }
`;

export const ColOne = styled(Col)`
  display: flex;
  gap: 16px;
  & div:first-of-type{
    width: 30px;
    height: 30px;
    padding: 5px;
    background-color: white;
    border-radius: 50%;
    & .anticon{
      font-size: 20px;
    }
  }
  & div:last-of-type{
    & h1{
      color: white;
      font-size: 1rem;
      font-weight: 400;
      margin-bottom: 0px;
    }
  }
`;

export const ColTwo = styled(Col)`
  text-align: center;
  & h1{
    color: white;
    font-size: 1.75rem;
    margin-bottom: 0px;
    font-weight: 700;
  }
`;

const CardGeneric = ({title, numcard, icon, color, filter}) => {
    return (
        <CustomCard
          color={color}
          bordered={false}
          // onClick={()=> filter()}
        >
            <Row gutter={[32,0]}>
            <ColOne span={24}>
                <div>{icon}</div>
                <div><h1>{title}</h1></div>
            </ColOne>
            <ColTwo span={24}>
                <h1>{numcard}</h1>
            </ColTwo>
            </Row>
        </CustomCard>
    )
}

export default CardGeneric;