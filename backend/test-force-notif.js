
import { NotificationModel } from "./src/models/notification.model.js";

const testForceNotif = async () => {
    try {
        console.log("Forcing notification to User 15...");
        const notifId = await NotificationModel.createNotification({
            user_id: 15,
            title: "TEST NOTIFICATION",
            message: "This is a direct test of the notification system.",
            type: "info",
            link: "/dashboard"
        });
        console.log("Notification created successfully with ID:", notifId);
        process.exit(0);
    } catch (err) {
        console.error("FAILED TO CREATE NOTIFICATION:", err);
        process.exit(1);
    }
}
testForceNotif();
