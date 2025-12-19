"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useAuth } from "@/context/auth-context"
import { getUsers, deleteUser } from "@/lib/mock-data"
import { getRoleDisplayName, getRoleColor } from "@/lib/utils"
import type { User } from "@/types"

export default function UsersPage() {
  const { isSignedIn, user } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/login")
    } else if (user?.role !== "admin") {
      router.push("/dashboard")
    }
  }, [isSignedIn, user, router])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const allUsers = getUsers()
    setUsers(allUsers)
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = roleFilter === "all" || u.role === roleFilter
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && u.isActive) ||
      (statusFilter === "inactive" && !u.isActive)
    return matchesSearch && matchesRole && matchesStatus
  })

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "admin").length,
    developers: users.filter((u) => u.role === "web_developer").length,
    coordinators: users.filter((u) => u.role === "social_media_coordinator").length,
    clients: users.filter((u) => u.role === "client").length,
    active: users.filter((u) => u.isActive).length,
  }

  const handleDeleteClick = (userToDelete: User) => {
    setUserToDelete(userToDelete)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = () => {
    if (userToDelete) {
      deleteUser(userToDelete.id)
      loadUsers()
      setShowDeleteModal(false)
      setUserToDelete(null)
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-muted">
        <div className="container py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">User Management</h1>
                <p className="text-muted-foreground">Manage system users and assign roles</p>
              </div>
              <Link href="/admin/users/new" className="btn-primary">
                + Add New User
              </Link>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="card text-center">
              <div className="text-2xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.admins}</div>
              <div className="text-sm text-muted-foreground">Admins</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-green-600">{stats.developers}</div>
              <div className="text-sm text-muted-foreground">Developers</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.coordinators}</div>
              <div className="text-sm text-muted-foreground">Coordinators</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.clients}</div>
              <div className="text-sm text-muted-foreground">Clients</div>
            </div>
            <div className="card text-center">
              <div className="text-2xl font-bold text-emerald-600">{stats.active}</div>
              <div className="text-sm text-muted-foreground">Active</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-foreground mb-2">Search Users</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or email..."
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                />
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="web_developer">Web Developer</option>
                  <option value="social_media_coordinator">Social Media Coordinator</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div className="w-full md:w-48">
                <label className="block text-sm font-medium text-foreground mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#1e2875] text-white">
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">#</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Name</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Email</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Phone</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Role</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Status</th>
                    <th className="px-4 py-3 text-left font-semibold border-r border-[#2a3488]">Created</th>
                    <th className="px-4 py-3 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                        No users found matching your criteria
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u, index) => (
                      <tr
                        key={u.id}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-blue-50 transition border-b border-gray-200`}
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-foreground">{u.fullName}</div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{u.email}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{u.phone}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${getRoleColor(
                              u.role
                            )}`}
                          >
                            {getRoleDisplayName(u.role)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                              u.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {u.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Link
                              href={`/admin/users/${u.id}`}
                              className="text-xs text-primary hover:underline"
                            >
                              View
                            </Link>
                            <Link
                              href={`/admin/users/${u.id}/edit`}
                              className="text-xs text-primary hover:underline"
                            >
                              Edit
                            </Link>
                            {u.id !== user.id && (
                              <button
                                onClick={() => handleDeleteClick(u)}
                                className="text-xs text-red-600 hover:underline"
                              >
                                Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Results Summary */}
            <div className="mt-4 pt-4 border-t border-border text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {users.length} users
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-foreground mb-4">Confirm Delete</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to delete user <strong>{userToDelete.fullName}</strong>? This
              action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setUserToDelete(null)
                }}
                className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
