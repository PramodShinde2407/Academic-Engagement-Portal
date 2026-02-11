import { ClubInterestModel } from '../models/clubInterest.model.js';
import { ClubModel } from '../models/club.model.js';
import { NotificationModel } from '../models/notification.model.js';

export const markInterested = async (req, res) => {
    try {
        const { clubId } = req.params;
        const user_id = req.user.id;

        // Check if already interested
        const existing = await ClubInterestModel.checkInterest(clubId, user_id);
        if (existing) {
            return res.status(400).json({ message: 'Already marked as interested' });
        }

        await ClubInterestModel.create({ club_id: clubId, user_id });

        res.json({ message: 'You will be notified when registration opens!' });
    } catch (error) {
        console.error('Mark interested error:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Already marked as interested' });
        }
        res.status(500).json({ message: error.message });
    }
};

export const notifyInterestedUsers = async (clubId) => {
    try {
        const interestedUsers = await ClubInterestModel.getByClubId(clubId);
        const club = await ClubModel.getById(clubId);

        if (!club) return;

        // Create notifications for all interested users
        for (const user of interestedUsers) {
            await NotificationModel.createNotification({
                user_id: user.user_id,
                title: 'Registration Now Open!',
                message: `Registration for ${club.name} is now open. Apply now!`,
                type: 'success',
                link: `/clubs/${clubId}`
            });
        }

        // Mark all as notified
        await ClubInterestModel.markNotified(clubId);

        console.log(`Notified ${interestedUsers.length} users about ${club.name} registration opening`);
    } catch (error) {
        console.error('Notify interested users error:', error);
    }
};
