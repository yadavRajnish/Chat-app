import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import { transformImage } from "../../lib/features";
import moment from "moment";

const Profile = ({ user }) => {
  return (
    <Stack  spacing={"2rem"} direction={"column"} alignItems={"center"}
    sx={{
      backgroundColor: '#2e2e2eb3',
      padding: '2rem',
      borderRadius: '10px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      maxWidth: '400px',
      margin: 'auto',
    
    }}
    >
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />

      <ProfileCard heading={"Bio"} text={user?.bio} />

      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />

      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />

      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    // color={"white"}
    // textAlign={"center"}
    sx={{
      color: 'white',
      textAlign: 'center',
      backgroundColor: '#2c2e2f',
      padding: '1rem',
      borderRadius: '5px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      width: '100%',
    }}
  >
    {/* {Icon && Icon} */}
    {Icon && <div>{Icon}</div>}

    <Stack>
      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
