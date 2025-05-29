"use client";
import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut } from "next-auth/react";
import axios from "axios";
import { LOGOUT_URL } from "@/lib/constants";
import Link from "next/link";
// import { useUser } from "@/context/UserContext";

export default function ProfileAvatar({ user }) {
  
  // const { profilePic, setProfilePic } = useUser();

  // useEffect(() => {

  //   const getUseProfilePic = () => {
  //     axios.get(`${USER_URL}/${user.id}`, 
  //       {
  //         headers: {
  //           Authorization: `Bearer ${user?.token}`
  //         }
  //       })
  //       .then(response => {
  //         // if (response.data.user && response.data.user.image) {
  //         //     setProfilePic(getImageUrl(response.data.user.image)); 
  //         // }
  //       })
  //       .catch(error => {
  //           console.error("Failed to fetch packages", error);
  //       });
  //   };

  //   getUseProfilePic();
  // }, [user.id, user.token, setProfilePic]);

  const logout = () => {
    axios
      .post(
        LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {        
        const response = res.data;
        if (response?.status === 200) {
          signOut({ callbackUrl: "/" });
        }
      })
      .catch((err) => {
        console.log(err);
        
        // toast.error("Something went wrong. please try again", {
        //   theme: "colored",
        // });
      });

    signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://github.com/shadcn.png" />
          {/* <AvatarImage src={profilePic} /> */}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom">
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>
          <Link href="/dashboard/profile">My Profile</Link>
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
