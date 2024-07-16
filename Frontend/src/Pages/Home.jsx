import React from "react";
import AppLayout from "../Components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { bgGrayColor } from "../constant/color";

const Home = () => {
  return (
    <Box
      bgcolor={bgGrayColor}
      height={"100%"}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Typography p={"2rem"} color="#a0acd999" variant="h5" textAlign={"center"}>
        Welcome to Chat-app !<p>Select a friend to start chatting.</p>
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);
