-- AlterTable
ALTER TABLE "products" ADD COLUMN     "badge" "ProductBadge" NOT NULL DEFAULT 'REGULAR',
ADD COLUMN     "deliveryType" "DeliveryType" NOT NULL DEFAULT 'STANDARD_DELIVERY';
