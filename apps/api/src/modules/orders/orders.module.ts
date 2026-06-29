import { Module } from "@nestjs/common";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { CouponsModule } from "../coupons/coupons.module";
import { NotificationsModule } from "../notifications/notifications.module";
import { EmailModule } from "../email/email.module";
import { ShippingModule } from "../shipping/shipping.module";

@Module({
  imports: [CouponsModule, NotificationsModule, EmailModule, ShippingModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
