import Styled from 'styled-components'
import React, { useState } from 'react'
import Head from 'next/head'
import Input from '../components/Input';

import { media } from '../components/GlobalStyle.css'
import Output from '../components/Output';

const Main = Styled.main`
  display: flex;
  ${media['1050']`flex-direction: column;`}
  margin: 45px auto 1rem !important;
  ${media['600']`margin: 20px auto 1rem !important`};
  gap: clamp(0.5rem, 2.5vw, 4rem);
  ${media['1050']`gap: 0.75rem`};
`;

const Separator = Styled.div`
  margin: 0 1rem;
  width: 1px;
  height: 16px;
  background-color: rgb(0 0 0 / 50%);
`;

export default function Home() {
  const [selectedAlgo, setSelectedAlgo] = useState(null);
  const [arrivalTime, setArrivalTime] = useState<number[]>([]);
  const [burstTime, setBurstTime] = useState<number[]>([]);
  const [timeQuantum, setTimeQuantum] = useState<number>();
  const [priorities, setPriorities] = useState<number[]>([]);

  return (
    <div>
      <Head>
        <title>CPU Process Scheduling Solver</title>
      </Head>
      
    <Main className='container'>
      <Input
        selectedAlgorithm={selectedAlgo}
        setSelectedAlgorithm={setSelectedAlgo}
        setArrivalTime={setArrivalTime}
        setBurstTime={setBurstTime}
        setTimeQuantum={setTimeQuantum}
        setPriorities={setPriorities}
      />
      <Output
          selectedAlgo={selectedAlgo}
          arrivalTime={arrivalTime}
          burstTime={burstTime}
          timeQuantum={timeQuantum}
          priorities={priorities}
      />
    </Main>

    </div>
  );
}