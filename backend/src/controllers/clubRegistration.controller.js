import { ClubRegistrationModel } from '../models/clubRegistration.model.js';
import { ClubModel } from '../models/club.model.js';
import { NotificationModel } from '../models/notification.model.js';
import { db } from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const submitRegistration = async (req, res) => {
    try {
        const { clubId } = req.params;

        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).json({ message: 'Profile photo is required' });
        }

        // Validate JPG/JPEG/PNG
        const fileExt = path.extname(req.file.originalname).toLowerCase();
        if (!['.jpg', '.jpeg', '.png'].includes(fileExt)) {
            return res.status(400).json({
                message: 'Format not supported. Please upload a JPG or PNG image.'
            });
        }

        const photo_url = `/uploads/club-registrations/${req.file.filename}`;
        const { full_name, personal_email, college_email, roll_no, year, division, department, phone_no, statement_of_purpose } = req.body;
        const user_id = req.user?.id || null;

        // Check for existing application (Pending or Rejected)
        let applicationId;
        if (user_id) {
            const existingApp = await ClubRegistrationModel.getByUserAndClub(user_id, clubId);
            if (existingApp) {
                if (existingApp.status === 'Pending') {
                    return res.status(400).json({ message: 'You already have a pending application for this club.' });
                } else {
                    // Re-apply (Update existing row)
                    await ClubRegistrationModel.reapply(existingApp.application_id, {
                        full_name,
                        personal_email,
                        college_email,
                        roll_no,
                        year,
                        division,
                        department,
                        phone_no,
                        statement_of_purpose,
                        photo_url
                    });
                    applicationId = existingApp.application_id;
                }
            }
        }

        // Create registration ONLY if not already reapplied
        if (!applicationId) {
            applicationId = await ClubRegistrationModel.create({
                club_id: clubId,
                user_id,
                full_name,
                personal_email,
                college_email,
                roll_no,
                year,
                division,
                department,
                phone_no,
                statement_of_purpose,
                photo_url
            });
        }

        // Notify club head AND club mentor
        const club = await ClubModel.getById(clubId);
        if (club) {
            const recipients = [club.club_head_id];
            if (club.club_mentor_id) {
                recipients.push(club.club_mentor_id);
            }

            for (const recipientId of recipients) {
                await NotificationModel.createNotification({
                    user_id: recipientId,
                    title: 'New Club Membership Request',
                    message: `${full_name} has requested to join ${club.name}. Review application now.`,
                    type: 'action_required',
                    link: `/clubs/${clubId}/applications`
                });
            }

            // Send notifications to permission emails
            if (club.permission_emails) {
                const permissionEmails = club.permission_emails
                    .split(',')
                    .map(email => email.trim())
                    .filter(email => email);

                console.log(`Sending notifications to ${permissionEmails.length} permission email(s):`, permissionEmails);

                // For now, log the notification (email service can be added later)
                for (const email of permissionEmails) {
                    console.log(`📧 Notification to ${email}:`);
                    console.log(`   Subject: New Registration for ${club.name}`);
                    console.log(`   Message: ${full_name} (${college_email}) has registered for ${club.name}`);
                    console.log(`   Details: Roll No: ${roll_no}, Year: ${year}, Division: ${division}, Department: ${department}`);
                }
            }
        }

        res.status(201).json({
            message: 'Registration submitted successfully!',
            applicationId
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getApplications = async (req, res) => {
    try {
        const { clubId } = req.params;

        // Verify user is club head or mentor
        const club = await ClubModel.getById(clubId);

        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const isHead = club.club_head_id === req.user.id;
        const isMentor = club.club_mentor_id === req.user.id;
        const isAdmin = req.user.role === 4;

        if (!isHead && !isMentor && !isAdmin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const applications = await ClubRegistrationModel.getByClubId(clubId);
        res.json(applications);
    } catch (error) {
        console.error('Get applications error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;  // Approved, Rejected

        if (!['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const application = await ClubRegistrationModel.getById(applicationId);
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        const club = await ClubModel.getById(application.club_id);
        if (!club) {
            return res.status(404).json({ message: 'Club not found' });
        }

        const isClubHead = req.user.id === club.club_head_id;
        const isClubMentor = req.user.id === club.club_mentor_id;

        if (!isClubHead && !isClubMentor && req.user.role !== 4) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        // Determine Actor
        let actorLabel = 'Admin';
        if (isClubHead) actorLabel = 'Club Head';
        if (isClubMentor) actorLabel = 'Club Mentor';

        // Logic for approval
        if (isClubHead || req.user.role === 4) {
            await ClubRegistrationModel.updateHeadApproval(applicationId, status);
        }

        if (isClubMentor || req.user.role === 4) {
            await ClubRegistrationModel.updateMentorApproval(applicationId, status);
        }

        // Check if both approved or any rejected
        const updatedApp = await ClubRegistrationModel.getById(applicationId);

        let finalStatus = 'Pending';
        if (updatedApp.head_approval_status === 'Approved' && updatedApp.mentor_approval_status === 'Approved') {
            finalStatus = 'Approved';

            // Add to Club Members
            await db.query(
                "INSERT INTO club_member (club_id, user_id, student_name, email, roll_no, year, branch) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [
                    application.club_id,
                    application.user_id,
                    application.full_name,
                    application.college_email, // Using college email as primary
                    application.roll_no,
                    application.year,
                    application.department // Assuming branch maps to department roughly or null
                ]
            ).catch(err => {
                if (err.code !== 'ER_DUP_ENTRY') console.error("Error adding member:", err);
            });
        } else if (updatedApp.head_approval_status === 'Rejected' || updatedApp.mentor_approval_status === 'Rejected') {
            finalStatus = 'Rejected';
        }

        // Update overall status
        await ClubRegistrationModel.updateStatus(applicationId, finalStatus);

        // Notify based on Final Status
        if (application.user_id) {
            if (finalStatus === 'Approved') {
                await NotificationModel.createNotification({
                    user_id: application.user_id,
                    title: `Welcome to ${club.name}!`,
                    message: `Congratulations! Your application has been fully approved. You are now a member.`,
                    type: 'success'
                });
            } else if (finalStatus === 'Rejected') {
                await NotificationModel.createNotification({
                    user_id: application.user_id,
                    title: `Application Update`,
                    message: `Your application to join ${club.name} has been rejected.`,
                    type: 'error'
                });
            }
        }

        res.json({
            message: `Application updated successfully`,
            head_status: updatedApp.head_approval_status,
            mentor_status: updatedApp.mentor_approval_status,
            final_status: finalStatus
        });
    } catch (error) {
        console.error('Update status error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const exportApplicationsCSV = async (req, res) => {
    try {
        const { clubId } = req.params;

        // Verify user is club head
        const club = await ClubModel.getById(clubId);
        if (!club || club.club_head_id !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const applications = await ClubRegistrationModel.getByClubId(clubId);

        // Generate CSV
        const headers = ['Full Name', 'Personal Email', 'College Email', 'Roll No', 'Year', 'Division', 'Department', 'Phone No', 'Statement', 'Status', 'Applied On'];
        const rows = applications.map(app => [
            app.full_name,
            app.personal_email,
            app.college_email,
            app.roll_no || 'N/A',
            app.year || 'N/A',
            app.division || 'N/A',
            app.department || 'N/A',
            app.phone_no || 'N/A',
            `"${app.statement_of_purpose.replace(/"/g, '""')}"`,  // Escape quotes
            app.status,
            new Date(app.applied_at).toLocaleDateString()
        ]);

        const csv = [headers, ...rows]
            .map(row => row.join(','))
            .join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="club-applications-${clubId}.csv"`);
        res.send(csv);
    } catch (error) {
        console.error('Export CSV error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const checkRegistrationStatus = async (req, res) => {
    try {
        const { clubId } = req.params;
        const user_id = req.user.id;

        const application = await ClubRegistrationModel.getByUserAndClub(user_id, clubId);

        if (!application) {
            return res.json({ status: null });
        }

        res.json({ status: application.status });
    } catch (error) {
        console.error('Check status error:', error);
        res.status(500).json({ message: error.message });
    }
};
