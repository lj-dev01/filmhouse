import { useEffect, useState } from "react";

import api from "../../services/api";

function AdminUsersTab({ onAdminApiError }) {
    // Admin users state
    const [adminUsers, setAdminUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [usersError, setUsersError] = useState("");

    // Load users
    useEffect(() => {
        async function fetchAdminUsers() {
            try {
                setLoadingUsers(true);

                const response = await api.get("/users/admin/all");

                const sortedUsers = response.data.sort((a, b) => {
                    if (a.role === "admin" && b.role !== "admin") return -1;
                    if (a.role !== "admin" && b.role === "admin") return 1;
                    return a.id - b.id;
                });

                setAdminUsers(sortedUsers);
            } catch (error) {
                const detail = error.response?.data?.detail || "";

                if (onAdminApiError?.(error)) {
                    return;
                }

                setUsersError(
                    detail || "Failed to load users. Please try again."
                );
            } finally {
                setLoadingUsers(false);
            }
        }

        fetchAdminUsers();
    }, [onAdminApiError]);

    return (
        <div>
            {/* Admin users header */}
            <div className="admin-section-header">
                <div>
                    <h2>All Users</h2>
                    <p>View registered users and their assigned roles.</p>
                </div>
            </div>

            {/* Admin users messages */}
            {loadingUsers && <p>Loading users...</p>}
            {usersError && <p className="error-message">{usersError}</p>}

            {/* Admin users table */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>

                    <tbody>
                        {adminUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`admin-role-badge ${user.role}`}>
                                        {user.role}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AdminUsersTab;
