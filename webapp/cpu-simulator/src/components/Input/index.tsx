import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import Styled from 'styled-components'
import AlgorithmSelect, { OptionType, defaultOption } from './SelectAlgorithm'
import media from '../GlobalStyle.css'
import { invalidInputSwal } from './error';
import Button from './Button';

const StyledInput = Styled.div`
  
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

type InputProps = {
  selectedAlgorithm: OptionType;
  setSelectedAlgorithm: Dispatch<SetStateAction<{}>>;
  setArrivalTime: Dispatch<SetStateAction<number[]>>;
  setBurstTime: Dispatch<SetStateAction<number[]>>;
  setTimeQuantum: Dispatch<SetStateAction<number>>;
  setPriorities: Dispatch<SetStateAction<number[]>>;
}

type Process = {
  job: string;
  arrivalTime: number;
  burstTime: number;
}

const Input = (props: InputProps) => {
  const [selectedAlgo, setSelectedAlgo] = useState(defaultOption);
  const [arrivalTime, setArrivalTime] = useState('');
  const [burstTime, setBurstTime] = useState('');
  const [timeQuantum, setTimeQuantum] = useState('');
  const [priorities, setPriorities] = useState('');
  const arrivalTimeRef = useRef(null);
  const burstTimeRef = useRef(null);

  useEffect(() => {
    if (arrivalTimeRef.current && burstTimeRef.current) {
      arrivalTimeRef.current.value = '';
      burstTimeRef.current.value = '';
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let processes: Array<Process> = JSON.parse(localStorage.getItem('processes')) == null ? [] : JSON.parse(localStorage.getItem('processes'));

    const arrivalTimeArr = [];
    processes.forEach(process => {
      arrivalTimeArr.push(process.arrivalTime)
    });

    const burstTimeArr = [];
    processes.forEach(process => {
      burstTimeArr.push(process.burstTime)
    })

    // TODO
    const timeQuantumInt = parseInt(timeQuantum);
    let prioritiesArr = priorities
      .trim()
      .split(/\s+/)
      .map((priority) => parseInt(priority));

    if (burstTimeArr.includes(0)) {
      invalidInputSwal('0 burst time is invalid');
      return;
    } else if (arrivalTimeArr.length !== burstTimeArr.length) {
      invalidInputSwal(
        'Number of the arrival times and burst times do not match'
      );
      return;
    } else if (
      arrivalTimeArr.includes(NaN) ||
      burstTimeArr.includes(NaN) ||
      (selectedAlgo.value === 'RR' && isNaN(timeQuantumInt))
    ) {
      invalidInputSwal('Please enter only integers');
      return;
    } else if (
      arrivalTimeArr.some((t) => t < 0) ||
      burstTimeArr.some((t) => t < 0)
    ) {
      invalidInputSwal('Negative numbers are invalid');
      return;
    }

    if (selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') {
      if (priorities.trim() === '') {
        prioritiesArr = arrivalTimeArr.map(() => 0);
      } else if (
        prioritiesArr.length !== arrivalTimeArr.length ||
        prioritiesArr.length !== arrivalTimeArr.length
      ) {
        invalidInputSwal(
          'Arrival times, burst times and priorities should have equal length'
        );
        return;
      }
    }

    props.setSelectedAlgorithm(selectedAlgo);
    props.setArrivalTime(arrivalTimeArr);
    props.setBurstTime(burstTimeArr);
    props.setTimeQuantum(timeQuantumInt);
    props.setPriorities(prioritiesArr);
  };

  const handleTimeQuantumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeQuantum(e.target.value);
  };

  const handlePrioritiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPriorities(e.target.value);
  };

  return (
    <StyledInput>
      <h1>Select</h1>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <label htmlFor="react-select-algo">Algorithm</label>
          <AlgorithmSelect
            selectedAlgo={selectedAlgo}
            setSelectedAlgo={setSelectedAlgo}
          />
        </fieldset>
        {selectedAlgo.value === 'RR' && (
          <fieldset>
            <label htmlFor="time-quantum">Time Quantum</label>
            <input
              defaultValue={timeQuantum}
              onChange={handleTimeQuantumChange}
              type="number"
              id="time-quantum"
              placeholder="e.g. 3"
              min="1"
              step="1"
            />
          </fieldset>
        )}
        {(selectedAlgo.value === 'NPP' || selectedAlgo.value === 'PP') && (
          <fieldset>
            <label htmlFor="priorities">Priorities</label>
            <input
              defaultValue={priorities}
              onChange={handlePrioritiesChange}
              type="text"
              id="priorities"
              placeholder="Lower # = higher priority"
            />
          </fieldset>
        )}
        <Button>Solve</Button>
      </Form>
    </StyledInput>
  );
};

export default Input;
