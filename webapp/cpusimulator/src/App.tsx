import { Typography } from '@mui/material';
import { Box, ThemeProvider } from '@mui/system';
import React from 'react';
import { Route, Router, Routes } from 'react-router-dom';
import './App.css';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { appTheme } from './config/theme';
import { CreateProcess } from './features/categories/CreateProcess';
import { EditProcess } from './features/categories/EditProcess';
import { ListProcess } from './features/categories/ListProcess';

function App() {
  return(
  <ThemeProvider theme={appTheme}>
    <Box 
      component="main"
      sx={{
        height: "100vh",
        backgroundColor: (theme) => theme.palette.grey[900],
      }}
    >
      <Header />
      <Layout>
        <Routes>  
          <Route path="/" element={<ListProcess />} />
          <Route path="/process" element={<ListProcess />} />
          <Route path="/process/create" element={<CreateProcess />} />
          <Route path="/process/edit/:id" element={<EditProcess />} />

          <Route path="*" element={
            <Box>
              <Typography variant="h1">
                <strong>404</strong> </Typography>
              <Typography variant="h2">Page not Found</Typography>
            </Box>
          }> 
          </Route>
        </Routes>
      </Layout>
    </Box>
  </ThemeProvider>
  );
}

export default App
