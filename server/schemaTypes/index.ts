import { type SchemaTypeDefinition } from "sanity";

import { blockContentType } from "./blockContentType";
import { categoryType } from "./categoryType";
import { productType } from "./productType";
import { productVariantType } from "./productVariantType";
import { productWeightType } from "./productWeightType";
import { productSizeType } from "./productSizeType";
import { productColorType } from "./productColorType";
import { orderType } from "./orderType";
import { bannerType } from "./bannerType";
import { brandType } from "./brandTypes";
import { blogType } from "./blogType";
import { blogCategoryType } from "./blogCategoryType";
import { authorType } from "./authType";
import { addressType } from "./addressType";
import { contactType } from "./contactType";
import { sentNotificationType } from "./sentNotificationType";
import { userType } from "./userType";
import { userAccessRequestType } from "./userAccessRequestType";
import { reviewType } from "./reviewType";
import { subscriptionType } from "./subscriptionType";
import { storeType } from "./storeType";
import { vendorApplicationType } from "./vendorApplicationType";
import { vendorProductType } from "./vendorProductType";
import { couponType } from "./couponType";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    productType,
    productVariantType,
    productWeightType,
    productSizeType,
    productColorType,
    orderType,
    bannerType,
    brandType,
    blogType,
    blogCategoryType,
    authorType,
    addressType,
    contactType,
    sentNotificationType,
    userType,
    userAccessRequestType,
    reviewType,
    subscriptionType,
    storeType,
    vendorApplicationType,
    vendorProductType,
    couponType,
  ],
};
