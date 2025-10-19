"use client";
import dynamic from "next/dynamic";

const NotificationBar = dynamic(() => import("./NotificationBar"), { ssr: false });
export default NotificationBar;
