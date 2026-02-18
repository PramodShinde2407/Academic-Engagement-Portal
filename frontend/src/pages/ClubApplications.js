import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ClubApplications.css';
import api from '../api/axios';

export default function ClubApplications() {
    const { clubId } = useParams();
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [clubName, setClubName] = useState('');
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('Pending'); // Pending, Approved, Rejected, all
    const [toast, setToast] = useState(null);
    const [club, setClub] = useState(null);
    const [selectedApp, setSelectedApp] = useState(null); // For Modal

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchData();
    }, [clubId]);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');

            const clubRes = await api.get(`/clubs/${clubId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setClub(clubRes.data);
            setClubName(clubRes.data.name);

            const appsRes = await api.get(`/club-registrations/${clubId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(appsRes.data);
        } catch (err) {
            console.error(err);
            showToast('Failed to fetch data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            await api.put(
                `/club-registrations/${applicationId}/status`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setApplications(prev => prev.map(app =>
                app.application_id === applicationId ? {
                    ...app,
                    status: newStatus,
                } : app
            ));

            // Re-fetch to get updated partial statuses
            fetchData();

            showToast(`Application ${newStatus} successfully`);
        } catch (err) {
            showToast('Failed to update status', 'error');
        }
    };

    // Export function removed as per new requirements


    const handleBulkAction = async (newStatus) => {
        const pendingApps = applications.filter(app => app.status === 'Pending');
        if (pendingApps.length === 0) {
            showToast('No pending applications to update', 'info');
            return;
        }

        if (!window.confirm(`Are you sure you want to ${newStatus} ALL ${pendingApps.length} pending applications?`)) {
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await Promise.all(pendingApps.map(app =>
                api.put(
                    `/club-registrations/${app.application_id}/status`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            ));

            showToast(`Bulk ${newStatus} completed successfully`);
            fetchData();
        } catch (err) {
            console.error(err);
            showToast('Bulk update failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredApps = applications.filter(app =>
        filter === 'all' ? true : app.status === filter
    );

    if (loading) return <div className="loading-spinner">Loading applications...</div>;

    const isHead = Number(user.id) === Number(club?.club_head_id);
    const isMentor = Number(user.id) === Number(club?.club_mentor_id);
    const isAdmin = user.role_id === 4 || user.role_name === 'Admin';
    const canManage = isHead || isMentor || isAdmin;

    return (
        <div className="applications-container">
            <div className="applications-header">
                <div className="header-left">
                    <button className="back-btn" onClick={() => navigate(`/clubs/${clubId}`)}>← Back to Club</button>
                    <h1>{clubName} Applications</h1>
                </div>

                <div className="header-actions">
                    {canManage && (
                        <>
                            <button className="bulk-btn approve" onClick={() => handleBulkAction('Approved')}>
                                Approve All ✅
                            </button>
                            <button className="bulk-btn reject" onClick={() => handleBulkAction('Rejected')}>
                                Reject All ❌
                            </button>
                        </>
                    )}

                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                    >
                        <option value="Pending">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="all">All Applications</option>
                    </select>



                </div>
            </div>

            {applications.length === 0 ? (
                <div className="no-data">No applications received yet.</div>
            ) : filteredApps.length === 0 ? (
                <div className="no-data">No applications found with status "{filter}".</div>
            ) : (
                <div className="applications-grid">
                    {filteredApps.map(app => {
                        // Correctly derive user role flags inside map is inefficient but safe for now
                        const isHead = Number(user.id) === Number(club?.club_head_id);
                        const isMentor = Number(user.id) === Number(club?.club_mentor_id);
                        const isAdmin = user.role_id === 4 || user.role_name === 'Admin';

                        // Determine current user's specific status on this app
                        let myActionStatus = 'Pending';
                        if (isHead) myActionStatus = app.head_approval_status;
                        else if (isMentor) myActionStatus = app.mentor_approval_status;

                        return (
                            <div key={app.application_id} className="application-card">
                                <div className="card-header">
                                    <img
                                        src={`http://localhost:5000${app.photo_url}`}
                                        alt={app.full_name}
                                        className="applicant-photo"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                                    />
                                    <div className="applicant-info">
                                        <h3>{app.full_name}</h3>
                                        <span className={`status-badge ${app.status?.toLowerCase()}`}>{app.status}</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">College Email:</span>
                                        <span className="value">{app.college_email}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Year/Dept:</span>
                                        <span className="value">{app.year} / {app.department}</span>
                                    </div>

                                    <button
                                        className="view-details-btn"
                                        onClick={() => setSelectedApp(app)}
                                    >
                                        View Full Details
                                    </button>

                                    {/* Dual Approval Status Indicators */}
                                    <div className="approval-status-grid">
                                        <div className={`status-pill ${app.head_approval_status === 'Approved' ? 'approved' : 'pending'}`}>
                                            HEAD: {app.head_approval_status || 'Pending'}
                                        </div>
                                        <div className={`status-pill ${app.mentor_approval_status === 'Approved' ? 'approved' : 'pending'}`}>
                                            MENTOR: {app.mentor_approval_status || 'Pending'}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    {app.status === 'Pending' && (
                                        <div className="card-actions">
                                            {/* Show buttons if Admin OR if User hasn't acted yet */}
                                            {(isAdmin || (myActionStatus !== 'Approved' && myActionStatus !== 'Rejected')) ? (
                                                <>
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => handleStatusUpdate(app.application_id, 'Approved')}
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => handleStatusUpdate(app.application_id, 'Rejected')}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="action-feedback">
                                                    You marked: <strong>{myActionStatus}</strong>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}

            {/* Application Details Modal */}
            {selectedApp && (
                <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedApp(null)}>×</button>
                        <h2>Application Details</h2>

                        <div className="applicant-details">
                            <div className="detail-row">
                                <strong>Full Name:</strong> {selectedApp.full_name}
                            </div>
                            <div className="detail-row">
                                <strong>Roll No:</strong> {selectedApp.roll_no || 'N/A'}
                            </div>
                            <div className="detail-row">
                                <strong>Department:</strong> {selectedApp.department || 'N/A'}
                            </div>
                            <div className="detail-row">
                                <strong>Year:</strong> {selectedApp.year || 'N/A'}
                            </div>
                            <div className="detail-row">
                                <strong>Division:</strong> {selectedApp.division || 'N/A'}
                            </div>
                            <div className="detail-row">
                                <strong>Phone:</strong> {selectedApp.phone_no || 'N/A'}
                            </div>
                            <div className="detail-row">
                                <strong>College Email:</strong> {selectedApp.college_email}
                            </div>
                            <div className="detail-row">
                                <strong>Personal Email:</strong> {selectedApp.personal_email}
                            </div>
                            <div className="detail-row full-width">
                                <strong>Statement of Purpose:</strong>
                                <p className="sop-text-modal">{selectedApp.statement_of_purpose}</p>
                            </div>
                            <div className="detail-row">
                                <strong>Status:</strong> <span className={`status-badge ${selectedApp.status}`}>{selectedApp.status}</span>
                            </div>
                            <div className="detail-row">
                                <strong>Head Approval:</strong> {selectedApp.head_approval_status || 'Pending'}
                            </div>
                            <div className="detail-row">
                                <strong>Mentor Approval:</strong> {selectedApp.mentor_approval_status || 'Pending'}
                            </div>

                            {/* Action Buttons Inside Modal */}
                            {selectedApp.status === 'Pending' && (
                                <div className="modal-actions" style={{ marginTop: '20px', display: 'flex', gap: '10px', width: '100%' }}>
                                    {(() => {
                                        const isHead = Number(user.id) === Number(club?.club_head_id);
                                        const isMentor = Number(user.id) === Number(club?.club_mentor_id);
                                        const isAdmin = user.role_id === 4 || user.role_name === 'Admin';

                                        let myActionStatus = 'Pending';
                                        if (isHead) myActionStatus = selectedApp.head_approval_status;
                                        else if (isMentor) myActionStatus = selectedApp.mentor_approval_status;

                                        if (isAdmin || (myActionStatus !== 'Approved' && myActionStatus !== 'Rejected')) {
                                            return (
                                                <>
                                                    <button
                                                        className="approve-btn"
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedApp.application_id, 'Approved');
                                                            setSelectedApp(null);
                                                        }}
                                                    >
                                                        Approve Application
                                                    </button>
                                                    <button
                                                        className="reject-btn"
                                                        onClick={() => {
                                                            handleStatusUpdate(selectedApp.application_id, 'Rejected');
                                                            setSelectedApp(null);
                                                        }}
                                                    >
                                                        Reject Application
                                                    </button>
                                                </>
                                            );
                                        } else {
                                            return (
                                                <div className="action-feedback" style={{ width: '100%' }}>
                                                    You have already marked this as: <strong>{myActionStatus}</strong>
                                                </div>
                                            );
                                        }
                                    })()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
