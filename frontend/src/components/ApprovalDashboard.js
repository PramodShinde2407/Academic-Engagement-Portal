import { useState, useEffect } from "react";
import api from "../api/axios";
import "./ApprovalDashboard.css";

export default function ApprovalDashboard() {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [remarks, setRemarks] = useState("");
    const [showRejectModal, setShowRejectModal] = useState(false);

    useEffect(() => {
        fetchPendingRequests();
    }, []);

    const fetchPendingRequests = async () => {
        try {
            const response = await api.get("/permissions/pending");
            setPendingRequests(response.data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load pending requests");
        } finally {
            setLoading(false);
        }
    };

    const viewDetails = async (requestId) => {
        try {
            const response = await api.get(`/permissions/${requestId}`);
            setSelectedRequest(response.data);
        } catch (err) {
            alert("Failed to load request details");
        }
    };

    const handleApprove = async () => {
        if (!selectedRequest) return;

        if (!window.confirm("Are you sure you want to approve this request?")) {
            return;
        }

        setActionLoading(true);
        try {
            await api.post(`/permissions/${selectedRequest.request_id}/approve`, {
                remarks: remarks || null
            });

            alert("Request approved successfully!");
            setSelectedRequest(null);
            setRemarks("");
            fetchPendingRequests(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to approve request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!selectedRequest) return;

        if (!remarks.trim()) {
            alert("Please provide a reason for rejection");
            return;
        }

        setActionLoading(true);
        try {
            await api.post(`/permissions/${selectedRequest.request_id}/reject`, {
                remarks: remarks
            });

            alert("Request rejected");
            setSelectedRequest(null);
            setRemarks("");
            setShowRejectModal(false);
            fetchPendingRequests(); // Refresh list
        } catch (err) {
            alert(err.response?.data?.message || "Failed to reject request");
        } finally {
            setActionLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedRequest(null);
        setRemarks("");
        setShowRejectModal(false);
    };

    if (loading) {
        return <div className="loading">Loading pending requests...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="approval-dashboard">
            <div className="dashboard-header">
                <h2>Pending Approvals</h2>
                <span className="count-badge">{pendingRequests.length} pending</span>
            </div>

            {pendingRequests.length === 0 ? (
                <div className="empty-state">
                    <p>✅ No pending requests at the moment</p>
                    <p className="sub-text">You're all caught up!</p>
                </div>
            ) : (
                <div className="requests-list">
                    {pendingRequests.map((request) => (
                        <div key={request.request_id} className="request-item">
                            <div className="request-info">
                                <h3>{request.subject}</h3>
                                <div className="meta-info">
                                    <span>📍 {request.location}</span>
                                    <span>📅 {new Date(request.event_date).toLocaleDateString()}</span>
                                    <span>⏰ {request.start_time} - {request.end_time}</span>
                                </div>
                                <div className="submitter-info">
                                    Submitted by: <strong>{request.club_head_name}</strong>
                                    {request.club_name && ` (${request.club_name})`}
                                </div>
                            </div>
                            <button
                                className="btn-review"
                                onClick={() => viewDetails(request.request_id)}
                            >
                                Review
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Review Modal */}
            {selectedRequest && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Review Permission Request</h3>
                            <button className="close-btn" onClick={closeModal}>&times;</button>
                        </div>

                        <div className="modal-body">
                            {/* Request Details */}
                            <div className="detail-section">
                                <h4>📋 Request Details</h4>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <span className="label">Subject:</span>
                                        <span className="value">{selectedRequest.subject}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Location:</span>
                                        <span className="value">{selectedRequest.location}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Event Date:</span>
                                        <span className="value">{new Date(selectedRequest.event_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Time:</span>
                                        <span className="value">{selectedRequest.start_time} - {selectedRequest.end_time}</span>
                                    </div>
                                    <div className="detail-item full-width">
                                        <span className="label">Description:</span>
                                        <p className="description">{selectedRequest.description}</p>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Submitted by:</span>
                                        <span className="value">{selectedRequest.club_head_name}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="label">Submitted on:</span>
                                        <span className="value">{new Date(selectedRequest.created_at).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Approval History */}
                            {selectedRequest.approval_history && selectedRequest.approval_history.length > 0 && (
                                <div className="detail-section">
                                    <h4>✅ Approval History</h4>
                                    <div className="history-list">
                                        {selectedRequest.approval_history.map((action) => (
                                            <div key={action.action_id} className="history-item">
                                                <div className="history-header">
                                                    <strong>{action.approver_role}</strong>
                                                    <span className={`action-label ${action.action}`}>
                                                        {action.action === 'approved' ? '✓ Approved' : '✗ Rejected'}
                                                    </span>
                                                </div>
                                                <div className="history-meta">
                                                    {action.approver_name} • {new Date(action.action_date).toLocaleString()}
                                                </div>
                                                {action.remarks && (
                                                    <div className="history-remarks">"{action.remarks}"</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            {!showRejectModal && (
                                <div className="action-section">
                                    <div className="remarks-input">
                                        <label>Optional Remarks:</label>
                                        <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            placeholder="Add any comments or notes..."
                                            rows="3"
                                        />
                                    </div>
                                    <div className="action-buttons">
                                        <button
                                            className="btn-reject"
                                            onClick={() => setShowRejectModal(true)}
                                            disabled={actionLoading}
                                        >
                                            ✗ Reject
                                        </button>
                                        <button
                                            className="btn-approve"
                                            onClick={handleApprove}
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? "Processing..." : "✓ Approve"}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Reject Confirmation */}
                            {showRejectModal && (
                                <div className="reject-confirmation">
                                    <h4>⚠️ Confirm Rejection</h4>
                                    <p>Please provide a reason for rejecting this request:</p>
                                    <textarea
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                        placeholder="Reason for rejection (required)..."
                                        rows="4"
                                        className="reject-reason"
                                    />
                                    <div className="confirm-buttons">
                                        <button
                                            className="btn-cancel"
                                            onClick={() => setShowRejectModal(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            className="btn-confirm-reject"
                                            onClick={handleReject}
                                            disabled={actionLoading || !remarks.trim()}
                                        >
                                            {actionLoading ? "Rejecting..." : "Confirm Rejection"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
