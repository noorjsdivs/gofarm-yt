import { sanityFetch } from "../lib/live";

// Email-based User Queries
export const USER_ADDRESSES_BY_EMAIL_QUERY = `
  *[_type == "address" && email == $email] | order(default desc, createdAt desc) {
    _id,
    name,
    email,
    address,
    city,
    state,
    zip,
    default,
    createdAt
  }
`;

export const USER_ORDERS_BY_EMAIL_QUERY = `
  *[_type == "order" && email == $email] | order(orderDate desc) {
    _id,
    orderNumber,
    products[] {
      product -> {
        _id,
        name,
        image {
          asset -> {
            _id,
            url
          }
        },
        price,
        currency
      },
      quantity
    },
    totalPrice,
    currency,
    productDiscount,
    amountDiscount,
    businessDiscount,
    address,
    status,
    orderDate,
    invoice,
    customerName,
    email
  }
`;

export const DEFAULT_ADDRESS_BY_EMAIL_QUERY = `
  *[_type == "address" && email == $email && default == true][0] {
    _id,
    name,
    email,
    address,
    city,
    state,
    zip,
    default,
    createdAt
  }
`;

// Email-based User Functions
export const getUserAddressesByEmail = async (email: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_ADDRESSES_BY_EMAIL_QUERY,
      params: { email },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching user addresses by email:", error);
    return [];
  }
};

export const getUserOrdersByEmail = async (email: string) => {
  try {
    const { data } = await sanityFetch({
      query: USER_ORDERS_BY_EMAIL_QUERY,
      params: { email },
    });
    return data ?? [];
  } catch (error) {
    console.error("Error fetching user orders by email:", error);
    return [];
  }
};

export const getDefaultAddressByEmail = async (email: string) => {
  try {
    const { data } = await sanityFetch({
      query: DEFAULT_ADDRESS_BY_EMAIL_QUERY,
      params: { email },
    });
    return data;
  } catch (error) {
    console.error("Error fetching default address by email:", error);
    return null;
  }
};
