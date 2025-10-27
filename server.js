import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());

// ===================================
// HÀM HELPER
// ===================================

const getParam = (req, paramName) => {
    const parameters = req.body.queryResult.parameters || {};
    const value = parameters[paramName];
    if (typeof value === 'string' && value.length > 0) {
        return value.toLowerCase();
    }
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
        return null; 
    }
    return null;
};

// Hàm tạo phản hồi đơn giản (không cần xử lý Context)
const createSimpleResponse = (responseText, chips = []) => {
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

// Tên Context cho Intent tìm chỗ ở mới
const HOTEL_CONTEXT_NAME = 'tim_cho_o_moi_context';

// ===================================
// 🚀 ENDPOINTS
// ===================================

app.get("/", (req, res) => {
    res.send("🚀 Webhook for Dalat Travel Bot is running!");
});

app.post("/webhook", (req, res) => {
    try {
        const intent = req.body.queryResult.intent.displayName;
        const session = req.body.session;
        console.log("👉 Intent:", intent);

        // Lấy Context tìm chỗ ở
        const outputContexts = req.body.queryResult.outputContexts || [];
        const hotelContext = outputContexts.find(context => context.name.includes(`/contexts/${HOTEL_CONTEXT_NAME}`));
        const contextParams = hotelContext ? hotelContext.parameters : {};
        
        const loai_cho_o = getParam(req, 'loaichoo') || contextParams.loaichoo;
        const location = getParam(req, 'location') || contextParams.location;
        const budget = getParam(req, 'budget') || contextParams.budget;

        let newContext = {
            name: `${session}/contexts/${HOTEL_CONTEXT_NAME}`,
            lifespanCount: 3,
            parameters: { loaichoo: loai_cho_o, location, budget }
        };
        
        let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
        let chips = [];

        switch (intent) {
            
            // ===================================
            // 🏨 INTENT: tim_cho_o_moi (LOGIC CHÍNH)
            // ===================================
            case "tim_cho_o_moi": 
            case "hotel_booking - location": 
            case "hotel_booking - budget": 
            {
                // Logic xử lý Context (Giữ nguyên như đã sửa)
                if (loai_cho_o && location && budget) {
                    responseText = `✅ Yêu cầu: **${loai_cho_o}** gần **${location}** với ngân sách **${budget}**. Mình sẽ tìm và gửi danh sách chi tiết cho bạn ngay!`;
                    chips = [{ text: "Tìm thêm chỗ khác" }, { text: "Tôi muốn đặt ngay" }];
                    newContext.lifespanCount = 0; 

                } else if (loai_cho_o && !location) {
                    let prompt = loai_cho_o ? `Tuyệt vời! Bạn đã chọn **${loai_cho_o}**. ` : 'Đã rõ ngân sách bạn mong muốn. ';
                    responseText = prompt + `Bạn muốn tìm ở khu vực nào? (Trung tâm/Hồ Tuyền Lâm) để mình tìm chính xác hơn.`;
                    chips = [ { text: "Gần Trung tâm" }, { text: "View đồi núi" }, { text: "Gần chợ Đêm" } ];

                } else if (location && !loai_cho_o) {
                    responseText = `Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort** ở khu vực ${location} ạ?`;
                    chips = [ { text: "Khách sạn" }, { text: "Homestay" }, { text: "Resort" } ];
                } else if (loai_cho_o && location && !budget) {
                    responseText = `Mình cần biết thêm **ngân sách** của bạn (Ví dụ: 800k, dưới 1 triệu) để tìm phòng phù hợp nhất ạ.`;
                    chips = [ { text: "Dưới 500k" }, { text: "500k - 1 triệu" }, { text: "Trên 1 triệu" } ];
                } else {
                    responseText = "Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort**? Và bạn muốn ở khu vực nào (Trung tâm/Hồ Tuyền Lâm)?";
                    chips = [ { text: "Khách sạn giá rẻ" }, { text: "Homestay view đẹp" }, { text: "Resort nghỉ dưỡng" } ];
                }

                return res.json({
                    fulfillmentMessages: [{ text: { text: [responseText] } }],
                    contextOut: [newContext],
                    payload: { richContent: [[{ type: "chips", options: chips }]] }
                });
            }
            
            // ===================================
            // 🍲 INTENT: food_recommendation (PHỤC HỒI CHIPS)
            // ===================================
            case "food_recommendation": {
                const mon_an = getParam(req, 'mon_an');
                let response = "";

                if (mon_an && mon_an.includes("bánh căn")) {
                    response = "🥞 Bánh căn ngon nhất ở **Bánh căn Nhà Chung - 1 Nhà Chung** và **Bánh căn Lệ - 27/44 Yersin**. Bạn muốn mình chỉ đường không?"; 
                } else if (mon_an && mon_an.includes("lẩu")) {
                    response = "🍲 Lẩu ngon:\n- **Lẩu gà lá é Tao Ngộ**\n- **Lẩu bò Ba Toa**. Bạn muốn mình gợi ý món **nướng BBQ** không?"; 
                } else {
                    // CHIPS ĐÃ ĐƯỢC PHỤC HỒI Ở ĐÂY
                    response = "🍲 Đặc sản nổi bật:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng. Bạn muốn mình gợi ý món **ăn sáng**, **ăn trưa** hay **ăn tối** ạ?"; 
                    chips = [
                        { text: "Món ăn sáng" }, 
                        { text: "Quán ăn tối" }, 
                        { text: "Món ăn vặt" }
                    ];
                }
                
                responseText = response;
                return res.json(createSimpleResponse(responseText, chips));
            }
            
            // ===================================
            // 🚨 Default Fallback Intent (ĐÃ SỬA LỖI HIỂN THỊ CHIPS)
            // ===================================
            case "Default Fallback Intent":
                if (hotelContext) {
                    // Bot giữ ngữ cảnh chỗ ở
                    responseText = `Mình không hiểu câu bạn vừa nhập, nhưng yêu cầu tìm chỗ ở của bạn vẫn đang được giữ. Bạn muốn tìm **Vị trí** hay **Ngân sách** tiếp theo?`;
                    chips = [{ text: "Vị trí" }, { text: "Ngân sách" }];
                } else {
                    // Bot trả lời chung chung và cung cấp chips chính
                    responseText = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về **Địa điểm**, **Món ăn**, **Lịch trình** hay **Chỗ ở** ạ?";
                    chips = [
                        { text: "Địa điểm nổi bật" },
                        { text: "Món ăn đặc sản" }, 
                        { text: "Lịch trình du lịch" }
                    ];
                }
                return res.json(createSimpleResponse(responseText, chips));

            default:
                // Chips chung cho các Intent khác
                chips = [
                    { text: "Địa điểm nổi bật" },
                    { text: "Món ăn đặc sản" }, 
                    { text: "Lịch trình du lịch" }
                ];
                responseText = "Mình là Chatbot du lịch Đà Lạt, có thể giúp bạn tìm địa điểm, món ăn và lịch trình. Bạn muốn hỏi về gì?";
                return res.json(createSimpleResponse(responseText, chips));
        }
    } catch (error) {
        console.error("❌ Webhook Error:", error);
        return res.status(500).send("Webhook error!");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});