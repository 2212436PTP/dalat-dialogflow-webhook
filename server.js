import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Helper function để lấy giá trị Parameter một cách an toàn
const getParam = (req, paramName) => {
    // Kiểm tra và lấy Parameter từ DialogFlow
    const parameters = req.body.queryResult.parameters || {};
    const value = parameters[paramName];
    
    // Nếu giá trị là một mảng và có phần tử, lấy phần tử đầu tiên
    if (Array.isArray(value) && value.length > 0) {
        return value[0].toLowerCase();
    }
    // Nếu giá trị là chuỗi, chuyển sang chữ thường (để dễ so sánh)
    if (typeof value === 'string') {
        return value.toLowerCase();
    }
    // Trả về null nếu không tìm thấy hoặc không hợp lệ
    return null;
};

// Hàm tạo phản hồi cho DialogFlow
const createResponse = (responseText, chips = []) => {
    let fulfillmentMessages = [
        { text: { text: [responseText] } }
    ];

    if (chips.length > 0) {
        fulfillmentMessages.push({
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
        });
    }

    return { fulfillmentMessages };
};

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
      { text: "📅 Lịch trình du lịch" }
    ];

    // ======================
    // Logic xử lý Intents
  	// ======================
    switch (intent) {
        
      case "find_place": {
        const loai_cho_o = getParam(req, 'loai_cho_o');
        const location = getParam(req, 'location');
        
        let response = "";

        if (loai_cho_o && loai_cho_o.includes("cafe")) {
            response =
                "☕ Quán cà phê view đẹp ở Đà Lạt:\n" +
                "- Horizon Coffee - 31/6 Tự Phước\n" +
                "- Panorama Cafe - Trại Mát\n" +
                "- Mê Linh Coffee Garden - Tổ 20, Thôn 4, Tà Nung";
        } else if (loai_cho_o && (loai_cho_o.includes("homestay") || loai_cho_o.includes("chỗ ở") || loai_cho_o.includes("nghỉ ngơi"))) {
            if (location && location.includes("trung tâm")) {
                response =
                    "🏡 Homestay gần trung tâm:\n" +
                    "- Dalat Lacasa - 59 Nam Kỳ Khởi Nghĩa\n" +
                    "- The Art - 30 Trần Bình Trọng";
            } else {
                response =
                    "🏡 Homestay đẹp & giá hợp lý:\n" +
                    "- The Wilder-nest - Hồ Tuyền Lâm\n" +
                    "- Tre's House - Trần Hưng Đạo";
            }
        } else if (loai_cho_o && loai_cho_o.includes("chợ")) {
            if (queryText.toLowerCase().includes("đêm")) {
                 response = "🌙 Chợ đêm Đà Lạt (Chợ Âm Phủ) nằm ngay trung tâm TP, hoạt động từ 17h đến 22h, nổi tiếng với **bánh tráng nướng** và **sữa đậu nành nóng**! Bạn có muốn mình gợi ý thêm quán ăn đêm không?"; // Dự đoán: ăn đêm
            } else {
                response = "🛍️ Các chợ nổi tiếng:\n" + "- Chợ Đà Lạt (Trung tâm TP)\n" + "- Chợ nông sản Trại Mát – rau củ, hoa tươi";
            }
        } else if (loai_cho_o && loai_cho_o.includes("thác")) {
            response =
                "🌊 Thác Datanla mở cửa 7h-17h, giá vé 50.000đ. Bạn có muốn tham khảo thêm về **máng trượt** hay **giá vé Cáp treo** không ạ?"; // Dự đoán: giá vé, dịch vụ
        } else {
            response =
                "📍 Một số địa điểm nổi bật:\n" +
                "✨ Quảng trường Lâm Viên\n" + "🌊 Hồ Xuân Hương\n" + "⛰️ Núi Langbiang";
        }

        responseText = response;
        break;
      }

      case "food_recommendation": {
        const mon_an = getParam(req, 'mon_an');
        let response = "";

        if (mon_an && mon_an.includes("bánh căn")) {
          response = "🥞 Bánh căn ngon nhất ở **Bánh căn Nhà Chung - 1 Nhà Chung** và **Bánh căn Lệ - 27/44 Yersin**. Bạn muốn mình chỉ đường không?"; // Dự đoán: chỉ đường
        } else if (mon_an && mon_an.includes("lẩu")) {
          response = "🍲 Lẩu ngon:\n- **Lẩu gà lá é Tao Ngộ** (27 Lê Đại Hành)\n- **Lẩu bò Ba Toa** (1/29 Hoàng Diệu). Nếu bạn không thích lẩu, mình có thể gợi ý món **nướng BBQ** không?"; // Dự đoán: món thay thế
        } else if (mon_an && mon_an.includes("nem nướng")) {
          response = "🥗 Nem nướng Bà Hùng và Dũng Lộc là 2 quán nổi tiếng. Bạn muốn tìm quán **gần khu vực của bạn** hơn không?"; // Dự đoán: vị trí
        } else {
            response = "🍲 Đặc sản nổi bật:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng. Bạn muốn mình gợi ý món **ăn sáng**, **ăn trưa** hay **ăn tối** ạ?"; // Dự đoán: thời điểm ăn
            chips = [
                { text: "Món ăn sáng" }, 
                { text: "Quán ăn tối" }, 
                { text: "Món ăn vặt" }
            ];
        }
        
        responseText = response;
        break;
      }
      
      // ======================
      // INTENT MỚI: hotel_booking
  	// ======================
      case "hotel_booking": {
          const loai_cho_o = getParam(req, 'loai_cho_o'); // Khách sạn, Homestay...
          const location = getParam(req, 'location'); // Trung tâm, Hồ Tuyền Lâm...
          const budget = getParam(req, 'budget'); // 500k, giá rẻ, 1 triệu...
          
          let response = "";

          // TH1: Đủ cả 3 thông tin (loại, vị trí, ngân sách)
          if (loai_cho_o && location && budget) {
              response = `✨ Tuyệt vời! Mình sẽ tìm cho bạn các ${loai_cho_o} **gần ${location}** với ngân sách **${budget}**. Vui lòng chờ 1 lát... (API tìm kiếm)`;
              chips = [{ text: "Ngày Check-in" }, { text: "Số người" }]; // Dự đoán: Ngày/số người
          } 
          // TH2: Thiếu ngân sách (Chỉ có loại hình và vị trí)
          else if (loai_cho_o && location) {
              response = `🏡 Bạn muốn ${loai_cho_o} **gần ${location}**. Bạn dự tính ngân sách khoảng **bao nhiêu** một đêm để mình tìm chính xác hơn ạ?`;
              chips = [{ text: "Dưới 500k" }, { text: "500k - 1 triệu" }, { text: "Trên 1 triệu" }]; // Chủ động gợi ý ngân sách
          } 
          // TH3: Thiếu vị trí (Chỉ có loại hình và ngân sách)
          else if (loai_cho_o && budget) {
              response = `💵 Với ngân sách ${budget}, bạn muốn tìm ${loai_cho_o} **gần trung tâm** để tiện di chuyển hay **gần đồi núi** để có view đẹp ạ?`;
              chips = [{ text: "Gần Trung tâm" }, { text: "View đồi núi" }, { text: "Gần Hồ Tuyền Lâm" }]; // Chủ động gợi ý vị trí
          } 
          // TH4: Chỉ có ý định chung chung (Thiếu tất cả hoặc chỉ có loại hình)
          else {
              response = "Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort**? Và bạn muốn ở khu vực nào (Trung tâm/Hồ Tuyền Lâm)?";
              chips = [{ text: "Khách sạn giá rẻ" }, { text: "Homestay view đẹp" }, { text: "Resort nghỉ dưỡng" }];
          }

          responseText = response;
          break;
      }

      // ======================
      // CÁC INTENT KHÁC
  	// ======================
      case "plan_itinerary": {
          const so_ngay = getParam(req, 'so_ngay');
          
          if (so_ngay) {
              // ... (Logic trả lời lịch trình như cũ) ...
              responseText = `Tuyệt vời! Đây là lịch trình ${so_ngay} mẫu. Bạn có muốn mình hỗ trợ **tìm chỗ ở** hoặc **thuê xe máy** để tiện di chuyển không?`; // Dự đoán: chỗ ở, di chuyển
              chips = [
                { text: "Tìm chỗ ở" }, 
                { text: "Thuê xe máy" },
                { text: "3 ngày 2 đêm" }
             ];
          } else {
              responseText = "Bạn muốn đi mấy ngày?";
              chips = [
                { text: "2 ngày 1 đêm" },
                { text: "3 ngày 2 đêm" },
                { text: "4 ngày 3 đêm" }
              ];
          }
          break;
      }

      case "Default Fallback Intent":
          responseText = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về **Địa điểm**, **Món ăn**, **Lịch trình** hay **Chỗ ở** ạ?";
          chips = [
              { text: "Tìm chỗ ở" },
              { text: "Địa điểm check-in" },
              { text: "Món ăn ngon" }
          ];
          break;

      // Thêm các Intent khác ở đây (transportation_query, ticket_price, opening_hours...)
    }

    // Gửi phản hồi về DialogFlow
    res.json(createResponse(responseText, chips));
    
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    res.status(500).send("Webhook error!");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});