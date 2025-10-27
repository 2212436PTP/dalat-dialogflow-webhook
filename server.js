import express from "express";
import bodyParser from "body-parser";

const app = express();
// Lấy port từ biến môi trường của Render, mặc định là 3000
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());

// Helper function để lấy giá trị Parameter một cách an toàn
const getParam = (req, paramName) => {
    const parameters = req.body.queryResult.parameters || {};
    const value = parameters[paramName];
    
    // Đảm bảo giá trị là chuỗi và chuyển sang chữ thường để dễ so sánh
    if (typeof value === 'string' && value.length > 0) {
        return value.toLowerCase();
    }
    // Xử lý trường hợp DialogFlow trả về object rỗng cho System Entities
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
        return null; 
    }
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

// ===================================
// 🚀 ENDPOINTS
// ===================================

app.get("/", (req, res) => {
  res.send("🚀 Webhook for Dalat Travel Bot is running!");
});

app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    console.log("👉 Intent:", intent);

    let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
    let chips = [
      { text: "📍 Địa điểm nổi bật" },
      { text: "🍲 Món ăn đặc sản" },
      { text: "📅 Lịch trình du lịch" }
    ];

    switch (intent) {
        
        // ===================================
        // 🏨 INTENT: hotel_booking (Logic thông minh)
        // ===================================
        case "hotel_booking": {
            // Trích xuất 3 Parameter quan trọng
            const loai_cho_o = getParam(req, 'loaichoo'); 
            const location = getParam(req, 'location');
            const budget = getParam(req, 'budget');
            
            let response = "";
            let newChips = [];
            
            // TH1: Đã đủ thông tin (loại hình, vị trí, ngân sách)
            if (loai_cho_o && location && budget) {
                response = `✅ Yêu cầu: ${loai_cho_o} gần ${location} với ngân sách ${budget}. Mình sẽ tìm và gửi danh sách chi tiết cho bạn ngay!`;
                newChips = [{ text: "Tìm thêm chỗ khác" }, { text: "Tôi muốn đặt ngay" }];

            // TH2: Thiếu Vị trí hoặc Loại hình
            } else if (loai_cho_o || budget) {
                
                // Nếu đã có Loại hình (nhờ click chips hoặc gõ trực tiếp) nhưng thiếu Vị trí
                if (!location) {
                    let prompt = loai_cho_o ? `Tuyệt vời! Bạn đã chọn **${loai_cho_o}**. ` : 'Đã rõ ngân sách bạn mong muốn. ';
                    response = prompt + `Bạn muốn tìm ở khu vực nào? (Trung tâm/Hồ Tuyền Lâm) để mình tìm chính xác hơn.`;
                    newChips = [
                        { text: "Gần Trung tâm" }, 
                        { text: "View đồi núi" }, 
                        { text: "Gần chợ Đêm" }
                    ];
                } 
                // Nếu đã có Vị trí (location) nhưng thiếu Loại hình (Khách sạn/Homestay)
                else if (!loai_cho_o) {
                    response = `Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort** ở khu vực ${location} ạ?`;
                    newChips = [
                        { text: "Khách sạn" }, 
                        { text: "Homestay" }, 
                        { text: "Resort" }
                    ];
                }
            } 
            // TH3: Chỉ hỏi chung chung ban đầu (Chưa có Parameter nào)
            else {
                // Phản hồi ban đầu của bot: Hỏi về Loại hình và Vị trí
                response = "Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort**? Và bạn muốn ở khu vực nào (Trung tâm/Hồ Tuyền Lâm)?";
                newChips = [
                    { text: "Khách sạn giá rẻ" }, 
                    { text: "Homestay view đẹp" }, 
                    { text: "Resort nghỉ dưỡng" }
                ];
            }
            
            responseText = response;
            chips = newChips;
            break;
        }

        // ===================================
        // 🍲 INTENT: food_recommendation
        // ===================================
        case "food_recommendation": {
            const mon_an = getParam(req, 'mon_an');
            let response = "";

            if (mon_an && mon_an.includes("bánh căn")) {
                response = "🥞 Bánh căn ngon nhất ở **Bánh căn Nhà Chung - 1 Nhà Chung** và **Bánh căn Lệ - 27/44 Yersin**. Bạn muốn mình chỉ đường không?"; 
            } else if (mon_an && mon_an.includes("lẩu")) {
                response = "🍲 Lẩu ngon:\n- **Lẩu gà lá é Tao Ngộ**\n- **Lẩu bò Ba Toa**. Bạn muốn mình gợi ý món **nướng BBQ** không?"; 
            } else {
                response = "🍲 Đặc sản nổi bật:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng. Bạn muốn mình gợi ý món **ăn sáng**, **ăn trưa** hay **ăn tối** ạ?"; 
                chips = [
                    { text: "Món ăn sáng" }, 
                    { text: "Quán ăn tối" }, 
                    { text: "Món ăn vặt" }
                ];
            }
            
            responseText = response;
            break;
        }
        
        // ===================================
        // 📅 INTENT: plan_itinerary
        // ===================================
        case "plan_itinerary": {
            const so_ngay = getParam(req, 'so_ngay');
            
            if (so_ngay) {
                // Logic trả lời lịch trình chi tiết dựa trên so_ngay
                responseText = `Tuyệt vời! Đây là lịch trình ${so_ngay} mẫu. Bạn có muốn mình hỗ trợ **tìm chỗ ở** hoặc **thuê xe máy** để tiện di chuyển không?`; 
                chips = [
                    { text: "Tìm chỗ ở" }, 
                    { text: "Thuê xe máy" }
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

        // ===================================
        // 🚨 Default Fallback Intent
        // ===================================
      case "Default Fallback Intent":
          responseText = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về **Địa điểm**, **Món ăn**, **Lịch trình** hay **Chỗ ở** ạ?";
          chips = [
              { text: "Tìm chỗ ở" },
              { text: "Địa điểm check-in" },
              { text: "Món ăn ngon" }
          ];
          break;

      default:
        responseText = "Mình là Chatbot du lịch Đà Lạt, có thể giúp bạn tìm địa điểm, món ăn và lịch trình. Bạn muốn hỏi về gì?";
        break;
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