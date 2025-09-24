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
    const queryText = req.body.queryResult.queryText;

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
      case "find_place": {
        const q = queryText.toLowerCase();

        if (q.includes("cà phê") || q.includes("coffee") || q.includes("quán")) {
          responseText =
            "☕ Một số quán cà phê view đẹp ở Đà Lạt:\n\n" +
            "- Horizon Coffee - 31/6 Tự Phước\n" +
            "- Panorama Cafe - Trại Mát\n" +
            "- Túi Mơ To - Hẻm 31 Sào Nam\n" +
            "- Mê Linh Coffee Garden - Tổ 20, Thôn 4, Tà Nung";
        } else if (q.includes("homestay")) {
          responseText =
            "🏡 Homestay đẹp & giá hợp lý:\n\n" +
            "- The Wilder-nest - Hồ Tuyền Lâm\n" +
            "- Dalat Lacasa - 59 Nam Kỳ Khởi Nghĩa\n" +
            "- Tre's House - Trần Hưng Đạo\n" +
            "- LengKeng Homestay - Làng hoa Vạn Thành";
        } else if (q.includes("chợ")) {
          responseText =
            "🛍️ Các chợ nổi tiếng:\n\n" +
            "- Chợ Đà Lạt (Trung tâm TP)\n" +
            "- Chợ Âm Phủ (khu Hòa Bình)\n" +
            "- Chợ nông sản Trại Mát – rau củ, hoa tươi";
        } else if (q.includes("thác")) {
          responseText =
            "🌊 Một số thác đẹp:\n\n" +
            "- Thác Datanla - QL20, Đèo Prenn\n" +
            "- Thác Pongour - Đức Trọng\n" +
            "- Thác Prenn - Đèo Prenn\n" +
            "- Thác Cam Ly - Đường Hoàng Văn Thụ";
        } else if (q.includes("check-in")) {
          responseText =
            "📸 Địa điểm check-in sống ảo:\n\n" +
            "- Quảng trường Lâm Viên\n" +
            "- Hồ Xuân Hương\n" +
            "- Cánh đồng hoa Cẩm Tú Cầu\n" +
            "- Nông trại Puppy Farm\n" +
            "- Vườn hoa thành phố";
        } else {
          responseText =
            "📍 Một số địa điểm nổi bật:\n\n" +
            "✨ Quảng trường Lâm Viên\n" +
            "🌊 Hồ Xuân Hương\n" +
            "⛰️ Núi Langbiang\n" +
            "🌺 Vườn hoa TP\n" +
            "🏞️ Thác Datanla";
        }
        break;
      }

      case "food_recommendation": {
        const food = queryText.toLowerCase();

        if (food.includes("bánh căn")) {
          responseText =
            "🥞 Bánh căn ngon:\n- Bánh căn Nhà Chung - 1 Nhà Chung\n- Bánh căn Lệ - 27/44 Yersin";
        } else if (food.includes("lẩu")) {
          responseText =
            "🍲 Lẩu ngon:\n- Lẩu bò Ba Toa - 1/29 Hoàng Diệu\n- Lẩu gà lá é Tao Ngộ - 27 Lê Đại Hành\n- Lẩu dê Lâm Ký - 2 Hoàng Văn Thụ";
        } else if (food.includes("nem nướng")) {
          responseText =
            "🥗 Nem nướng nổi tiếng:\n- Nem nướng Bà Hùng - 328 Phan Đình Phùng\n- Nem nướng Dũng Lộc - 254 Phan Đình Phùng";
        } else if (food.includes("bánh tráng")) {
          responseText =
            "🥮 Bánh tráng nướng:\n- Dì Đinh - 26 Hoàng Diệu\n- Quán 112 Nguyễn Văn Trỗi";
        } else if (food.includes("bánh ướt")) {
          responseText =
            "🍗 Bánh ướt lòng gà:\n- Quán Trang - 15F Tăng Bạt Hổ\n- Quán Long - 202 Phan Đình Phùng";
        } else if (food.includes("bánh mì")) {
          responseText =
            "🥖 Bánh mì xíu mại:\n- 26 Hoàng Diệu (nổi tiếng)\n- Bánh mì xíu mại BH - 47 Thông Thiên Học";
        } else if (food.includes("chè") || food.includes("kem") || food.includes("sữa đậu nành")) {
          responseText =
            "🍧 Đồ ngọt:\n- Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n- Chè Hé - 11A 3/2\n- Sữa đậu nành Hoa Sữa - gần chợ Đêm";
        } else if (food.includes("mì quảng")) {
          responseText = "🍜 Mì Quảng Hằng - 15 Thông Thiên Học";
        } else if (food.includes("ốc")) {
          responseText = "🐚 Ốc nhồi thịt - 33 Hai Bà Trưng";
        } else if (food.includes("bbq")) {
          responseText = "🔥 BBQ Fungi Chingu - 1 Nguyễn Thị Minh Khai";
        } else if (food.includes("thái")) {
          responseText = "🇹🇭 Tomyum Thái - 6 Nguyễn Văn Trỗi";
        } else {
          responseText =
            "🍲 Một số đặc sản Đà Lạt:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng\n- Kem bơ Thanh Thảo\n- Bánh mì xíu mại Hoàng Diệu";
        }
        break;
      }

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
          "🎟️ Giá vé tham quan:\n\n" +
          "⛰️ Langbiang: 30.000đ\n" +
          "🌺 Vườn hoa TP: 50.000đ\n" +
          "🏞️ Thác Datanla: 50.000đ\n" +
          "🌄 Thung lũng Tình Yêu: 100.000đ\n" +
          "🚉 Ga Đà Lạt: 10.000đ";
        break;

      // ======================
      // Itinerary chi tiết
      // ======================
      case "itinerary_2d1n":
      case "2 ngày 1 đêm":
      case "2N1Đ":
        responseText =
          "📅 Lịch trình 2N1Đ:\n\n" +
          "🌞 Ngày 1:\n" +
          "- Sáng: Quảng trường Lâm Viên, Hồ Xuân Hương\n" +
          "- Trưa: Lẩu gà lá é Tao Ngộ\n" +
          "- Chiều: Núi Langbiang\n" +
          "- Tối: Nem nướng Bà Hùng, dạo Chợ đêm\n\n" +
          "🌞 Ngày 2:\n" +
          "- Sáng: Vườn hoa thành phố\n" +
          "- Trưa: Bánh căn Nhà Chung\n" +
          "- Chiều: Thác Datanla, quay lại trung tâm";
        break;

      case "itinerary_3d2n":
      case "3 ngày 2 đêm":
      case "3N2Đ":
        responseText =
          "📅 Lịch trình 3N2Đ:\n\n" +
          "🌞 Ngày 1:\n" +
          "- Sáng: Quảng trường Lâm Viên, Nhà thờ Con Gà\n" +
          "- Trưa: Lẩu bò Ba Toa\n" +
          "- Chiều: Núi Langbiang\n" +
          "- Tối: Dạo Chợ đêm\n\n" +
          "🌞 Ngày 2:\n" +
          "- Sáng: Thác Datanla\n" +
          "- Trưa: Nem nướng Bà Hùng\n" +
          "- Chiều: Đồi chè Cầu Đất\n" +
          "- Tối: BBQ Fungi Chingu\n\n" +
          "🌞 Ngày 3:\n" +
          "- Sáng: Thung lũng Tình Yêu\n" +
          "- Trưa: Cơm gà Tam Nguyên\n" +
          "- Chiều: Ga Đà Lạt\n" +
          "- Tối: Mua đặc sản";
        break;

      case "itinerary_4d3n":
      case "4 ngày 3 đêm":
      case "4N3Đ":
        responseText =
          "📅 Lịch trình 4N3Đ:\n\n" +
          "🌞 Ngày 1:\n" +
          "- Sáng: Quảng trường Lâm Viên, Hồ Xuân Hương\n" +
          "- Trưa: Lẩu gà lá é Tao Ngộ\n" +
          "- Chiều: Núi Langbiang\n" +
          "- Tối: Dạo Chợ đêm, ăn bánh tráng nướng\n\n" +
          "🌞 Ngày 2:\n" +
          "- Sáng: Vườn hoa thành phố\n" +
          "- Trưa: Nem nướng Bà Hùng\n" +
          "- Chiều: Thác Datanla, máng trượt\n" +
          "- Tối: Lẩu bò Ba Toa\n\n" +
          "🌞 Ngày 3:\n" +
          "- Sáng: Đồi chè Cầu Đất\n" +
          "- Trưa: Picnic tại đồi chè\n" +
          "- Chiều: Làng Cù Lần\n" +
          "- Tối: BBQ Fungi Chingu\n\n" +
          "🌞 Ngày 4:\n" +
          "- Sáng: Thung lũng Tình Yêu\n" +
          "- Trưa: Cơm lam gà nướng\n" +
          "- Chiều: Chùa Linh Phước\n" +
          "- Tối: Mua đặc sản mang về";
        break;
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
