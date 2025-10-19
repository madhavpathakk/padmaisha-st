"use client";
import React from "react";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Settings</h1>
      {require("../../../components/admin/Settings").default()}
    </div>
  );
}
