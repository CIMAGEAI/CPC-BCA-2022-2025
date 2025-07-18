import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase'; 
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore'; 
import '../styles/Account.css'; 
import { FaUserCircle } from 'react-icons/fa';
import SessionItem from '../components/SessionItem';

const Account = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(auth.currentUser);
    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const currentSessionId = localStorage.getItem('sessionId');

    const BACKEND_URL = process.env.NODE_ENV === 'production' 
        ? 'https://ecommerce-app-pi86.onrender.com' 
        : 'http://localhost:5000';

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [auth]);

    useEffect(() => {
        if (user) {
            const sessionsQuery = query(
                collection(db, 'users', user.uid, 'sessions'),
                orderBy('lastSeen', 'desc')
            );
            
            const unsubscribe = onSnapshot(sessionsQuery, (snapshot) => {
                const fetchedSessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSessions(fetchedSessions);

                const currentSessionExists = fetchedSessions.some(s => s.id === currentSessionId);
                if (loadingSessions === false && !currentSessionExists && currentSessionId) {
                    console.log("Current session revoked. Forcing logout.");
                    signOut(auth).then(() => {
                        localStorage.removeItem('sessionId');
                        navigate('/login?message=logged_out_remotely');
                    });
                }

                setLoadingSessions(false);
            }, (error) => {
                console.error("Error listening to sessions:", error);
                setLoadingSessions(false);
            });

            return () => unsubscribe();
        } else {
            setLoadingSessions(false);
        }
    }, [auth, user, currentSessionId, navigate, loadingSessions]);


    const handleSignOut = () => {
        signOut(auth).then(() => {
            localStorage.removeItem('sessionId');
            navigate('/');
        }).catch((error) => console.error("Sign out error", error));
    }

    const handleLogoutSession = async (sessionId) => {
        try {
            await fetch(`${BACKEND_URL}/api/sessions/logout-specific`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, sessionId: sessionId }),
            });
        } catch (error) {
            console.error("Failed to log out session:", error);
        }
    };
    
    const handleLogoutAll = async () => {
        try {
            await fetch(`${BACKEND_URL}/api/sessions/logout-all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.uid, currentSessionId: currentSessionId }),
            });
        } catch (error) {
            console.error("Failed to log out all sessions:", error);
        }
    };

    if (!user) {
        return (
            <div className="account-container not-logged-in">
                <h2>Access Denied</h2>
                <p>Please <Link to="/login">log in</Link> to view your account details.</p>
            </div>
        );
    }

    return (
        <div className="account-container">
            <div className="profile-header">
                {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="profile-picture" referrerPolicy="no-referrer" />
                ) : (
                    <FaUserCircle className="profile-picture default-icon" />
                )}
                <div className="profile-info">
                    <h2 className="profile-name">{user.displayName || 'Welcome'}</h2>
                    <p className="profile-email">{user.email}</p>
                </div>
                <button onClick={handleSignOut} className="btn-logout">Sign Out</button>
            </div>

            <div className="account-section">
                <h3>Active Sessions</h3>
                <div className="session-list">
                    {loadingSessions ? <p>Loading sessions...</p> : (
                        sessions.map(session => (
                            <SessionItem 
                                key={session.id} 
                                session={session}
                                onLogout={handleLogoutSession}
                                isCurrent={session.id === currentSessionId}
                            />
                        ))
                    )}
                </div>
                {sessions.length > 1 && (
                    <button className="btn-logout-all" onClick={handleLogoutAll}>
                        Log Out From All Other Devices
                    </button>
                )}
            </div>
        </div>
    );
};

export default Account;