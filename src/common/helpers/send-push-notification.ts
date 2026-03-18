import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

// Create a new Expo SDK client
const expo = new Expo();

export interface PushNotificationData {
  [key: string]: string | number | boolean;
}

export const sendPushNotification = async (
  targetExpoPushToken: string,
  message: string,
  data?: PushNotificationData,
): Promise<ExpoPushTicket[] | undefined> => {
  try {
    // Create the message
    const messages: ExpoPushMessage[] = [];
    if (!Expo.isExpoPushToken(targetExpoPushToken)) {
      console.error(
        `Push token ${targetExpoPushToken} is not a valid Expo push token`,
      );
      return;
    }

    messages.push({
      to: targetExpoPushToken,
      sound: 'default',
      title: message,
      body: data?.message as string,
      data: data,
      channelId: 'default',
    });

    // Chunk the messages
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    // Send the notifications
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        console.error('Error sending notification chunk', error);
      }
    }

    console.log('Sent notification tickets are:', tickets?.length, tickets);

    return tickets;
  } catch (error) {
    console.error('Error sending push notification', error);
  }
};
