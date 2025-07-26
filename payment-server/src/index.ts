import express from "express";
import dotenv from "dotenv";
import Iyzipay from "iyzipay";
import cors from "cors";
dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

const iyzipay = new Iyzipay({
	apiKey: process.env.IYZI_API_KEY!,
	secretKey: process.env.IYZI_SECRET_KEY!,
	uri: "https://sandbox-api.iyzipay.com",
});

app.post("/api/payment", (req, res) => {
	const body = req.body;
	console.log(body);
	const paymentRequest = {
		locale: Iyzipay.LOCALE.TR,
		conversationId: "123456789",
		price: "1.2",
		paidPrice: "1.2",
		currency: Iyzipay.CURRENCY.TRY,
		installments: 1,
		basketId: "B67832",
		paymentChannel: Iyzipay.PAYMENT_CHANNEL.WEB,
		paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
		paymentCard: {
			cardHolderName: "John Doe",
			cardNumber: "4766620000000001",
			expireMonth: "12",
			expireYear: "2030",
			cvc: "123",
			cardAlias: "",
		},
		buyer: {
			id: "BY789",
			name: "John",
			surname: "Doe",
			gsmNumber: "+905350000000",
			email: "email@email.com",
			identityNumber: "74300864791",
			lastLoginDate: "2015-10-05 12:43:35",
			registrationDate: "2013-04-21 15:12:09",
			registrationAddress: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			ip: "85.34.78.112",
			city: "Istanbul",
			country: "Turkey",
			zipCode: "34732",
		},
		shippingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		billingAddress: {
			contactName: "Jane Doe",
			city: "Istanbul",
			country: "Turkey",
			address: "Nidakule Göztepe, Merdivenköy Mah. Bora Sok. No:1",
			zipCode: "34742",
		},
		basketItems: [
			{
				id: "BI101",
				name: "Binocular",
				category1: "Collectibles",
				category2: "Accessories",
				itemType: Iyzipay.BASKET_ITEM_TYPE.PHYSICAL,
				price: "1.2",
			},
		],
	};

	iyzipay.payment.create(paymentRequest, (err, result) => {
		if (err) {
			console.error("İyzico error:", err);
			return res.status(500).json({ success: false, error: err });
		}
		return res.status(200).json({ success: true, result });
	});
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
	console.log(`Payment server running at http://localhost:${PORT}`);
});
