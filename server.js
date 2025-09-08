import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// Kiểm tra server chạy
app.get("/", (req, res) => res.send("✅ Webhook is running"));

// Chuẩn trả lời Dialogflow
const reply = (msg) => ({
  fulfillmentMessages: [{ text: { text: [msg] } }]
});

// Xử lý webhook
app.post("/webhook", (req, res) => {
  const intent = req.body?.queryResult?.intent?.displayName || "";
  const p = req.body?.queryResult?.parameters || {};

  if (intent === "opening_hours") {
    return res.json(reply(`⏰ ${p.place_name || "địa điểm"} mở cửa: 07:00 - 17:00 (demo)`));
  }

  if (intent === "ticket_price") {
    return res.json(reply(`🎫 Vé ${p.place_name || "địa điểm"}: 50.000đ (demo)`));
  }

  return res.json(reply(`Webhook đã nhận intent: ${intent}`));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Webhook listening on port " + PORT));
