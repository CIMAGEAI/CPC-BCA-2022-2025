import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../authContext";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import "../styles/SubmitDetailsPage.css";
import { FaChevronDown } from "react-icons/fa";

const SubmitDetailsPage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
    const [error, setError] = useState("");
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [isAddressListOpen, setIsAddressListOpen] = useState(true);
    const [shouldSaveAddress, setShouldSaveAddress] = useState(false);

    useEffect(() => {
        if (!state || !state.products || state.products.length === 0) {
            navigate("/");
        }
        if (currentUser) {
            const fetchAddresses = async () => {
                const addressesColRef = collection(db, "users", currentUser.uid, "addresses");
                const addressesSnapshot = await getDocs(addressesColRef);
                const addressesData = addressesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setSavedAddresses(addressesData);
            };
            fetchAddresses().catch(console.error);
        }
    }, [state, navigate, currentUser]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setSelectedAddressId(null);
    };

    const handleSelectAddress = (address) => {
        setFormData({
            name: address.name,
            address: address.address,
            phone: address.phone,
        });
        setSelectedAddressId(address.id);
        setShouldSaveAddress(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.address || !formData.phone) {
            setError("Please fill in all details.");
            return;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
            setError("Phone number must be exactly 10 digits.");
            return;
        }
        setError("");

        if (currentUser && shouldSaveAddress) {
            const isDuplicate = savedAddresses.some(
                addr =>
                    addr.name.trim() === formData.name.trim() &&
                    addr.address.trim() === formData.address.trim() &&
                    addr.phone.trim() === formData.phone.trim()
            );

            if (isDuplicate) {
                alert("This address is already saved.");
            } else {
                try {
                    const addressesColRef = collection(db, "users", currentUser.uid, "addresses");
                    await addDoc(addressesColRef, formData);
                    console.log("Address saved successfully!");
                } catch (saveError) {
                    console.error("Failed to save new address:", saveError);
                    setError("Could not save address, but you can still proceed.");
                }
            }
        }

        navigate("/payment", {
            state: {
                products: state.products,
                shippingDetails: formData,
            },
        });
    };

    if (!state || !state.products) return null;

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Shipping Details</h2>
            
            {savedAddresses.length > 0 && (
                <div className="saved-addresses-section">
                    <div className="checkout-collapsible-header" onClick={() => setIsAddressListOpen(!isAddressListOpen)}>
                        <h4>Select a Saved Address</h4>
                        <FaChevronDown className={`checkout-chevron-icon ${isAddressListOpen ? 'open' : ''}`} />
                    </div>
                    <div className={`checkout-collapsible-content ${isAddressListOpen ? 'visible' : ''}`}>
                        <div className="address-list-checkout">
                            {savedAddresses.map(addr => (
                                <div 
                                    key={addr.id} 
                                    className={`saved-address-card-checkout ${selectedAddressId === addr.id ? 'selected' : ''}`}
                                    onClick={() => handleSelectAddress(addr)}
                                >
                                    <strong>{addr.name}</strong>
                                    <p>{addr.address}</p>
                                    <p>{addr.phone}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="or-divider"><span>OR ENTER NEW DETAILS BELOW</span></div>
                </div>
            )}

            <form className="details-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="form-input" required />
                </div>
                <div className="form-group">
                    <label htmlFor="address">Delivery Address</label>
                    <textarea id="address" name="address" value={formData.address} onChange={handleChange} className="form-input" rows="3" required></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="form-input" required maxLength="10" pattern="\d{10}" />
                </div>

                {currentUser && (
                    <div className="form-group save-address-group">
                        <input
                            type="checkbox"
                            id="saveAddress"
                            checked={shouldSaveAddress}
                            onChange={(e) => setShouldSaveAddress(e.target.checked)}
                        />
                        <label htmlFor="saveAddress">Save this address for future use</label>
                    </div>
                )}

                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="checkout-confirm-btn">
                    Proceed to Payment
                </button>
            </form>
        </div>
    ); 
};

export default SubmitDetailsPage;
