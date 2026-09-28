// components/dashboard/admin/ManageUsersTable.jsx
"use client";

import { useState, useMemo } from "react";
import { Avatar, Button, Input } from "@heroui/react";
import {
  Search,
  ArrowUpDown,
  UserX,
  UserCheck,
  Loader2,
  Calendar,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";
import { banUsers, unbanUsers } from "@/lib/actions/users";

export default function ManageUsersTable({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "desc" = newest first, "asc" = oldest first
  const [loadingUserId, setLoadingUserId] = useState(null);

  // Toggle Sort Order
  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  // Filter & Sort Logic
  const filteredUsers = useMemo(() => {
    return [...users]
      .filter((user) => {
        const query = searchTerm.toLowerCase();
        const nameMatch = user.name?.toLowerCase().includes(query);
        const emailMatch = user.email?.toLowerCase().includes(query);
        const roleMatch = user.role?.toLowerCase().includes(query);
        return nameMatch || emailMatch || roleMatch;
      })
      .sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      });
  }, [users, searchTerm, sortOrder]);

  // Handle Ban / Unban Toggle
  const handleToggleBan = async (user) => {
    const isBanned = Boolean(user.banned);
    setLoadingUserId(user.id);

    try {
      if (isBanned) {
        await unbanUsers(user.id);
      } else {
        await banUsers(user.id, "Violation of platform policies");
      }

      // Optimistic UI state update
      setUsers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? {
                ...u,
                banned: !isBanned,
                banReason: !isBanned ? "Admin Blocked" : null,
              }
            : u,
        ),
      );
    } catch (error) {
      console.error("Failed to update user ban state:", error);
    } finally {
      setLoadingUserId(null);
    }
  };

  // Status Badge Helper
  const renderStatus = (isBanned) => {
    if (isBanned) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <ShieldAlert size={12} />
          <span>Banned</span>
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
        <ShieldCheck size={12} />
        <span>Active</span>
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Control Bar: Search + Sort Toggle */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-default-400"
          />
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 w-full rounded-xl border border-default-200/80 bg-background pl-10 pr-4 text-xs font-medium text-foreground placeholder:text-default-400 focus:border-orange-500 focus:outline-none dark:border-default-100/15 dark:bg-[#121214]"
          />
        </div>

        {/* Sort by Date Button */}
        <Button
          size="sm"
          variant="secondary"
          onPress={handleToggleSort}
          className="flex h-10 items-center gap-2 rounded-xl border border-default-200/80 px-3.5 text-xs font-semibold text-foreground hover:bg-default-100 dark:border-default-100/15 dark:bg-[#121214] dark:hover:bg-default-100/10"
        >
          <ArrowUpDown size={14} className="text-orange-500" />
          <span>
            Sort by Date:{" "}
            {sortOrder === "desc" ? "Newest First" : "Oldest First"}
          </span>
        </Button>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-default-200/80 bg-background shadow-sm transition-colors dark:border-default-100/15 dark:bg-[#121214] dark:shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-default-200/80 bg-default-100/60 text-xs font-bold uppercase tracking-wider text-default-500 dark:border-default-100/15 dark:bg-[#161619] dark:text-default-400">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-default-200/60 text-foreground dark:divide-default-100/15 dark:text-default-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-xs text-default-500"
                  >
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isBanned = Boolean(user.banned);
                  const isLoading = loadingUserId === user.id;

                  const joinedDate = user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "N/A";

                  return (
                    <tr
                      key={user.id}
                      className="transition-colors hover:bg-default-100/50 dark:hover:bg-default-100/[0.04]"
                    >
                      {/* 1. Avatar + Name + Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 shrink-0 rounded-xl border border-default-200/70 bg-default-100 ring-1 ring-orange-500/20 dark:border-default-100/15 dark:bg-default-100/10">
                            <Avatar.Image
                              src={user.image}
                              alt={user.name || "User"}
                              className="object-cover"
                            />
                            <Avatar.Fallback className="text-xs font-bold text-orange-500">
                              {user.name
                                ? user.name.slice(0, 2).toUpperCase()
                                : "U"}
                            </Avatar.Fallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground">
                              {user.name || "Unnamed User"}
                            </span>
                            <span className="text-[11px] text-default-400">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 2. Platform Role */}
                      <td className="px-6 py-4">
                        <span className="inline-block rounded-full border border-default-200/80 bg-default-100 px-2.5 py-0.5 text-[11px] font-semibold capitalize text-default-700 dark:border-default-100/15 dark:bg-[#1c1c20] dark:text-default-300">
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* 3. Account Status Badge */}
                      <td className="px-6 py-4">{renderStatus(isBanned)}</td>

                      {/* 4. Joined Date */}
                      <td className="px-6 py-4 text-default-600 dark:text-default-400">
                        <div className="flex items-center gap-1.5 text-xs">
                          <Calendar size={13} className="text-default-400" />
                          <span>{joinedDate}</span>
                        </div>
                      </td>

                      {/* 5. Block / Unblock Actions */}
                      <td className="px-6 py-4 text-right">
                        {isLoading ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-default-500">
                            <Loader2
                              size={14}
                              className="animate-spin text-orange-500"
                            />
                            <span>Updating...</span>
                          </div>
                        ) : isBanned ? (
                          <Button
                            size="sm"
                            onPress={() => handleToggleBan(user)}
                            className="h-8 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-500/20 dark:border-emerald-800/40 dark:bg-emerald-950/40 dark:text-emerald-400 dark:hover:bg-emerald-900/60"
                          >
                            <UserCheck size={13} />
                            <span>Unblock</span>
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onPress={() => handleToggleBan(user)}
                            className="h-8 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-500/20 dark:border-rose-800/40 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/60"
                          >
                            <UserX size={13} />
                            <span>Block</span>
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
