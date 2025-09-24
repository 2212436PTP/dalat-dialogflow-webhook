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
            "☕ Quán cà phê view đẹp ở Đà Lạt:\n" +
            "- Horizon Coffee - 31/6 Tự Phước\n" +
            "- Panorama Cafe - Trại Mát\n" +
            "- Túi Mơ To - Hẻm 31 Sào Nam\n" +
            "- Mê Linh Coffee Garden - Tổ 20, Thôn 4, Tà Nung";
        } else if (q.includes("homestay") && q.includes("trung tâm")) {
          responseText =
            "🏡 Homestay gần trung tâm:\n" +
            "- Dalat Lacasa - 59 Nam Kỳ Khởi Nghĩa\n" +
            "- The Art - 30 Trần Bình Trọng\n" +
            "- Bonjour Homestay - 15 Nam Hồ";
        } else if (q.includes("homestay")) {
          responseText =
            "🏡 Homestay đẹp & giá hợp lý:\n" +
            "- The Wilder-nest - Hồ Tuyền Lâm\n" +
            "- Tre's House - Trần Hưng Đạo\n" +
            "- LengKeng Homestay - Làng hoa Vạn Thành";
        } else if (q.includes("chợ") && q.includes("đêm")) {
          responseText =
            "🌙 Chợ đêm Đà Lạt (Chợ Âm Phủ) nằm ngay trung tâm TP, hoạt động từ 17h đến 22h, nổi tiếng với đồ ăn vặt và quà lưu niệm.";
        } else if (q.includes("chợ")) {
          responseText =
            "🛍️ Các chợ nổi tiếng:\n" +
            "- Chợ Đà Lạt (Trung tâm TP)\n" +
            "- Chợ nông sản Trại Mát – rau củ, hoa tươi";
        } else if (q.includes("thác")) {
          responseText =
            "🌊 Thác đẹp ở Đà Lạt:\n" +
            "- Thác Datanla - QL20, Đèo Prenn\n" +
            "- Thác Pongour - Đức Trọng\n" +
            "- Thác Prenn - Đèo Prenn\n" +
            "- Thác Cam Ly - Đường Hoàng Văn Thụ";
        } else if (q.includes("check-in")) {
          responseText =
            "📸 Địa điểm check-in sống ảo:\n" +
            "- Quảng trường Lâm Viên\n" +
            "- Hồ Xuân Hương\n" +
            "- Cánh đồng hoa Cẩm Tú Cầu\n" +
            "- Nông trại Puppy Farm\n" +
            "- Vườn hoa thành phố";
        } else {
          responseText =
            "📍 Một số địa điểm nổi bật:\n" +
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
            "🥞 Bánh căn:\n- Bánh căn Nhà Chung - 1 Nhà Chung\n- Bánh căn Lệ - 27/44 Yersin";
        } else if (food.includes("lẩu")) {
          responseText =
            "🍲 Lẩu ngon:\n- Lẩu bò Ba Toa - 1/29 Hoàng Diệu\n- Lẩu gà lá é Tao Ngộ - 27 Lê Đại Hành\n- Lẩu dê Lâm Ký - 2 Hoàng Văn Thụ";
        } else if (food.includes("nem nướng")) {
          responseText =
            "🥗 Nem nướng:\n- Bà Hùng - 328 Phan Đình Phùng\n- Dũng Lộc - 254 Phan Đình Phùng";
        } else if (food.includes("bánh tráng")) {
          responseText =
            "🥮 Bánh tráng nướng:\n- Dì Đinh - 26 Hoàng Diệu\n- Quán 112 Nguyễn Văn Trỗi";
        } else if (food.includes("bánh ướt")) {
          responseText =
            "🍗 Bánh ướt lòng gà:\n- Quán Trang - 15F Tăng Bạt Hổ\n- Quán Long - 202 Phan Đình Phùng";
        } else if (food.includes("bánh mì")) {
          responseText =
            "🥖 Bánh mì xíu mại:\n- 26 Hoàng Diệu (nổi tiếng)\n- 47 Thông Thiên Học";
        } else if (food.includes("chè") || food.includes("kem") || food.includes("sữa đậu nành")) {
          responseText =
            "🍧 Đồ ngọt:\n- Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n- Chè Hé - 11A 3/2\n- Sữa đậu nành Hoa Sữa - gần chợ Đêm";
        } else if (food.includes("mì quảng")) {
          responseText =
            "🍜 Mì Quảng:\n- Mì Quảng Hằng - 15 Thông Thiên Học\n- Mì Quảng Hội An - 27 Hai Bà Trưng";
        } else if (food.includes("ốc")) {
          responseText = "🐚 Ốc nhồi thịt - 33 Hai Bà Trưng";
        } else if (food.includes("bbq")) {
          responseText = "🔥 BBQ Fungi Chingu - 1 Nguyễn Thị Minh Khai";
        } else if (food.includes("thái")) {
          responseText = "🇹🇭 Tomyum Thái - 6 Nguyễn Văn Trỗi";
        } else if (food.includes("bún bò")) {
          responseText =
            "🍜 Bún bò ngon ở Đà Lạt:\n" +
            "- Bún bò Xuân An - 15A Nhà Chung\n" +
            "- Bún bò Công - 1 Phù Đổng Thiên Vương\n" +
            "- Bún bò Huế O Lanh - 254 Phan Đình Phùng";
        } else if (food.includes("phở")) {
          responseText =
            "🍲 Phở bò nổi tiếng:\n" +
            "- Phở Hiếu - 23 Tăng Bạt Hổ\n" +
            "- Phở Thưng - 2 Nguyễn Văn Cừ\n" +
            "- Phở Bằng - 18 Nguyễn Văn Trỗi";
        } else if (food.includes("ăn vặt")) {
          responseText =
            "🍡 Ăn vặt Đà Lạt:\n" +
            "- Khu chợ đêm Đà Lạt (đa dạng đồ ăn vặt)\n" +
            "- Bánh tráng nướng Dì Đinh - 26 Hoàng Diệu\n" +
            "- Xiên que nướng Phan Đình Phùng\n" +
            "- Sữa đậu nành nóng - Quán Hoa Sữa gần chợ";
        } else if (food.includes("xiên") || food.includes("nướng")) {
          responseText =
            "🔥 Xiên que & đồ nướng:\n" +
            "- Nướng ngói Cu Đức - 6A Nguyễn Lương Bằng\n" +
            "- Quán nướng Chu - 3 Phạm Ngũ Lão\n" +
            "- Xiên que vỉa hè Phan Đình Phùng";
        } else if (food.includes("cơm gà")) {
          responseText =
            "🍗 Cơm gà ngon ở Đà Lạt:\n" +
            "- Cơm gà Tam Nguyên - 21 Nguyễn Văn Trỗi\n" +
            "- Cơm gà Hải Nam - 12 Bà Triệu";
        } else if (food.includes("kem")) {
          responseText =
            "🍦 Quán kem ở Đà Lạt:\n" +
            "- Kem bơ Thanh Thảo - 76 Nguyễn Văn Trỗi\n" +
            "- Kem Phụng - 97A Nguyễn Văn Trỗi\n" +
            "- Kem dâu tươi - Chợ Đà Lạt";
        } else if (food.includes("chè")) {
          responseText =
            "🍵 Quán chè ngon:\n" +
            "- Chè Hé - 11A 3/2\n" +
            "- Chè Như Ý - 102A Nguyễn Văn Trỗi";
        } else if (food.includes("sữa đậu nành")) {
          responseText =
            "🥛 Sữa đậu nành nóng nổi tiếng:\n" +
            "- Quán Hoa Sữa - cạnh chợ Đêm\n" +
            "- Sữa đậu nành Dì Lan - Nguyễn Thị Minh Khai";
        } else if (food.includes("bánh bao") || food.includes("bánh ngọt")) {
          responseText =
            "🥟 Bánh bao, bánh ngọt:\n" +
            "- Tiệm bánh Cối Xay Gió - 1A Hòa Bình\n" +
            "- Bánh ngọt Liên Hoa - 15-17 3/2\n" +
            "- Bánh bao Như Ý - 45 Hai Bà Trưng";
        } else {
          responseText =
            "🍲 Đặc sản nổi bật:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng\n- Kem bơ Thanh Thảo\n- Bánh mì xíu mại Hoàng Diệu";
        }
        break;
      }

      case "opening_hours":
        responseText =
          "⏰ Giờ mở cửa:\n\n" +
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
          "🎟️ Giá vé:\n\n" +
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

      case "user_intention": {
        const query = req.body.queryResult.queryText.toLowerCase();

        if (query.includes("giá vé") || query.includes("bao nhiêu") || query.includes("vé")) {
          responseText = 
            "🎟️ Giá vé tham quan Đà Lạt:\n" +
            "- Langbiang: 30.000đ\n" +
            "- Vườn hoa thành phố: 50.000đ\n" +
            "- Thác Datanla: 50.000đ\n" +
            "- Thung lũng Tình Yêu: 100.000đ\n" +
            "- Ga Đà Lạt: 10.000đ";
        } 
        
        else if (query.includes("2 ngày 1 đêm") || query.includes("2n1đ")) {
          responseText = 
            "📅 Lịch trình 2 ngày 1 đêm:\n" +
            "Ngày 1: Sáng Langbiang, trưa cơm lam gà nướng, chiều hồ Xuân Hương – chợ đêm.\n" +
            "Ngày 2: Sáng Thác Datanla, trưa đặc sản Đà Lạt, chiều café view đẹp.";
        } 
        
        else if (query.includes("3 ngày 2 đêm") || query.includes("3n2đ")) {
          responseText = 
            "📅 Lịch trình 3 ngày 2 đêm:\n" +
            "Ngày 1: Quảng trường Lâm Viên, Hồ Xuân Hương, chợ đêm.\n" +
            "Ngày 2: Langbiang – Thác Datanla – Thiền viện Trúc Lâm.\n" +
            "Ngày 3: Đồi chè Cầu Đất, café Mê Linh, mua sắm đặc sản.";
        } 
        
        else if (query.includes("4 ngày 3 đêm") || query.includes("4n3đ")) {
          responseText = 
            "📅 Lịch trình 4 ngày 3 đêm:\n" +
            "Ngày 1: Quảng trường Lâm Viên, Hồ Xuân Hương, chợ đêm.\n" +
            "Ngày 2: Langbiang – Thác Datanla – Thiền viện Trúc Lâm.\n" +
            "Ngày 3: Đồi chè Cầu Đất – Làng Cù Lần – Thung lũng Tình Yêu.\n" +
            "Ngày 4: Tham quan vườn hoa, mua sắm đặc sản, café chill.";
        } 
        
        else if (query.includes("địa điểm") || query.includes("chơi") || query.includes("check-in")) {
          responseText = 
            "📍 Địa điểm nổi bật ở Đà Lạt:\n" +
            "- Hồ Xuân Hương\n" +
            "- Quảng trường Lâm Viên\n" +
            "- Langbiang\n" +
            "- Thác Datanla\n" +
            "- Vườn hoa thành phố";
        } 
        
        else if (query.includes("ăn") || query.includes("món") || query.includes("quán") || query.includes("cafe")) {
          responseText = 
            "🍲 Món ăn đặc sản gợi ý:\n" +
            "- Bánh căn Nhà Chung\n" +
            "- Nem nướng Bà Hùng\n" +
            "- Lẩu gà lá é Tao Ngộ\n" +
            "- Bánh tráng nướng Nguyễn Văn Trỗi\n" +
            "- Café Mê Linh, An Café, Horizon";
        } 
        
        else if (query.includes("giờ mở cửa") || query.includes("mấy giờ") || query.includes("open")) {
          responseText = 
            "⏰ Giờ mở cửa tham khảo:\n" +
            "- Langbiang: 7h – 17h\n" +
            "- Thác Datanla: 7h – 17h\n" +
            "- Vườn hoa thành phố: 7h – 18h\n" +
            "- Chợ đêm Đà Lạt: từ 17h đến khuya";
        } 
        
        else {
          responseText = "🤔 Bạn muốn biết về địa điểm, món ăn, giờ mở cửa, lịch trình hay giá vé?";
        }

        // Trả lời kèm chips
        chips = [
          { text: "📍 Địa điểm nổi bật" },
          { text: "🍲 Món ăn đặc sản" },
          { text: "⏰ Giờ mở cửa" },
          { text: "📅 Lịch trình du lịch" },
          { text: "🎟️ Giá vé tham quan" }
        ];
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
