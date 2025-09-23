import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Webhook for Dialogflow ES is running!");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName; // Lấy intent name trong Dialogflow ES
    let responseText = "Xin chào, mình là chatbot du lịch Đà Lạt!";

    switch (intent) {
      case "find_place":
        responseText =
          "📍 Một số gợi ý:\n" +
          "☕ Quán cà phê view đẹp: Horizon, Túi Mơ To, Dalat Mountain View\n" +
          "🏡 Homestay rẻ đẹp: Nắng Homestay, LengKeng Homestay\n" +
          "🛍️ Chợ đêm Đà Lạt – nơi đông vui về đêm\n" +
          "🌊 Thác đẹp: Thác Datanla, Thác Pongour\n" +
          "📸 Địa điểm check-in: Quảng trường Lâm Viên, Vườn hoa thành phố.";
        break;

      case "food_recommendation":
        responseText =
          "🍲 Đặc sản và quán ăn nổi tiếng:\n" +
          "🥘 Lẩu gà lá é – Quán Tao Ngộ\n" +
          "🥞 Bánh căn – Tăng Bạt Hổ\n" +
          "🥗 Nem nướng Bà Hùng\n" +
          "🥤 Kem bơ Thanh Thảo, Sữa đậu nành Hoa Sữa\n" +
          "🥖 Bánh mì xíu mại Hoàng Diệu\n" +
          "🔥 BBQ – Fungi Chingu, Barn House BBQ.";
        break;

      case "opening_hours":
        responseText =
          "⏰ Giờ mở cửa tham khảo:\n" +
          "⛰️ Langbiang: 7:00 – 17:00\n" +
          "🌸 Vườn hoa thành phố: 7:30 – 17:00\n" +
          "🏞️ Thác Datanla: 7:00 – 17:00\n" +
          "🕌 Nhà thờ Con Gà: 5:30 – 17:00\n" +
          "🏯 Đường hầm đất sét: 7:00 – 17:00\n" +
          "🌙 Chợ đêm Đà Lạt: 17:00 – 22:00.";
        break;

      case "plan_itinerary":
        responseText =
          "📅 Gợi ý lịch trình:\n\n" +
          "👉 2 ngày 1 đêm: Langbiang – Hồ Xuân Hương – Chợ đêm – Vườn hoa\n" +
          "👉 3 ngày 2 đêm: Quảng trường Lâm Viên – Nhà thờ Con Gà – Langbiang – Thác Datanla – Vườn hoa\n" +
          "👉 4 ngày 3 đêm: Thêm Đồi chè Cầu Đất – Làng Cù Lần – Chùa Linh Phước.";
        break;

      case "ticket_price":
        responseText =
          "🎟️ Giá vé tham khảo:\n" +
          "⛰️ Langbiang: 30.000đ/người\n" +
          "🌸 Thung lũng Tình Yêu: 100.000đ/người (trẻ em 50.000đ)\n" +
          "🏞️ Thác Datanla: 50.000đ/người (combo trượt máng có nhiều loại)\n" +
          "🌺 Vườn hoa thành phố: 50.000đ/người\n" +
          "🚉 Ga Đà Lạt: 10.000đ/người\n" +
          "🕌 Nhà thờ Con Gà, Quảng trường Lâm Viên: miễn phí.";
        break;

      default:
        responseText = "🤔 Xin lỗi, mình chưa có thông tin cho câu hỏi này.";
    }

    res.json({ fulfillmentText: responseText });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook error!");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
