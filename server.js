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
    const intent = req.body.queryResult.intent.displayName; // intent name trong Dialogflow ES
    let responseText = "Xin chào, mình là chatbot du lịch Đà Lạt!";

    switch (intent) {
      case "find_place":
        responseText = "📍 Địa điểm nổi bật: Langbiang, Hồ Xuân Hương, Thung lũng Tình Yêu...";
        break;

      case "food_recommendation":
        responseText = "🍲 Đặc sản Đà Lạt: Bánh tráng nướng, Lẩu gà lá é, Bánh căn, Cà phê view đẹp...";
        break;

      case "opening_hours":
        responseText = "⏰ Thường các điểm tham quan mở 7:00–17:00. Bạn muốn hỏi địa điểm nào?";
        break;

      case "plan_itinerary":
        responseText =
          "📅 Gợi ý lịch trình:\n" +
          "👉 2N1Đ: Langbiang – Hồ Xuân Hương – Chợ đêm\n" +
          "👉 3N2Đ: Langbiang – Thác Datanla – Vườn hoa\n" +
          "👉 4N3Đ: Kết hợp thêm Đồi chè Cầu Đất – Chùa Linh Phước.";
        break;

      case "ticket_price":
        responseText =
          "🎟️ Giá vé tham khảo:\n" +
          "👉 Langbiang: 30k\n👉 Thung lũng Tình Yêu: 100k\n👉 Thác Datanla: 50k\n👉 Vườn hoa: 50k";
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
