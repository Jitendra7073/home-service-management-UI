"use client";

import { useState } from "react";
import { getAllUsers, restrictUser, liftUserRestriction } from "@/lib/api/admin";
import { Ban, Unlock, Search, Filter } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  isRestricted: boolean;
  restrictedAt: string | null;
  restrictionReason: string | null;
  createdAt: string;
  businessProfile?: {
    id: string;
    businessName: string;
    isApproved: boolean;
    isRestricted: boolean;
  } | null;
}

interface UsersTableProps {
  initialUsers: User[];
  initialPage: number;
  totalPages: number;
  total: number;
}

export function UsersTable({
  initialUsers,
  initialPage,
  totalPages,
  total,
}: UsersTableProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [page, setPage] = useState(initialPage);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [restrictionFilter, setRestrictionFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRestrict = async (userId: string) => {
    if (!reason.trim()) {
      alert("Please provide a reason for restriction");
      return;
    }

    setLoading(true);
    try {
      const res = await restrictUser(userId, reason);
      if (res.ok) {
        alert("User restricted successfully");
        setReason("");
        setSelectedUser(null);
        router.refresh();
      } else {
        alert(res.data?.message || "Failed to restrict user");
      }
    } catch (error) {
      alert("Error restricting user");
    } finally {
      setLoading(false);
    }
  };

  const handleLiftRestriction = async (userId: string) => {
    if (!confirm("Are you sure you want to lift the restriction?")) return;

    setLoading(true);
    try {
      const res = await liftUserRestriction(userId);
      if (res.ok) {
        alert("User restriction lifted successfully");
        router.refresh();
      } else {
        alert(res.data?.message || "Failed to lift restriction");
      }
    } catch (error) {
      alert("Error lifting restriction");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (roleFilter) params.append("role", roleFilter);
    if (restrictionFilter) params.append("isRestricted", restrictionFilter);
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Roles</option>
            <option value="customer">Customer</option>
            <option value="provider">Provider</option>
          </select>

          <select
            value={restrictionFilter}
            onChange={(e) => setRestrictionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="true">Restricted</option>
            <option value="false">Active</option>
          </select>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Joined
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <div className="text-xs text-gray-400">{user.mobile}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.businessProfile ? (
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.businessProfile.businessName}
                        </div>
                        <div className="text-xs">
                          {user.businessProfile.isApproved ? (
                            <span className="text-green-600">Approved</span>
                          ) : (
                            <span className="text-yellow-600">Pending</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isRestricted ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        <Ban className="h-3 w-3" />
                        Restricted
                      </span>
                    ) : (
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.isRestricted ? (
                      <button
                        onClick={() => handleLiftRestriction(user.id)}
                        disabled={loading}
                        className="text-green-600 hover:text-green-900 disabled:opacity-50 flex items-center gap-1 ml-auto"
                      >
                        <Unlock className="h-4 w-4" />
                        Lift Restriction
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedUser(user)}
                        disabled={loading}
                        className="text-red-600 hover:text-red-900 disabled:opacity-50 flex items-center gap-1 ml-auto"
                      >
                        <Ban className="h-4 w-4" />
                        Restrict
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {users.length} of {total} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                const newPage = Math.max(1, page - 1);
                setPage(newPage);
                router.push(`/admin/users?page=${newPage}`);
              }}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => {
                const newPage = Math.min(totalPages, page + 1);
                setPage(newPage);
                router.push(`/admin/users?page=${newPage}`);
              }}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Restriction Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Restrict User - {selectedUser.name}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for restricting this user. The user will be
              notified via email.
            </p>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for restriction..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setSelectedUser(null);
                  setReason("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRestrict(selectedUser.id)}
                disabled={loading || !reason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "Restricting..." : "Restrict User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
