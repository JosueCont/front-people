import styled from "@emotion/styled";
import { css } from "styled-components";
import {
    Card,
    Row,
    Col,
    Avatar,
    Space,
    Button,
    Radio,
    Modal,
    Table,
    Layout,
    Progress
} from "antd";

const { Content, Header, Footer } = Layout;
const ellipsis = css`
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
`;

export const CustomHeader = styled(Header)`
    background: ${({bg}) => bg ?? "#252837"};
    & .ant-col:last-of-type{
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 16px;
        & svg{
            font-size: 30px;
            color: #F0F0F0;
            cursor: pointer;
        }
        & .ant-avatar{
            cursor: pointer;
        }
    }
`;

export const CustomContent = styled(Content)(({
    bg1 = "#403F44",
    bg2 = "#352f57"
})=>{
    let bg = `linear-gradient(to bottom right, ${bg1}, ${bg2})`;
    return css`
        padding: 0 50px;
        background: ${bg};
    `;
});

export const CustomChildren = styled.div`
    min-height: 100vh;
    padding-top: 24px;
    padding-bottom: 24px;
    overflow: hidden;
`;

export const CustomFooter = styled(Footer)`
    background: ${({bg}) => bg ?? "#252837"};
    text-align: center;
    font-weight: bold;
    color: #ffff;
`;

export const CustomTable = styled(Table)(({
    showHeader = true
})=>{

    let withoutThead = css`
        & .ant-table-tbody {
            & tr.ant-table-row:hover:nth-child(2),
            & tr:nth-child(2) {
                & td:first-child,
                & td.ant-table-cell-row-hover:first-child{
                    border-top-left-radius: 12px;
                }
                & td:last-child,
                & td.ant-table-cell-row-hover:last-child{
                    border-top-right-radius: 12px;
                }
            }
        }
    `;

    let defaultCss = css`
        & .ant-table{
            border-radius: 12px;
        }
        & .ant-table-container table {
            & thead > tr:first-child {
                & th:first-child{
                    border-top-left-radius: 12px;
                }
                & th:last-child{
                    border-top-right-radius: 12px;
                }
            }
            & tbody > tr:last-child{
                td:first-child{
                    border-bottom-left-radius: 12px;
                }
                td:last-child{
                    border-bottom-right-radius: 12px;
                }
            }
        }
    `;

    return css`${defaultCss}${showHeader ? '' : withoutThead}`;
})

export const CustomCard = styled(Card)`
    border-radius: 12px;
    background: ${({bg}) => bg ?? "#F0F0F0"};
    box-shadow: 0px 0px 5px 1px rgba(0,0,0,0.2);
`;

export const CustomModal = styled(Modal)`
    & .ant-modal-content{
        border-radius: 12px;
        background-color: ${({bg}) => bg ?? "#F0F0F0"};
    }
`;

export const ContentCenter = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: ${({gap}) => gap};
`;

export const ContentVertical = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({gap}) => gap};
`;

export const ContentStart = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${({gap}) => gap};
`;

export const ContentEnd = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${({gap}) => gap};
`;

export const ContentBetween = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

export const ContentEvenly = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;

export const ContentAround = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

export const CustomContainer = styled(ContentCenter)`
    min-height: 100vh;
    background-color: #252837;
    overflow: hidden;
`;

export const ContentLoading = styled(ContentCenter)`
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    & .ant-space{
        animation: showmessage 1s ease-in, fadein 1s ease-in;
    }
    & .anticon{
        font-size: 50px;
        color: #ffff;
    }
    & p{
        font-size: 19px;
        margin-bottom: 0px;
        color: #ffff;
    }
`;

export const CustomBtn = styled(Button)(({
    bg = "#1f2733",
    cl = "white",
    wd = "100%",
    br = "50px"
})=>{
    return css`
        display: flex;
        align-items: center;
        justify-content: center;
        background: ${bg};
        color: ${cl};
        border: none;
        border-radius: ${br};
        width: ${wd};
        gap: 5px;
        :hover{
            background: ${bg};
            color: ${cl};
            transform: scale(1.05);
        }
        :focus{
            background: ${bg};
            color: ${cl};
        }
    `;
});

export const Title1 = styled.p(({
    size = '1.125rem',
    color = '#1f2733',
    weight = 700,
    cut = false
})=>{

    let defaultCss = css`
        font-size: ${size};
        color: ${color};
        font-weight: ${weight};
        margin-bottom: 0px;
    `;

    return css`${defaultCss}${cut ? ellipsis : ''}`;
})

export const Title2 = styled.p(({
    size = '1rem',
    color = '#8c8c8c',
    weight = 400,
    cut = false
}) =>{

    let defaultCss = css`
        font-size: ${size};
        color: ${color};
        font-weight: ${weight};
        margin-bottom: 0px;
    `;

    return css`${defaultCss}${cut ? ellipsis : ''}`;
})

export const CustomProgress = styled(Progress)(({
    bg1 = '#814cf2',
    bg2 = '#ffff'
}) =>{
    return css`
        & .ant-progress-outer{
            width: calc(100% - 20px);
        }
        & .ant-progress-bg{
            background-color: ${bg1};
        }
        & .ant-progress-inner{
            background-color: ${bg2};
        }
    `;
})