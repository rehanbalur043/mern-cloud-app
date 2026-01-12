import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Box,
  Chip,
  Button,
  Card,
  CardContent
} from '@mui/material';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiService from '../../services/apiService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => apiService.getStats(),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome, {user?.username}!
        </Typography>
        <Chip
          label={user?.role === 'admin' ? 'Admin' : 'User'}
          color={user?.role === 'admin' ? 'error' : 'primary'}
          size="large"
        />
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Quick Actions</Typography>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                size="large"
              >
                View Products
              </Button>
            </Grid>
            {user?.role === 'admin' && (
              <Grid item>
                <Button
                  component={Link}
                  to="/admin/products"
                  variant="outlined"
                  size="large"
                  color="secondary"
                >
                  Manage Products
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Products
              </Typography>
              <Typography variant="h4">
                {stats?.totalProducts || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Electronics
              </Typography>
              <Typography variant="h4">
                {stats?.electronics || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Clothing
              </Typography>
              <Typography variant="h4">
                {stats?.clothing || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
