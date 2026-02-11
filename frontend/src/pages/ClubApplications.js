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
    const [filter, setFilter] = useState('pending'); // pending, approved, rejected, all
    const [toast, setToast] = useState(null);
    const [club, setClub] = useState(null);

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

    const handleExport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get(`/club-registrations/${clubId}/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${clubName}_applications.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            showToast('Export failed', 'error');
        }
    };

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
                        <option value="pending">Pending Review</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                        <option value="all">All Applications</option>
                    </select>

                    <button className="export-btn" onClick={handleExport}>
                        Export Data 📥
                    </button>
                </div>
            </div>

            {applications.length === 0 ? (
                <div className="no-data">No applications received yet.</div>
            ) : filteredApps.length === 0 ? (
                <div className="no-data">No applications found with status "{filter}".</div>
            ) : (
                <div className="applications-grid">
                    {filteredApps.map(app => {
                        const isHead = user.id === club?.club_head_id;
                        const isMentor = user.id === club?.club_mentor_id;
                        const isAdmin = user.role_id === 4 || user.role_name === 'Admin';

                        const myStatus = isHead ? app.head_approval_status :
                            isMentor ? app.mentor_approval_status :
                                null;

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
                                        <span className={`status-badge ${app.status}`}>{app.status}</span>
                                    </div>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">College Email:</span>
                                        <a href={`mailto:${app.college_email}`} className="value">{app.college_email}</a>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Personal Email:</span>
                                        <a href={`mailto:${app.personal_email}`} className="value">{app.personal_email}</a>
                                    </div>
                                    <div className="info-row sop-section">
                                        <span className="label">Statement of Purpose:</span>
                                        <p className="sop-text">{app.statement_of_purpose}</p>
                                    </div>
                                    <div className="info-row">
                                        <span className="label">Applied:</span>
                                        <span className="value">{new Date(app.applied_at).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                {app.status === 'Pending' && (
                                    <div className="card-actions">
                                        <div className="approval-status-indicators">
                                            <span className={`status-pill ${app.head_approval_status === 'Approved' ? 'approved' : 'pending'}`}>
                                                Head: {app.head_approval_status || 'Pending'}
                                            </span>
                                            <span className={`status-pill ${app.mentor_approval_status === 'Approved' ? 'approved' : 'pending'}`}>
                                                Mentor: {app.mentor_approval_status || 'Pending'}
                                            </span>
                                        </div>

                                        {(isHead || isMentor || isAdmin) && (
                                            <div className="actions-group">
                                                {(isAdmin || (myStatus !== 'Approved' && myStatus !== 'Rejected')) ? (
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
                                                    <span className={`my-status-pill ${myStatus?.toLowerCase()}`}>
                                                        You marked: {myStatus}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
        </div>
    );
}
