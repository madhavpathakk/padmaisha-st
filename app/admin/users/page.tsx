"use client";
import UserTable from "../../../components/UserTable";
import { useUsers } from "../../../hooks/useUsers";
import AddUserModal from "../../../components/AddUserModal";

export default function UsersPage() {
  const { users, loading, error } = useUsers();
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">Users</h2>
        <AddUserModal />
      </div>
      <UserTable users={users} loading={loading} error={error} />
    </div>
  );
}
