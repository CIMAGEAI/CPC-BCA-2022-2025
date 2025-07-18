import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaTrash, FaEdit, FaBoxOpen, FaUsers, FaUserShield, FaSave, FaChevronDown, FaBan, FaCheckCircle } from "react-icons/fa";
import { db } from "../firebase";
import { collection, doc, updateDoc, deleteDoc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../authContext";
import "../styles/AdminDashboard.css";

const CollapsibleHeader = ({ title, count, isOpen, onClick, className = '' }) => (
    <div className={`collapsible-header ${className}`} onClick={onClick}>
        <h3 className="section-header">
            <FaUserShield /> {title} <span className="item-count">({count})</span>
        </h3>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'open' : ''}`} />
    </div>
);

const UserCard = ({ user, currentUserRole, roleChanges, setRoleChanges, handleRoleChange, openDeleteModal, handleBlockToggle }) => {
    const canManageRole = currentUserRole === 'root_admin' && user.role !== 'root_admin';
    const canManageStatus = (currentUserRole === 'root_admin' && user.role !== 'root_admin') || (currentUserRole === 'admin' && user.role === 'user');

    return (
        <div className={`user-card ${user.isBlocked ? 'blocked' : ''}`}>
            <div className="user-info">
                <span className="user-email">{user.email || user.id}</span>
                <span className={`user-role-badge ${user.isBlocked ? 'badge-blocked' : ''}`}>{user.isBlocked ? 'Blocked' : (user.role || 'user')}</span>
            </div>
            <div className="user-actions">
                {canManageRole && (
                    <>
                        <select className="select-inline" value={roleChanges?.[user.id] || user.role} onChange={(e) => setRoleChanges({ ...roleChanges, [user.id]: e.target.value })}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {roleChanges?.[user.id] && roleChanges[user.id] !== user.role && <button className="action-btn save" title="Save Role" onClick={() => handleRoleChange(user.id)}><FaSave /></button>}
                    </>
                )}
                {canManageStatus && (
                    <>
                        <button className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`} onClick={() => handleBlockToggle(user.id, user.isBlocked)} title={user.isBlocked ? "Unblock User" : "Block User"}>
                            {user.isBlocked ? <FaCheckCircle /> : <FaBan />}
                        </button>
                        <button className="action-btn delete" title="Delete User" onClick={() => openDeleteModal(user)}><FaTrash /></button>
                    </>
                )}
            </div>
        </div>
    );
};

const DeleteUserModal = ({ user, onConfirm, onCancel }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <h3 className="modal-header">Confirm Deletion</h3>
            <div className="modal-body">
                <p>Are you sure you want to permanently delete the user:</p>
                <p className="modal-user-email">{user?.email || 'N/A'}</p>
            </div>
            <div className="modal-footer">
                <button className="modal-btn cancel" onClick={onCancel}>Cancel</button>
                <button className="modal-btn confirm" onClick={onConfirm}>Confirm Delete</button>
            </div>
        </div>
    </div>
);

const AdminButton = ({ icon, label, onClick, color }) => (
    <button className="admin-button" style={{ '--btn-color': color }} onClick={onClick}>
        {icon}
        {label && <span>{label}</span>}
    </button>
);


const AdminDashboard = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const [productCount, setProductCount] = useState(0);
    const [userCount, setUserCount] = useState(0);
    const [allUsers, setAllUsers] = useState([]);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [roleChanges, setRoleChanges] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [isUsersSectionOpen, setIsUsersSectionOpen] = useState(true);
    const [isAdminListOpen, setIsAdminListOpen] = useState(true);
    const [isUserListOpen, setIsUserListOpen] = useState(true);
    const [isBlockedListOpen, setIsBlockedListOpen] = useState(true);

    useEffect(() => {
        if (!currentUser) return;

        const productsRef = collection(db, "products");
        const unsubscribeProducts = onSnapshot(productsRef, (snapshot) => {
            setProductCount(snapshot.size); 
        }, (error) => {
            console.error("Error listening to product changes:", error);
        });

        const usersRef = collection(db, "users");
        const unsubscribeUsers = onSnapshot(usersRef, (snapshot) => {
            const usersData = snapshot.docs.map(uDoc => ({ id: uDoc.id, ...uDoc.data() }));
            setAllUsers(usersData);
            setUserCount(usersData.length); 
        }, (error) => {
            console.error("Error listening to user changes:", error);
        });

        const fetchUserRole = async () => {
            const userDocSnap = await getDoc(doc(db, "users", currentUser.uid));
            if (userDocSnap.exists()) {
                setCurrentUserRole(userDocSnap.data().role);
            }
        };
        fetchUserRole();

        return () => {
            unsubscribeProducts();
            unsubscribeUsers();
        };
    }, [currentUser]);

    const handleRoleChange = async (targetUserId) => {
        const newRole = roleChanges[targetUserId];
        if (!newRole) return;

        try {
            await updateDoc(doc(db, "users", targetUserId), { role: newRole });
            alert(`User role has been updated to ${newRole}.`);
            setAllUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, role: newRole } : u));
            setRoleChanges(prev => {
                const newChanges = { ...prev };
                delete newChanges[targetUserId];
                return newChanges;
            });
        } catch (error) {
            console.error("Error updating user role:", error);
            alert("Failed to update user role.");
        }
    };

    const handleBlockToggle = async (targetUserId, isCurrentlyBlocked) => {
        const newBlockedStatus = !isCurrentlyBlocked;
        const action = newBlockedStatus ? "block" : "unblock";
        if (window.confirm(`Are you sure you want to ${action} this user?`)) {
            try {
                await updateDoc(doc(db, "users", targetUserId), { isBlocked: newBlockedStatus });
                setAllUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, isBlocked: newBlockedStatus } : u));
            } catch (error) { console.error(`Error ${action}ing user:`, error); }
        }
    };
    
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        try {
            await deleteDoc(doc(db, "users", userToDelete.id));
            alert("User deleted successfully.");
        } catch (error) { 
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        } finally { 
            setIsModalOpen(false); 
            setUserToDelete(null); 
        }
    };
    
    const openDeleteModal = (user) => {
        setUserToDelete(user);
        setIsModalOpen(true);
    };

    const manageableUsers = allUsers.filter(user => user.id !== currentUser?.uid);
    const searchedUsers = manageableUsers.filter(user => user.email?.toLowerCase().includes(searchQuery.toLowerCase()));
    const activeUsers = searchedUsers.filter(u => !u.isBlocked);
    const blockedList = searchedUsers.filter(u => u.isBlocked);
    const adminList = activeUsers.filter(u => u.role === 'admin');
    const userList = activeUsers.filter(u => u.role === 'user' || !u.role);
    const userCardProps = { currentUserRole, roleChanges, setRoleChanges, handleRoleChange, openDeleteModal, handleBlockToggle };

    return (
        <div className="admin-dashboard-container">
            <div className="dashboard-card">
                <h2>Admin Panel</h2>
                <div className="stats-section">
                    <div className="stat-item"><FaBoxOpen className="stat-icon" style={{ color: "#2196f3" }} /><div className="stat-value">{productCount}</div><div className="stat-label">Total Products</div></div>
                    <div className="stat-item"><FaUsers className="stat-icon" style={{ color: "#ffb300" }} /><div className="stat-value">{userCount}</div><div className="stat-label">Total Users</div></div>
                </div>

                <div className="management-section">
                    <CollapsibleHeader title="Manage Users" count={manageableUsers.length} isOpen={isUsersSectionOpen} onClick={() => setIsUsersSectionOpen(!isUsersSectionOpen)} />
                    {isUsersSectionOpen && (
                        <div className="collapsible-content">
                            <div className="search-wrapper"><FaSearch className="search-icon" /><input type="search" placeholder="Search by email..." className="user-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /></div>
                            {currentUserRole === 'root_admin' && (
                                <div className="management-subsection">
                                    <CollapsibleHeader className="header-admins" title="Administrators" count={adminList.length} isOpen={isAdminListOpen} onClick={() => setIsAdminListOpen(!isAdminListOpen)} />
                                    {isAdminListOpen && <div className="user-list">{adminList.length > 0 ? adminList.map(user => <UserCard key={user.id} user={user} {...userCardProps} />) : <p className="no-users-message">No active administrators found.</p>}</div>}
                                </div>
                            )}
                            <div className="management-subsection">
                                <CollapsibleHeader className="header-users" title="Active Users" count={userList.length} isOpen={isUserListOpen} onClick={() => setIsUserListOpen(!isUserListOpen)} />
                                {isUserListOpen && <div className="user-list">{userList.length > 0 ? userList.map(user => <UserCard key={user.id} user={user} {...userCardProps} />) : <p className="no-users-message">No active users found.</p>}</div>}
                            </div>
                            <div className="management-subsection">
                                <CollapsibleHeader className="header-blocked" title="Blocked Users" count={blockedList.length} isOpen={isBlockedListOpen} onClick={() => setIsBlockedListOpen(!isBlockedListOpen)} />
                                {isBlockedListOpen && <div className="user-list">{blockedList.length > 0 ? blockedList.map(user => <UserCard key={user.id} user={user} {...userCardProps} />) : <p className="no-users-message">No blocked users found.</p>}</div>}
                            </div>
                        </div>
                    )}
                </div>

                <div className="management-section">
                    <h3 className="section-header"><FaBoxOpen /> Manage Products</h3>
                    <AdminButton icon={<FaPlus />} label="Add Product" onClick={() => navigate("/add-product")} color="#2196f3" />
                    <AdminButton icon={<FaEdit />} label="Edit Product" onClick={() => navigate("/edit-product")} color="#ffb300" />
                    <AdminButton icon={<FaTrash />} label="Delete Product" onClick={() => navigate("/delete-product")} color="#e74c3c" />
                </div>
            </div>
            {isModalOpen && <DeleteUserModal user={userToDelete} onConfirm={handleDeleteUser} onCancel={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default AdminDashboard;