import { useState } from 'react';
import './RegistrationModal.css';
import api from '../api/axios';

export default function RegistrationModal({ clubId, clubName, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        full_name: '',
        personal_email: '',
        college_email: '',
        roll_no: '',
        year: '',
        division: '',
        department: '',
        phone_no: '',
        statement_of_purpose: ''
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const ext = file.name.split('.').pop().toLowerCase();
        if (!['jpg', 'jpeg', 'png'].includes(ext)) {
            setError('Format not supported. Please upload a JPG or PNG image.');
            e.target.value = '';
            return;
        }

        setError('');
        setProfilePhoto(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all required fields
        const requiredFields = ['full_name', 'personal_email', 'college_email', 'roll_no', 'year', 'division', 'department', 'phone_no', 'statement_of_purpose'];
        for (let field of requiredFields) {
            if (!formData[field]) {
                setError(`Please fill ${field.replace(/_/g, ' ')}`);
                return;
            }
        }

        // Validate College Email Domain
        if (!formData.college_email.endsWith('@pict.edu')) {
            setError('College email must end with @pict.edu');
            return;
        }

        if (!profilePhoto) {
            setError('Profile photo is required');
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('full_name', formData.full_name);
        data.append('personal_email', formData.personal_email);
        data.append('college_email', formData.college_email);
        data.append('roll_no', formData.roll_no);
        data.append('year', formData.year);
        data.append('division', formData.division);
        data.append('department', formData.department);
        data.append('phone_no', formData.phone_no);
        data.append('statement_of_purpose', formData.statement_of_purpose);
        data.append('profile_photo', profilePhoto);

        try {
            const token = localStorage.getItem('token');
            await api.post(`/club-registrations/${clubId}/register`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            });
            onSuccess('Registration submitted successfully!');
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="registration-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>✕</button>

                <h2>Register for {clubName}</h2>

                <form onSubmit={handleSubmit}>
                    <label>Full Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    />

                    <label>Personal Email *</label>
                    <input
                        type="email"
                        required
                        value={formData.personal_email}
                        onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
                    />

                    <label>College Email *</label>
                    <input
                        type="email"
                        required
                        placeholder="example@pict.edu"
                        value={formData.college_email}
                        onChange={(e) => setFormData({ ...formData, college_email: e.target.value })}
                    />

                    <label>Roll Number *</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g., CS2021001"
                        value={formData.roll_no}
                        onChange={(e) => setFormData({ ...formData, roll_no: e.target.value })}
                    />

                    <label>Year of Study *</label>
                    <select
                        required
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                    >
                        <option value="">Select Year</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                    </select>

                    <label>Division *</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g., A, B, C"
                        maxLength={2}
                        value={formData.division}
                        onChange={(e) => setFormData({ ...formData, division: e.target.value.toUpperCase() })}
                    />

                    <label>Department *</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g., Computer Science"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />

                    <label>Phone Number *</label>
                    <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        pattern="[0-9]{10}"
                        value={formData.phone_no}
                        onChange={(e) => setFormData({ ...formData, phone_no: e.target.value })}
                    />

                    <label>Why are you aiming to join this club? *</label>
                    <textarea
                        required
                        rows={4}
                        value={formData.statement_of_purpose}
                        onChange={(e) => setFormData({ ...formData, statement_of_purpose: e.target.value })}
                    />

                    <label>Profile Photo (JPG/PNG) *</label>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png"
                        required
                        onChange={handleFileChange}
                    />
                    {profilePhoto && <p className="file-name">✓ {profilePhoto.name}</p>}

                    {error && <p className="error-message">{error}</p>}

                    <button type="submit" disabled={loading} className="submit-btn">
                        {loading ? 'Submitting...' : 'Submit Registration'}
                    </button>
                </form>
            </div>
        </div>
    );
}
