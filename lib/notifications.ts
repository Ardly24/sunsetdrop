import { prisma } from "@/lib/prisma";
import type { NotificationType } from "../app/generated/prisma/client";

type CreateNotificationInput = {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
};

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  });
}