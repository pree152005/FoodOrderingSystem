import { paymentApi } from "./axiosConfig";

export const payForOrder = (paymentPayload) => paymentApi.post("/payment/pay", paymentPayload);

export const getAllPayments = () => paymentApi.get("/payment");
