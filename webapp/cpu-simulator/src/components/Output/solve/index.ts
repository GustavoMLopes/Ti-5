import { AlgorithmType } from "../../Input/SelectAlgorithm";
import { fcfs } from './fcfs';
import { sjf } from './sjf';
import { srtf } from './srtf';
import { rr } from './rr';

export type chartInfoType = {
    job: string;
    start: number;
    stop: number;
}[];

export type solvedProcessesInfoType = {
    job: string;
    at: number;
    bt: number;
    ft: number;
    tat: number;
    wat: number;
}[];

export const solve = (
    algo: AlgorithmType,
    arrivalTime: number[],
    burstTime: number[],
    timeQuantum: number,
    priorities: number[]
  ) => {
    switch (algo) {
      case 'FCFS':
        return fcfs(arrivalTime, burstTime);
      case 'SJF':
        return sjf(arrivalTime, burstTime);
      case 'SRTF':
        return srtf(arrivalTime, burstTime);
      case 'RR':
        return rr(arrivalTime, burstTime, timeQuantum);
      default:
        break;
    }
  };
  