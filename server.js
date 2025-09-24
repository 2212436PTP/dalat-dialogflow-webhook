import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("🚀 Webhook for Dialogflow ES is running!");
});

app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    const queryText = req.body.queryResult.queryText; // user text/chip

    console.log("👉 Intent:", intent);
    console.log("👉 QueryText:", queryText);

    let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
    let chips = [
      { text: "📍 Địa điểm nổi bật" },
      { text: "🍲 Món ăn đặc sản" },
      { text: "⏰ Giờ mở cửa" },
      { text: "📅 Lịch trình du lịch" },
      { text: "🎟️ Giá vé tham quan" }
    ];

    // ======================
    // Intent chính
    // ======================
    switch (intent) {
      case "find_place":
        responseText =
          "📍 Một số địa điểm nổi bật tại Đà Lạt:\n\n" +
          "✨ Quảng trường Lâm Viên - Trần Quốc Toản, P.1\n" +
          "🌊 Hồ Xuân Hương - Trung tâm TP Đà Lạt\n" +
          "⛰️ Núi Langbiang - TT Lạc Dương, Lâm Đồng\n" +
          "🌺 Vườn hoa TP - Trần Quốc Toản, P.8\n" +
          "🏞️ Thác Datanla - QL20, Đèo Prenn";
        break;

      case "food_recommendation":
        responseText =
          "🍲 Đặc sản kèm địa chỉ:\n\n" +
          "🥞 Bánh căn - 1 Nhà Chung, P.3\n" +
          "🥘 Lẩu gà lá é - Tao Ngộ, 27 Lê Đại Hành\n" +
          "🥗 Nem nướng Bà Hùng - 328 Phan Đình Phùng\n" +
          "🥤 Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n" +
          "🥖 Bánh mì xíu mại - 26 Hoàng Diệu";
        break;

      case "opening_hours":
        responseText =
          "⏰ Giờ mở cửa tham khảo:\n\n" +
          "⛰️ Langbiang: 7:00 - 17:00\n" +
          "🌺 Vườn hoa TP: 7:30 - 17:00\n" +
          "🏞️ Thác Datanla: 7:00 - 17:00\n" +
          "🏯 Đường hầm đất sét: 7:00 - 17:00\n" +
          "🌙 Chợ đêm: 17:00 - 22:00";
        break;

      case "plan_itinerary":
        responseText = "Bạn muốn đi mấy ngày?";
        chips = [
          { text: "2 ngày 1 đêm" },
          { text: "3 ngày 2 đêm" },
          { text: "4 ngày 3 đêm" }
        ];
        break;

      case "ticket_price":
        responseText =
          "🎟️ Giá vé & địa chỉ:\n\n" +
          "⛰️ Langbiang - Lạc Dương: 30.000đ\n" +
          "🌺 Vườn hoa TP - Trần Quốc Toản: 50.000đ\n" +
          "🏞️ Thác Datanla - QL20 Prenn: 50.000đ\n" +
          "🌄 Thung lũng Tình Yêu - Mai Anh Đào: 100.000đ\n" +
          "🚉 Ga Đà Lạt - Quang Trung: 10.000đ";
        break;
    }

    // ======================
    // Fallback theo queryText (chips)
    // ======================
    if (intent === "Default Fallback Intent" || !responseText) {
      switch (queryText) {
        case "📍 Địa điểm nổi bật":
        case "Địa điểm nổi bật":
          responseText =
            "📍 Một số địa điểm nổi bật tại Đà Lạt:\n\n" +
            "✨ Quảng trường Lâm Viên - Trần Quốc Toản, P.1\n" +
            "🌊 Hồ Xuân Hương - Trung tâm TP Đà Lạt\n" +
            "⛰️ Núi Langbiang - TT Lạc Dương, Lâm Đồng\n" +
            "🌺 Vườn hoa TP - Trần Quốc Toản, P.8\n" +
            "🏞️ Thác Datanla - QL20, Đèo Prenn";
          break;

        case "🍲 Món ăn đặc sản":
        case "Món ăn đặc sản":
          responseText =
            "🍲 Đặc sản kèm địa chỉ:\n\n" +
            "🥞 Bánh căn - 1 Nhà Chung, P.3\n" +
            "🥘 Lẩu gà lá é - Tao Ngộ, 27 Lê Đại Hành\n" +
            "🥗 Nem nướng Bà Hùng - 328 Phan Đình Phùng\n" +
            "🥤 Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n" +
            "🥖 Bánh mì xíu mại - 26 Hoàng Diệu";
          break;

        case "⏰ Giờ mở cửa":
        case "Giờ mở cửa":
          responseText =
            "⏰ Giờ mở cửa tham khảo:\n\n" +
            "⛰️ Langbiang: 7:00 - 17:00\n" +
            "🌺 Vườn hoa TP: 7:30 - 17:00\n" +
            "🏞️ Thác Datanla: 7:00 - 17:00\n" +
            "🏯 Đường hầm đất sét: 7:00 - 17:00\n" +
            "🌙 Chợ đêm: 17:00 - 22:00";
          break;

        case "📅 Lịch trình du lịch":
        case "Lịch trình du lịch":
          responseText = "Bạn muốn đi mấy ngày?";
          chips = [
            { text: "2 ngày 1 đêm" },
            { text: "3 ngày 2 đêm" },
            { text: "4 ngày 3 đêm" }
          ];
          break;

        case "2 ngày 1 đêm":
        case "2N1Đ":
          responseText =
            "📅 Lịch trình 2N1Đ:\n\n" +
            "🏨 Ở: Homestay Nắng (gần trung tâm)\n" +
            "🍲 Ăn: Lẩu gà lá é, Bánh căn Nhà Chung\n" +
            "📸 Đi: Langbiang, Hồ Xuân Hương, Chợ đêm";
          break;

        case "3 ngày 2 đêm":
        case "3N2Đ":
          responseText =
            "📅 Lịch trình 3N2Đ:\n\n" +
            "🏨 Ở: Khách sạn Roy Villa\n" +
            "🥘 Ăn: Nem nướng Bà Hùng, Lẩu bò Ba Toa\n" +
            "📸 Đi: Quảng trường Lâm Viên, Nhà thờ Con Gà, Langbiang, Thác Datanla, Đồi chè Cầu Đất";
          break;

        case "4 ngày 3 đêm":
        case "4N3Đ":
          responseText =
            "📅 Lịch trình 4N3Đ:\n\n" +
            "🏨 Ở: Dalat Palace Hotel\n" +
            "🍲 Ăn: Lẩu gà lá é, BBQ Fungi Chingu, Kem bơ Thanh Thảo\n" +
            "📸 Đi: Langbiang, Thung lũng Tình Yêu, Thác Pongour, Đồi chè Cầu Đất, Làng Cù Lần, Chùa Linh Phước";
          break;

        case "🎟️ Giá vé tham quan":
        case "Giá vé tham quan":
          responseText =
            "🎟️ Giá vé & địa chỉ:\n\n" +
            "⛰️ Langbiang - Lạc Dương: 30.000đ\n" +
            "🌺 Vườn hoa TP - Trần Quốc Toản: 50.000đ\n" +
            "🏞️ Thác Datanla - QL20 Prenn: 50.000đ\n" +
            "🌄 Thung lũng Tình Yêu - Mai Anh Đào: 100.000đ\n" +
            "🚉 Ga Đà Lạt - Quang Trung: 10.000đ";
          break;
      }
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
