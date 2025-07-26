// export const runtime = "nodejs";

// import { NextRequest, NextResponse } from "next/server";
// import Iyzipay from "iyzipay";
// import { createPayment } from "@/lib/createPayment";

// export async function POST(req: NextRequest) {
// 	try {
// 		const body = await req.json();
// 		console.log("Received payment body:", body);

// 		const paymentRequest = {
// 			locale: Iyzipay.LOCALE.TR,
// 			conversationId: "123456789",
// 			price: "1",
// 			paidPrice: "1.2",
// 			currency: Iyzipay.CURRENCY.TRY,
// 			installments: 1,
// 			basketId: "B67832",
// 			paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
// 			paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
// 			paymentCard: {
// 				cardHolderName: "John Doe",
// 				cardNumber: "5528790000000008",
// 				expireMonth: "12",
// 				expireYear: "2030",
// 				cvc: "123",
// 				cardAlias: "",
// 			},
// 			buyer: {
// 				id: "BY789",
// 				name: "John",
// 				surname: "Doe",
// 				gsmNumber: "+905350000000",
// 				email: "email@email.com",
// 				identityNumber: "74300864791",
// 				lastLoginDate: "2015-10-05 12:43:35",
// 				registrationDate: "2013-04-21 15:12:09",
// 				registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
// 				ip: "85.34.78.112",
// 				city: "Istanbul",
// 				country: "Turkey",
// 				zipCode: "34732",
// 			},
// 			shippingAddress: {
// 				contactName: "Jane Doe",
// 				city: "Istanbul",
// 				country: "Turkey",
// 				address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
// 				zipCode: "34742",
// 			},
// 			billingAddress: {
// 				contactName: "Jane Doe",
// 				city: "Istanbul",
// 				country: "Turkey",
// 				address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
// 				zipCode: "34742",
// 			},
// 			basketItems: [
// 				{
// 					id: "BI101",
// 					name: "Binocular",
// 					category1: "Collectibles",
// 					category2: "Accessories",
// 					itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
// 					price: "0.3",
// 				},
// 			],
// 		};

// 		const result = await createPayment(paymentRequest);
// 		return NextResponse.json({ success: true, result });
// 	} catch (error) {
// 		console.error("Payment Error:", error);
// 		return NextResponse.json({ success: false, error: error instanceof Error ? error.message : error }, { status: 500 });
// 	}
// }
