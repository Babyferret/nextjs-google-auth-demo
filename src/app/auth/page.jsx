"use client";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PocketBase from "pocketbase";

export default function Page() {
  const router = useRouter();
  const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_API_URL);
  const [isShow, setShow] = useState(false);
  const [email, setEmail] = useState("");

  const Logout = async () => {
    const res = await fetch("/api/signout");
    if (res.ok) {
      const logoutUrl = "https://accounts.google.com/Logout";
      localStorage.clear();

      const iframe = document.createElement("iframe");
      iframe.src = logoutUrl;
      iframe.style.display = "none";
      document.body.appendChild(iframe);

      // window.location.href = logoutUrl;
      // window.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=http://localhost:3000/";
      router.push("/");
    }
  };

  const Show = async () => {
    const record = await pb.collection("users").getOne(pb.authStore.model.id);
    if (isShow == true) {
      setEmail("");
      setShow(false);
    } else {
      setEmail(record.email);
      setShow(true);
    }
    console.log("isShow", isShow);
    console.log(record);
  };
  return (
    <>
      <div className="flex justify-center w-full bg-red-gray shadow-lg p-5 item-center">
        <div className="flex justify-between w-1/2 items-center">
          <h1 className="text-xl text-bold">Welcome to protected page. </h1>
          <Button color="danger" onClick={Logout}>
            Logout
          </Button>
          <Button color={isShow ? "default" : "primary"} onClick={Show}>
            {isShow ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
      {isShow && (
        <div className="text-center p-5 w-fit mx-auto my-10 bg-red-200 rounded-xl">
          <h1 className="text-xl text-bold">{email}</h1>
        </div>
      )}
    </>
  );
}
