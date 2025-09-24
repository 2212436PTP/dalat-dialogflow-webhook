import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Webhook for Dialogflow ES with Chips is running!");
});

// Webhook endpoint
app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    let responseText = "Xin chào, mình là chatbot du lịch Đà Lạt!";
    let chips = [];

    switch (intent) {
      case "find_place":
        responseText =
          "📍 Gợi ý địa điểm:\n" +
          "☕ Cà phê: Horizon, Túi Mơ To, Dalat Mountain View\n" +
          "🏡 Homestay: Nắng Homestay, LengKeng Homestay\n" +
          "🛍️ Chợ đêm Đà Lạt, Thác Datanla, Quảng trường Lâm Viên.";
        chips = [
          { text: "🍲 Món ăn đặc sản" },
          { text: "🎟️ Giá vé tham quan" },
          { text: "📅 Lịch trình du lịch" }
        ];
        break;

      case "food_recommendation":
        responseText =
          "🍲 Ẩm thực nổi bật:\n" +
          "🥘 Lẩu gà lá é – Quán Tao Ngộ\n" +
          "🥞 Bánh căn Tăng Bạt Hổ\n" +
          "🥗 Nem nướng Bà Hùng\n" +
          "🥤 Kem bơ Thanh Thảo, Sữa đậu nành Hoa Sữa\n" +
          "🥖 Bánh mì xíu mại Hoàng Diệu.";
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🎟️ Giá vé tham quan" },
          { text: "📅 Lịch trình 3 ngày 2 đêm" }
        ];
        break;

      case "opening_hours":
        responseText =
          "⏰ Giờ mở cửa:\n" +
          "⛰️ Langbiang: 7:00 – 17:00\n" +
          "🌸 Vườn hoa: 7:30 – 17:00\n" +
          "🏞️ Thác Datanla: 7:00 – 17:00\n" +
          "🌙 Chợ đêm Đà Lạt: 17:00 – 22:00.";
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🍲 Món ăn đặc sản" },
          { text: "📅 Lịch trình du lịch" }
        ];
        break;

      case "plan_itinerary":
        responseText =
          "📅 Lịch trình gợi ý:\n\n" +
          "👉 2N1Đ: Langbiang – Hồ Xuân Hương – Chợ đêm – Vườn hoa\n" +
          "👉 3N2Đ: Quảng trường Lâm Viên – Nhà thờ Con Gà – Langbiang – Thác Datanla\n" +
          "👉 4N3Đ: Đồi chè Cầu Đất – Làng Cù Lần – Chùa Linh Phước.";
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🍲 Món ăn đặc sản" },
          { text: "🎟️ Giá vé tham quan" }
        ];
        break;

      case "ticket_price":
        responseText =
          "🎟️ Giá vé tham khảo:\n" +
          "⛰️ Langbiang: 30k\n" +
          "🌸 Thung lũng Tình Yêu: 100k (trẻ em 50k)\n" +
          "🏞️ Thác Datanla: 50k (combo có nhiều loại)\n" +
          "🌺 Vườn hoa: 50k\n" +
          "🚉 Ga Đà Lạt: 10k\n" +
          "🕌 Nhà thờ Con Gà, Quảng trường Lâm Viên: miễn phí.";
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🍲 Món ăn đặc sản" },
          { text: "📅 Lịch trình 2 ngày 1 đêm" }
        ];
        break;

      default:
        responseText = "🤔 Xin lỗi, mình chưa có thông tin cho câu hỏi này.";
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🍲 Món ăn đặc sản" },
          { text: "📅 Lịch trình du lịch" }
        ];
    }

    res.json({
      fulfillmentMessages: [
        { text: { text: [responseText] } },
        {
          payload: {
            richContent: [
              [
                {
                  type: "chips",
                  options: chips
                }
              ]
            ]
          }
        }
      ]
    });
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook error!");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
