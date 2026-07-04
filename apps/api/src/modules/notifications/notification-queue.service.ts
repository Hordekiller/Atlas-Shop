import { Injectable, Logger, OnModuleDestroy } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { PrismaService } from "../../common/prisma.service";

interface QueueItem {
  id: string;
  type: "email" | "sms";
  payload: any;
  retries: number;
  maxRetries: number;
  lastError?: string;
}

@Injectable()
export class NotificationQueueService implements OnModuleDestroy {
  private readonly logger = new Logger(NotificationQueueService.name);
  private queue: QueueItem[] = [];
  private processing = false;
  private intervalHandle: ReturnType<typeof setInterval> | null = null;

  constructor(private prisma: PrismaService) {
    this.start();
  }

  addToQueue(type: "email" | "sms", payload: any) {
    const item: QueueItem = {
      id: Math.random().toString(36).substring(2, 10),
      type,
      payload,
      retries: 0,
      maxRetries: 3,
    };
    this.queue.push(item);
    this.logger.log(
      `[Queue] Added ${type} notification to queue (${this.queue.length} pending)`,
    );
  }

  private start() {
    this.intervalHandle = setInterval(() => this.processQueue(), 30000);
    this.logger.log("[Queue] Notification queue started (interval: 30s)");
  }

  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    const batch = [...this.queue];
    this.queue = [];

    for (const item of batch) {
      try {
        if (item.type === "email") {
          const { to, subject, html } = item.payload;
          const host = process.env.MAIL_HOST || "";
          const port = parseInt(process.env.MAIL_PORT || "587", 10);
          const user = process.env.MAIL_USER || "";
          const pass = process.env.MAIL_PASS || "";
          const from = process.env.MAIL_FROM || "noreply@example.com";

          if (!host || host === "localhost") {
            this.logger.warn(
              `[Queue] Cannot send email — MAIL_HOST not configured`,
            );
            return;
          }

          const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465,
            auth: user ? { user, pass } : undefined,
          });
          await transporter.sendMail({
            from,
            to,
            subject,
            html,
          });
          this.logger.log(`[Queue] Email sent to ${to}: ${subject}`);
        } else if (item.type === "sms") {
          this.logger.log(
            `[Queue][SMS MOCK] Payload: ${JSON.stringify(item.payload)}`,
          );
        }
      } catch (err: any) {
        item.retries++;
        item.lastError = err?.message || String(err);
        this.logger.error(
          `[Queue] ${item.type} notification failed (attempt ${item.retries}/${item.maxRetries}): ${item.lastError}`,
        );

        if (item.retries < item.maxRetries) {
          setTimeout(() => {
            this.queue.push(item);
          }, 10000);
        } else {
          this.logger.error(
            `[Queue] ${item.type} notification failed after ${item.maxRetries} attempts. Creating admin notification.`,
          );
          await this.notifyAdmin(item);
        }
      }
    }

    this.processing = false;
  }

  private async notifyAdmin(item: QueueItem) {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: { in: ["SUPER_ADMIN", "ADMIN"] } },
        select: { id: true },
      });
      for (const admin of admins) {
        await this.prisma.notification.create({
          data: {
            userId: admin.id,
            type: "notification_failed",
            title: `خطا در ارسال ${item.type === "email" ? "ایمیل" : "پیامک"}`,
            message: `ارسال ${item.type === "email" ? "ایمیل" : "پیامک"} پس از ${item.maxRetries} بار تلاش ناموفق بود.\nخطا: ${item.lastError || "نامشخص"}`,
          },
        });
      }
    } catch (e) {
      this.logger.error(
        "[Queue] Failed to notify admin about queue failure",
        e,
      );
    }
  }

  onModuleDestroy() {
    if (this.intervalHandle) {
      clearInterval(this.intervalHandle);
      this.intervalHandle = null;
    }
  }
}
