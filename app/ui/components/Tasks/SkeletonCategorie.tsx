import * as React from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

export default function SkeletonCategorie() {
  return (
    <Box sx={{ width: '100%' }}>
      <Skeleton height={35} animation="wave" />
      <Skeleton height={35} animation="wave" />
      <Skeleton height={35} animation="wave" />
    </Box>
  );
}