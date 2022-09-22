import { Box, Button, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectProcesses } from "./processSlice"
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid'

export const ListProcess = () => {
  const processes = useAppSelector(selectProcesses)

  const rows: GridRowsProp = processes.map((process) => ({
    id: process.id,
    name: process.name,
    arrivalTime: process.arrival_time,
    burstTime: process.burst_time,
    description: process.description,
    createdAt: process.created_at,
    updatedAt: process.updated_at,
  }))

  const columns: GridColDef[] = [
    {field: "id", headerName: "ID", width: 150 },
    {field: "name", headerName: "Name", width: 150},
    {field: "arrivalTime", headerName: "Arrival Time", width: 150},
    {field: "burstTime", headerName: "Burst Time", width: 150},
    {field: "description", headerName: "Description", width: 150},
    {field: "createdAt", headerName: "Created At", width: 150},
    {field: "updatedAt", headerName: "Updated At", width: 150},
  ]
  
  return (
      <Box maxWidth="lg" sx={{mt: 4, mb: 4}}>
        <Box display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="secondary"
            component={Link}
            to="/processs/create"
            style={{ marginBottom: "1rem"}}
          >
            New Process
          </Button>

        </Box>  

        <Typography variant="h3" component="h1">
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid 
              rowsPerPageOptions={[10, 20, 30, 100]}
              rows={rows} columns={columns} 
            />
          </div>
        </Typography>
      </Box>
    )
  
}