import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAuth,
  updatePassword,
  updateProfile,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { getDoc, doc, collection, addDoc, getDocs, deleteDoc as deleteFirestoreDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Settings.css';
import { FaChevronDown, FaExclamationTriangle, FaEye, FaEyeSlash } from 'react-icons/fa';

const ConfirmationModal = ({ message, onConfirm, onCancel, confirmText = "Confirm" }) => (
  <div className="settings-modal-overlay">
    <div className="settings-modal-content">
      <div className="settings-modal-icon"><FaExclamationTriangle /></div>
      <h3 className="settings-modal-header">Are you sure?</h3>
      <p className="settings-modal-body">{message}</p>
      <div className="settings-modal-footer">
        <button className="settings-modal-btn cancel" onClick={onCancel}>Cancel</button>
        <button className="settings-modal-btn confirm" onClick={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
);

const Message = ({ text, type }) => {
    if (!text) return null;
    return <div className={`${type}-message`}>{text}</div>;
};

const EditAddressModal = ({ address, onSave, onCancel }) => {
    const [editedAddress, setEditedAddress] = useState(address);

    const handleSaveClick = () => {
        if (!editedAddress.name || !editedAddress.address || !editedAddress.phone) {
            alert("Please fill out all fields.");
            return;
        }
        if (!/^\d{10}$/.test(editedAddress.phone)) {
            alert("Phone number must be 10 digits.");
            return;
        }
        onSave(editedAddress);
    };

    return (
        <div className="settings-modal-overlay">
            <div className="settings-modal-content">
                <h3 className="settings-modal-header">Edit Address</h3>
                <form className="settings-form" onSubmit={(e) => { e.preventDefault(); handleSaveClick(); }}>
                    <label>Full Name</label>
                    <input type="text" value={editedAddress.name} onChange={(e) => setEditedAddress({...editedAddress, name: e.target.value})} />
                    <label>Address</label>
                    <textarea value={editedAddress.address} onChange={(e) => setEditedAddress({...editedAddress, address: e.target.value})} rows="3"></textarea>
                    <label>Phone Number</label>
                    <input type="tel" value={editedAddress.phone} onChange={(e) => setEditedAddress({...editedAddress, phone: e.target.value})} maxLength="10" />
                </form>
                <div className="settings-modal-footer">
                    <button className="settings-modal-btn cancel" onClick={onCancel}>Cancel</button>
                    <button className="settings-modal-btn confirm save" onClick={handleSaveClick}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const Settings = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({ name: "", address: "", phone: "" });
  const [message, setMessage] = useState({ text: '', type: '', key: null });
  const [isAddressListOpen, setIsAddressListOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const providerId = user?.providerData?.[0]?.providerId;
  const isAdmin = userRole === 'admin' || userRole === 'root_admin';

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        setUserRole(userDocSnap.exists() ? userDocSnap.data().role || 'user' : 'user');

        const addressesColRef = collection(db, "users", user.uid, "addresses");
        const addressesSnapshot = await getDocs(addressesColRef);
        const addressesData = addressesSnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        setSavedAddresses(addressesData);
      };
      fetchData().catch(console.error);
    }
  }, [user]);

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/\d/.test(newPassword)) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(newPassword)) strength++;
    return strength;
  }, [newPassword]);

  const strengthText = useMemo(() => {
    const texts = ['Too Weak', 'Weak', 'Moderate', 'Strong', 'Very Strong'];
    return texts[passwordStrength];
  }, [passwordStrength]);
  
  const showMessage = (text, type, key) => {
    setMessage({ text, type, key });
    setTimeout(() => setMessage({ text: '', type: '', key: null }), 4000);
  };

  const openConfirmationModal = (action) => {
    setModalAction(action);
    setIsModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalAction?.fn) modalAction.fn();
    setIsModalOpen(false);
    setModalAction(null);
  };

  const openEditModal = (address) => {
    setEditingAddress(address);
    setIsEditModalOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName) return showMessage("Display name cannot be empty.", "error", "profile");
    try {
      await updateProfile(user, { displayName });
      showMessage("Profile updated successfully!", "success", "profile");
    } catch (error) {
      showMessage("Failed to update profile.", "error", "profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return showMessage("Please fill in all password fields.", "error", "password");
    if (currentPassword === newPassword) return showMessage("New password cannot be the same as the current one.", "error", "password");
    if (passwordStrength < 3) return showMessage("New password is too weak.", "error", "password");

    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      showMessage("Password changed successfully!", "success", "password");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      showMessage("Failed to change password. Check your current password.", "error", "password");
    }
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.address || !newAddress.phone) return showMessage("All address fields are required.", "error", "addAddress");
    if (!/^\d{10}$/.test(newAddress.phone)) return showMessage("Phone number must be 10 digits.", "error", "addAddress");
    try {
      const addressesColRef = collection(db, "users", user.uid, "addresses");
      const docRef = await addDoc(addressesColRef, newAddress);
      setSavedAddresses([...savedAddresses, { id: docRef.id, ...newAddress }]);
      setNewAddress({ name: "", address: "", phone: "" });
      showMessage("Address saved successfully!", "success", "addAddress");
    } catch (error) {
      showMessage("Failed to save address.", "error", "addAddress");
    }
  };

  const handleUpdateAddress = async (updatedAddress) => {
    try {
        const addressDocRef = doc(db, "users", user.uid, "addresses", updatedAddress.id);
        await updateDoc(addressDocRef, {
            name: updatedAddress.name,
            address: updatedAddress.address,
            phone: updatedAddress.phone,
        });
        setSavedAddresses(savedAddresses.map(addr => 
            addr.id === updatedAddress.id ? updatedAddress : addr
        ));
        setIsEditModalOpen(false);
        showMessage("Address updated successfully!", "success", "addressList");
    } catch (error) {
        console.error("Error updating address: ", error);
        showMessage("Failed to update address.", "error", "addressList");
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteFirestoreDoc(doc(db, "users", user.uid, "addresses", addressId));
      setSavedAddresses(savedAddresses.filter(addr => addr.id !== addressId));
      showMessage("Address deleted successfully!", "success", "addressList");
    } catch (error) {
      showMessage("Failed to delete address.", "error", "addressList");
    }
  };

  const handleDeleteAccount = async () => {
    if (isAdmin) return showMessage("Admin accounts cannot be deleted here.", "info", "deleteAccount");
    if (providerId === "password" && !currentPassword) return showMessage("Enter your current password to delete your account.", "error", "deleteAccount");
    try {
      if (providerId === "password") {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
      }
      await deleteUser(user);
      navigate('/');
    } catch (error) {
      showMessage("Failed to delete account. Please check your password.", "error", "deleteAccount");
    }
  };

  if (!user || !userRole) {
    return <div className="loading-container"><p>Loading...</p></div>;
  }

  return (
    <>
      {isModalOpen && <ConfirmationModal {...modalAction} onConfirm={handleModalConfirm} onCancel={() => setIsModalOpen(false)} />}
      {isEditModalOpen && (
        <EditAddressModal 
          address={editingAddress} 
          onSave={handleUpdateAddress}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
      <div className="settings-page-container">
        <div className="settings-card">
          <h2>Account Settings</h2>
          
          <div className="setting-section">
            <h3>Profile Information</h3>
            <form onSubmit={handleUpdateProfile} className="settings-form">
              <label>Display Name</label>
              <input type="text" value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
              {message.key === 'profile' && <Message text={message.text} type={message.type} />}
              <button type="submit">Update Profile</button>
            </form>
          </div>

          {providerId === "password" && (
            <div className="setting-section">
              <h3>Change Password</h3>
              <form onSubmit={handleChangePassword} className="settings-form">
                <label>Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <span className="password-toggle-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                <label>New Password</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span className="password-toggle-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {newPassword && (
                  <div>
                    <div className="password-strength">
                      {[1, 2, 3, 4].map(i => (
                        <span key={i} className={`strength-bar ${passwordStrength >= i ? 'filled' : ''}`} />
                      ))}
                    </div>
                    <p className="strength-text">{strengthText}</p>
                  </div>
                )}
                {message.key === 'password' && <Message text={message.text} type={message.type} />}
                <button type="submit">Change Password</button>
              </form>
            </div>
          )}

          <div className="setting-section">
            <div className="settings-collapsible-header" onClick={() => setIsAddressListOpen(!isAddressListOpen)}>
              <h3>Saved Shipping Addresses</h3>
              <FaChevronDown className={`settings-chevron-icon ${isAddressListOpen ? 'open' : ''}`} />
            </div>
            <div className={`settings-collapsible-content ${isAddressListOpen ? 'visible' : ''}`}>
              {message.key === 'addressList' && <Message text={message.text} type={message.type} />}
              <div className="settings-address-list">
                {savedAddresses.length > 0 ? (
                  savedAddresses.map(addr => (
                    <div key={addr.id} className="settings-saved-address-card">
                      <div className="settings-address-details">
                        <strong>{addr.name}</strong>
                        <p>{addr.address}</p><p>{addr.phone}</p>
                      </div>
                      <div className="settings-address-actions">
                        <button onClick={() => openEditModal(addr)} className="settings-edit-address-btn">Edit</button>
                        <button onClick={() => openConfirmationModal({
                            message: "This address will be permanently deleted.", confirmText: "Delete",
                            fn: () => handleDeleteAddress(addr.id)
                        })} className="settings-delete-address-btn">Delete</button>
                      </div>
                    </div>
                  ))
                ) : <p className="no-items-message">You have no saved addresses.</p>}
              </div>
            </div>
          </div>

          <div className="setting-section">
            <h3>Add a New Address</h3>
            <form onSubmit={handleSaveAddress} className="settings-form">
              <label>Full Name</label>
              <input type="text" value={newAddress.name} onChange={(e) => setNewAddress({...newAddress, name: e.target.value})} />
              <label>Address</label>
              <textarea value={newAddress.address} onChange={(e) => setNewAddress({...newAddress, address: e.target.value})} rows="3"></textarea>
              <label>Phone Number</label>
              <input type="tel" value={newAddress.phone} onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})} maxLength="10" />
              {message.key === 'addAddress' && <Message text={message.text} type={message.type} />}
              <button type="submit">Save Address</button>
            </form>
          </div>

          <div className="setting-section">
            <h3>Delete Account</h3>
            <p className="danger-text">Warning: This action is irreversible!</p>
            <form onSubmit={(e) => { e.preventDefault(); openConfirmationModal({
                  message: "Your account and all associated data will be permanently deleted.",
                  confirmText: "Delete My Account", fn: handleDeleteAccount
            });}} className="settings-form">
              {providerId === "password" && !isAdmin && (
                <>
                  <label htmlFor="deletePassword">Current Password:</label>
                  <input type="password" id="deletePassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                </>
              )}
              {message.key === 'deleteAccount' && <Message text={message.text} type={message.type} />}
              {isAdmin && <Message text="Admin accounts must be managed from the Admin Dashboard." type="info" />}
              <button type="submit" className="danger" disabled={isAdmin} title={isAdmin ? "Admin accounts cannot be deleted here." : "Delete your account"}>
                Delete Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;