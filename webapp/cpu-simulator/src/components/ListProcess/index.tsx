import { useEffect, useState } from 'react';
import Styled, { keyframes } from 'styled-components';
import { media } from '../GlobalStyle.css'
import { TableProps } from './Table';
import { ProcessesInfo } from './Table'; 

import Table from './Table'

const StyledList = Styled.div`
padding: 1rem 2rem 2rem 2rem;
${media['600']`padding: 0.5rem 1.1rem 1.5rem 1.1rem;`}
background: #ffffff;
box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1),
  0px 2px 32px rgba(15, 91, 206, 0.1);
border-radius: 15px;
flex: 1;
min-width: 0;
overflow: hidden;
align-self: baseline;
${media['1050']`align-self: normal;`}
`;

const Header = Styled.div`
display: flex;
justify-content: space-between;
align-items: center;
`;

const Text = Styled.p`
margin: 0;
padding: 0;
${media['600']`
  font-size: 14px;
`}
`;

export type processesInfoType = {
    job: string;
    at: number;
    bt: number;
}[];

type Process = {
  job: string;
  arrivalTime: number;
  burstTime: number;
}

const ListProcess = () => {        
    const [processesInfo, setTableProps] = useState<processesInfoType>([]);
    
    useEffect(() => {
        const processes: Array<Process> = JSON.parse(localStorage.getItem('processes')) == null ? [] : JSON.parse(localStorage.getItem('processes'));
        let tableProps : processesInfoType = [];
        const solvedProcess:ProcessesInfo = {
            job: "a",
            at: 2,
            bt: 3
        }
        processes.forEach(process => {
            tableProps.push(
                {
                    job: process.job,
                    at: process.arrivalTime,
                    bt: process.burstTime
                }
            )
        })
        setTableProps(tableProps)
    })


    return (
        <>
            <StyledList>
                <Header>
                    <h1>Jobs</h1>
                </Header>
                <Table {... { processesInfo }} />
            </StyledList>
        </>
    )
}

export default ListProcess;