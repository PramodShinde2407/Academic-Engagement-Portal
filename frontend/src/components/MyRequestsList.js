import { useState, useEffect } from "react";
import api from "../api/axios";
import "./MyRequests.css";

export default function MyRequestsList() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchMyRequests();
    }, []);

    const fetchMyRequests = async () => {
        try {
            const response = await api.get("/permissions/my-requests");
            setRequests(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'pending_club_mentor': { label: 'Pending Club Mentor', class: 'status-pending' },
            'pending_estate_manager': { label: 'Pending Estate Manager', class: 'status-pending' },
            'pending_principal': { label: 'Pending Principal', class: 'status-pending' },
            'pending_director': { label: 'Pending Director', class: 'status-pending' },
            'approved': { label: 'Approved', class: 'status-approved' },
            'rejected': { label: 'Rejected', class: 'status-rejected' }
        };

        const config = statusConfig[status] || { label: status, class: '' };
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    const viewDetails = (request) => {
        setSelectedRequest(request);
    };

    const closeModal = () => {
        setSelectedRequest(null);
    };

    if (loading) {
        return <div className="loading">Loading your requests...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="my-requests-container">
            <div className="requests-header">
                <h2>My Permission Requests</h2>
                <button
                    className="btn-create"
                    onClick={() => window.location.href = "/create-permission"}
                >
                    + New Request
                </button>
            </div>

            {requests.length === 0 ? (
                <div className="empty-state">
                    <p>You haven't submitted any permission requests yet.</p>
                    <button
                        className="btn-primary"
                        onClick={() => window.location.href = "/create-permission"}
                    >
                        Create Your First Request
                    </button>
                </div>
            ) : (
                <div className="requests-grid">
                    {requests.map((request) => (
                        <div key={request.request_id} className="request-card">
                            <div className="request-header">
                                <h3>{request.subject}</h3>
                                {getStatusBadge(request.current_status)}
                            </div>

                            <div className="request-details">
                                <div className="detail-row">
                                    <span className="label">Location:</span>
                                    <span>{request.location}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Date:</span>
                                    <span>{new Date(request.event_date).toLocaleDateString()}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Time:</span>
                                    <span>{request.start_time} - {request.end_time}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="label">Submitted:</span>
                                    <span>{new Date(request.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {request.current_status === 'rejected' && request.approval_history?.length > 0 && (
                                <div className="rejection-notice">
                                    <strong>Rejected by:</strong> {request.approval_history[request.approval_history.length - 1].approver_role}
                                    <br />
                                    <strong>Reason:</strong> {request.approval_history[request.approval_history.length - 1].remarks}
                                </div>
                            )}

                            <button
                                className="btn-view-details"
                                onClick={() => viewDetails(request)}
                            >
                                View Details & History
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for request details */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{selectedRequest.subject}</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            <div className="info-section">
                                <h4>Event Details</h4>
                                <p><strong>Description:</strong> {selectedRequest.description}</p>
                                <p><strong>Location:</strong> {selectedRequest.location}</p>
                                <p><strong>Date:</strong> {new Date(selectedRequest.event_date).toLocaleDateString()}</p>
                                <p><strong>Time:</strong> {selectedRequest.start_time} - {selectedRequest.end_time}</p>
                            </div>

                            <div className="info-section">
                                <h4>Approval History</h4>
                                {selectedRequest.approval_history && selectedRequest.approval_history.length > 0 ? (
                                    <div className="timeline">
                                        {selectedRequest.approval_history.map((action, index) => (
                                            <div key={action.action_id} className="timeline-item">
                                                <div className={`timeline-marker ${action.action === 'approved' ? 'approved' : 'rejected'}`}></div>
                                                <div className="timeline-content">
                                                    <div className="timeline-header">
                                                        <strong>{action.approver_role}</strong>
                                                        <span className={`action-badge ${action.action}`}>{action.action}</span>
                                                    </div>
                                                    <div className="timeline-meta">
                                                        {action.approver_name} • {new Date(action.action_date).toLocaleString()}
                                                    </div>
                                                    {action.remarks && (
                                                        <div className="timeline-remarks">
                                                            <em>"{action.remarks}"</em>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-history">No actions taken yet. Waiting for Club Mentor approval.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
