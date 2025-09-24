import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Helper: chọn random response
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

app.get("/", (req, res) => {
  res.send("🚀 Webhook for Dialogflow ES is running!");
});

app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    console.log("👉 Intent:", intent);

    let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
    let chips = [
      { text: "📍 Địa điểm nổi bật" },
      { text: "🍲 Món ăn đặc sản" },
      { text: "⏰ Giờ mở cửa" },
      { text: "📅 Lịch trình du lịch" },
      { text: "🎟️ Giá vé tham quan" }
    ];

    switch (intent) {
      // 📍 Địa điểm nổi bật
      case "find_place":
        responseText =
          "📍 Một số địa điểm nổi bật ở Đà Lạt:\n" +
          "✨ Quảng trường Lâm Viên - Trần Quốc Toản, P.1\n" +
          "🌊 Hồ Xuân Hương - Trung tâm TP Đà Lạt\n" +
          "⛰️ Langbiang - TT Lạc Dương, Lâm Đồng\n" +
          "🌺 Vườn hoa thành phố - Trần Quốc Toản, P.8\n" +
          "🏞️ Thác Datanla - QL20, Đèo Prenn";
        break;

      // 🍲 Món ăn đặc sản
      case "food_recommendation":
        responseText =
          "🍲 Đặc sản kèm địa chỉ:\n" +
          "🥞 Bánh căn - 1 Nhà Chung, P.3\n" +
          "🥘 Lẩu gà lá é - Tao Ngộ, 27 Lê Đại Hành\n" +
          "🥗 Nem nướng Bà Hùng - 328 Phan Đình Phùng\n" +
          "🥤 Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n" +
          "🥖 Bánh mì xíu mại - 26 Hoàng Diệu";
        break;

      // ⏰ Giờ mở cửa
      case "opening_hours":
        responseText =
          "⏰ Giờ mở cửa tham khảo:\n" +
          "⛰️ Langbiang: 7:00 - 17:00\n" +
          "🌺 Vườn hoa: 7:30 - 17:00\n" +
          "🏞️ Thác Datanla: 7:00 - 17:00\n" +
          "🏯 Đường hầm đất sét: 7:00 - 17:00\n" +
          "🌙 Chợ đêm: 17:00 - 22:00";
        break;

      // 📅 Lịch trình du lịch
      case "plan_itinerary":
        responseText = "Bạn muốn đi mấy ngày?";
        chips = [
          { text: "2 ngày 1 đêm" },
          { text: "3 ngày 2 đêm" },
          { text: "4 ngày 3 đêm" }
        ];
        break;

      // 🗓️ Itinerary chi tiết
      case "itinerary_2d1n":
        responseText =
          "📅 Lịch trình 2N1Đ:\n" +
          "🏨 Ở: Homestay Nắng, gần trung tâm\n" +
          "🍲 Ăn: Lẩu gà lá é, Bánh căn Nhà Chung\n" +
          "📸 Đi: Langbiang, Hồ Xuân Hương, Chợ đêm";
        break;

      case "itinerary_3d2n":
        responseText =
          "📅 Lịch trình 3N2Đ:\n" +
          "🏨 Ở: Khách sạn Roy Villa\n" +
          "🥘 Ăn: Nem nướng Bà Hùng, Lẩu bò Ba Toa\n" +
          "📸 Đi: Quảng trường Lâm Viên, Nhà thờ Con Gà, Langbiang, Thác Datanla, Đồi chè Cầu Đất";
        break;

      case "itinerary_4d3n":
        responseText =
          "📅 Lịch trình 4N3Đ:\n" +
          "🏨 Ở: Dalat Palace Hotel\n" +
          "🍲 Ăn: Lẩu gà lá é, BBQ Fungi Chingu, Kem bơ Thanh Thảo\n" +
          "📸 Đi: Langbiang, Thung lũng Tình Yêu, Thác Pongour, Đồi chè Cầu Đất, Làng Cù Lần, Chùa Linh Phước";
        break;

      // 🎟️ Giá vé tham quan
      case "ticket_price":
        responseText =
          "🎟️ Giá vé & địa chỉ:\n" +
          "⛰️ Langbiang - Lạc Dương: 30.000đ\n" +
          "🌺 Vườn hoa TP - Trần Quốc Toản: 50.000đ\n" +
          "🏞️ Thác Datanla - QL20 Prenn: 50.000đ\n" +
          "🌄 Thung lũng Tình Yêu - Mai Anh Đào: 100.000đ\n" +
          "🚉 Ga Đà Lạt - Quang Trung: 10.000đ";
        break;

      default:
        responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
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
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Webhook error!");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
