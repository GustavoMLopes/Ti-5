import Styled from 'styled-components'

import { media } from '../GlobalStyle.css'

const StyledTable = Styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 10px;
  box-sizing: border-box;
  ${media['1275']`font-size: 14px;`}

  tr {
    height: 40px;
    line-height: 0;
    ${media['600']`height: 35px`};
  }

  th,
  td {
    text-align: left;
    padding: 15px;
    ${media['1275']`padding: 12px`};
    ${media['600']`padding: 8px`};
    border: 1px solid #e1e1e1;
    line-height: 16.1px;
  }
`;

const HeaderCell = Styled.th`
  font-size: 1rem;
  ${media['1275']`font-size: 14px;`}
  font-weight: 500;
  height: 40px;
  ${media['600']`height: 35px`};
  white-space: nowrap;
  color: #6d7187;
  background-color: #f9f9fb;
`;

const precisionRound = (number: number, precision: number) => {
    const factor = Math.pow(10, precision);
    return Math.round(number * factor) / factor;
};

export type ProcessesInfo = {
    job: string;
    at: number;
    bt: number;
}

export type TableProps = {
    processesInfo: {
        job: string;
        at: number;
        bt: number;
    }[]
};

const Table = ({ processesInfo }: TableProps) => {          
    return (
        <StyledTable>
            <thead>
                <tr>
                    <HeaderCell>Job</HeaderCell>
                    <HeaderCell>Arrival Time</HeaderCell>
                    <HeaderCell>Burst Time</HeaderCell>
                </tr>
            </thead>
            <tbody>
                {processesInfo.map((item, _) => (
                    <tr key={`list-process-row-${item}`}>
                        <td>{item.job.toUpperCase()}</td>
                        <td>{item.at}</td>
                        <td>{item.bt}</td>
                    </tr>
                ))}
            </tbody>
        </StyledTable>
    );
}

export default Table;