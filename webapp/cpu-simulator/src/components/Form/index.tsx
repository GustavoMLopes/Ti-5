import { randomUUID } from 'crypto';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Styled from  'styled-components'
import { media } from '../GlobalStyle.css'
import Button from './Button'

const StyledForm = Styled.div`
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

const Form = Styled.form`
  & > * + * {
    margin-top: 20px;
  }

  fieldset {
    padding: 0;
    margin-left: 0;
    margin-right: 0;
    border: none;
  }

  label {
    display: inline-block;
    font-size: 14px;
    padding-bottom: 8px;
  }

  input {
    width: 100%;
    border: 1px solid #c5c7d0;
    border-radius: 5px;
    padding: 11px 12px;
    transition: all 0.2s ease-out;
    font-size: 14px;

    &:hover {
      background-color: #fafafa;
      border-color: rgb(179, 179, 179);
    }

    &:focus {
      border-color: #2684ff;
      background-color: #fff;
      outline: none;
    }

    &:-webkit-autofill::first-line {
      font-family: $body-font;
      font-size: 14px;
    }
  }

  button {
    background-color: #2684ff;
    border-radius: 5px;
    color: #fff;
    width: 5.625rem;
    height: 2.5rem;
    transition: background-color 0.2s ease-out;

    position: relative;
    overflow: hidden;

    &:hover {
      background-color: #005bff;
    }
  }

  span.ripple {
    position: absolute;
    border-radius: 50%;
    transform: scale(0);
    animation: ripple 600ms ease-out;
    background-color: rgba(255, 255, 255, 0.7);
  }

  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;

type Process = {
  job: string;
  arrivalTime: number;
  burstTime: number;
}

const AlgoForm = () => {
    const [jobName, setJobName] = useState('');
    const [jobArrivalTime, setArrivalTime] = useState('');
    const [jobBurstTime, setBurstTime] = useState('');
    const arrivalTimeRef = useRef(null);
    const burstTimeRef = useRef(null);
    const jobNameRef = useRef(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      
      const jobNameField = jobName;
      const jobArrivalTimeInt = parseInt(jobArrivalTime);
      const jobBurstTimeInt = parseInt(jobBurstTime);

      let processes: Array<Process> = JSON.parse(localStorage.getItem('processes')) == null ? [] : JSON.parse(localStorage.getItem('processes'));
      let process: Process = {
        'job': jobNameField,
        'arrivalTime': jobArrivalTimeInt,
        'burstTime': jobBurstTimeInt
      }
      processes.push(process);
      localStorage.setItem('processes', JSON.stringify(processes));
    };

    const handleJobNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setJobName(e.target.value)
    };

    const handleArrivalTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setArrivalTime(e.target.value)
    };

    const handleBurstTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setBurstTime(e.target.value)
    };

    return (
        <>
            <StyledForm>
                <Header>
                    <h1>Input</h1>
                </Header>
                <Form onSubmit={handleSubmit}>
                    <fieldset>
                    <label htmlFor="job-name">Job</label>
                        <input
                            onChange={handleJobNameChange}
                            type="text"
                            id="job-name"
                            placeholder="e.g. A"
                            ref={jobNameRef}
                        />
                    </fieldset>
                    <fieldset>
                    <label htmlFor="job-arrival-time">Arrival Time</label>
                        <input
                            onChange={handleArrivalTimeChange}
                            type="text"
                            id="job-arrival-time"
                            placeholder="e.g. 0"
                            ref={arrivalTimeRef}
                        />
                    </fieldset>
                    <fieldset>
                    <label htmlFor="job-burst-time">Burst Times</label>
                        <input
                            onChange={handleBurstTimeChange}
                            type="text"
                            id="job-burst-time"
                            placeholder="e.g. 2"
                            ref={burstTimeRef}
                        />
                    </fieldset>
                    <Button>Add</Button>
                </Form>
            </StyledForm>
        </>
    )
}

export default AlgoForm;