import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());

// ===================================
// HÀM HELPER
// ===================================

const getParam = (req, paramName) => {
    // ... (Giữ nguyên hàm getParam như cũ) ...
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

// Hàm tạo phản hồi cho các chips SỰ KIỆN
const createEventResponse = (responseText, eventChips = []) => {
    let fulfillmentMessages = [
        { text: { text: [responseText] } }
    ];
    if (eventChips.length > 0) {
        fulfillmentMessages.push({
            payload: {
                richContent: [
                    [
                        {
                            type: "chips",
                            options: eventChips // Sử dụng trực tiếp mảng eventChips
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
        let chips = []; // Mảng chips mặc định

        // ĐỊNH NGHĨA CÁC CHIPS SỰ KIỆN CHÍNH
        const mainEventChips = [
            { 
                text: "🏨 Tìm Chỗ ở", 
                event: { name: "EVENT_TIM_CHO_O", languageCode: "vi" } 
            },
            { 
                text: "🍲 Món ăn đặc sản", 
                event: { name: "EVENT_TIM_MON_AN", languageCode: "vi" } 
            },
            { 
                text: "📅 Lịch trình du lịch", 
                event: { name: "EVENT_TIM_LICH_TRINH", languageCode: "vi" } 
            }
        ];

        switch (intent) {
            
            // ===================================
            // 🏨 INTENT: tim_cho_o_moi (LOGIC CHÍNH)
            // ===================================
            case "tim_cho_o_moi": 
            case "hotel_booking - location": 
            case "hotel_booking - budget": 
            {
                // ... (Logic xử lý Context của tim_cho_o_moi giữ nguyên như cũ) ...
                if (loai_cho_o && location && budget) {
                    responseText = `✅ Yêu cầu: **${loai_cho_o}** gần **${location}** với ngân sách **${budget}**. Mình sẽ tìm và gửi danh sách chi tiết cho bạn ngay!`;
                    chips = [{ text: "Tìm thêm chỗ khác" }, { text: "Tôi muốn đặt ngay" }];
                    newContext.lifespanCount = 0; 
                } else if (loai_cho_o && !location) {
                    responseText = `Tuyệt vời! Bạn đã chọn **${loai_cho_o}**. Bạn muốn tìm ở khu vực nào?`;
                    chips = [ { text: "Gần Trung tâm" }, { text: "View đồi núi" }, { text: "Gần chợ Đêm" } ];
                } else if (location && !loai_cho_o) {
                    responseText = `Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort** ở khu vực ${location} ạ?`;
                    chips = [ { text: "Khách sạn" }, { text: "Homestay" }, { text: "Resort" } ];
                } else if (loai_cho_o && location && !budget) {
                    responseText = `Mình cần biết thêm **ngân sách** của bạn (Ví dụ: 800k, dưới 1 triệu) để tìm phòng phù hợp nhất ạ.`;
                    chips = [ { text: "Dưới 500k" }, { text: "500k - 1 triệu" }, { text: "Trên 1 triệu" } ];
                } else {
                    responseText = "Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort**? Và bạn muốn ở khu vực nào?";
                    chips = [ { text: "Khách sạn giá rẻ" }, { text: "Homestay view đẹp" }, { text: "Resort nghỉ dưỡng" } ];
                }
                
                // Phản hồi của tim_cho_o_moi là chips văn bản, không phải event
                return res.json({
                    fulfillmentMessages: [{ text: { text: [responseText] } }],
                    contextOut: [newContext],
                    payload: { richContent: [[{ type: "chips", options: chips }]] }
                });
            }
            
            // ===================================
            // 🍲 INTENT: food_recommendation (Vẫn dùng NLU + Event)
            // ===================================
            case "food_recommendation": {
                // ... (Logic food_recommendation giữ nguyên như cũ) ...
                responseText = "🍲 Đặc sản nổi bật:\n- Bánh căn Nhà Chung\n- Lẩu gà lá é Tao Ngộ\n- Nem nướng Bà Hùng. Bạn muốn mình gợi ý món **ăn sáng**, **ăn trưa** hay **ăn tối** ạ?"; 
                chips = [ { text: "Món ăn sáng" }, { text: "Quán ăn tối" }, { text: "Món ăn vặt" } ];
                return res.json(createEventResponse(responseText, chips)); // Trả về chips văn bản
            }
            
            // ===================================
            // 📅 INTENT: plan_itinerary (Vẫn dùng NLU + Event)
            // ===================================
            case "plan_itinerary": {
                 // ... (Logic plan_itinerary giữ nguyên như cũ) ...
                 responseText = "Bạn muốn đi mấy ngày?";
                 chips = [ { text: "2 ngày 1 đêm" }, { text: "3 ngày 2 đêm" }, { text: "4 ngày 3 đêm" } ];
                 return res.json(createEventResponse(responseText, chips)); // Trả về chips văn bản
            }

            // ===================================
            // 🚨 Default Fallback Intent (SỬ DỤNG EVENT CHIPS)
            // ===================================
            case "Default Fallback Intent":
                responseText = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về **Địa điểm**, **Món ăn**, **Lịch trình** hay **Chỗ ở** ạ?";
                // Gửi về các chips SỰ KIỆN chính
                return res.json(createEventResponse(responseText, mainEventChips));

            // ===================================
            // 👋 Default Welcome Intent (SỬ DỤNG EVENT CHIPS)
            // ===================================
            case "Default Welcome Intent":
            default:
                responseText = "Mình là Chatbot du lịch Đà Lạt, có thể giúp bạn tìm địa điểm, món ăn và lịch trình. Bạn muốn hỏi về gì?";
                // Gửi về các chips SỰ KIỆN chính
                return res.json(createEventResponse(responseText, mainEventChips));
        }
    } catch (error) {
        console.error("❌ Webhook Error:", error);
        return res.status(500).send("Webhook error!");
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});