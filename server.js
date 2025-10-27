import express from "express";
import bodyParser from "body-parser";

const app = express();
// Lấy port từ biến môi trường của Render, mặc định là 3000
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());

// ===================================
// HÀM HELPER
// ===================================

// Helper function để lấy giá trị Parameter một cách an toàn
const getParam = (req, paramName) => {
    const parameters = req.body.queryResult.parameters || {};
    const value = parameters[paramName];
    
    if (typeof value === 'string' && value.length > 0) {
        return value.toLowerCase();
    }
    // Xử lý trường hợp DialogFlow trả về object rỗng hoặc giá trị không xác định
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

// Tên Context mới dựa trên tên Intent mới
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

        // Lấy Context hiện tại (tìm kiếm Context theo tên mới)
        const outputContexts = req.body.queryResult.outputContexts || [];
        const hotelContext = outputContexts.find(context => 
            context.name.includes(`/contexts/${HOTEL_CONTEXT_NAME}`)
        );
        
        // Lấy các giá trị đã lưu trong Context (ưu tiên giá trị đã lưu)
        const contextParams = hotelContext ? hotelContext.parameters : {};
        
        // Lấy giá trị mới nhất từ request. Nếu không có, dùng giá trị trong Context.
        const loai_cho_o = getParam(req, 'loaichoo') || contextParams.loaichoo;
        const location = getParam(req, 'location') || contextParams.location;
        const budget = getParam(req, 'budget') || contextParams.budget;

        // Thiết lập Context mới để lưu trữ thông tin cho lượt tiếp theo
        let newContext = {
            name: `${session}/contexts/${HOTEL_CONTEXT_NAME}`,
            lifespanCount: 3, // Giữ Context trong 3 lượt hội thoại
            parameters: { loaichoo: loai_cho_o, location, budget }
        };
        
        let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
        let chips = [];

        switch (intent) {
            
            // ===================================
            // 🏨 INTENT MỚI: tim_cho_o_moi (Thay thế cho hotel_booking)
            // ===================================
            case "tim_cho_o_moi": // Intent MẸ mới
            case "hotel_booking - location": // Intent con cũ (giữ tên để đỡ phải sửa trong DF)
            case "hotel_booking - budget": // Intent con cũ (giữ tên để đỡ phải sửa trong DF)
            {
                // TH1: Đã đủ thông tin
                if (loai_cho_o && location && budget) {
                    responseText = `✅ Yêu cầu: **${loai_cho_o}** gần **${location}** với ngân sách **${budget}**. Mình sẽ tìm và gửi danh sách chi tiết cho bạn ngay!`;
                    chips = [{ text: "Tìm thêm chỗ khác" }, { text: "Tôi muốn đặt ngay" }];
                    newContext.lifespanCount = 0; // Hủy Context khi hoàn thành

                // TH2: Thiếu Vị trí (hoặc bị thiếu cả Ngân sách)
                } else if (loai_cho_o && !location) {
                    let prompt = loai_cho_o ? `Tuyệt vời! Bạn đã chọn **${loai_cho_o}**. ` : 'Đã rõ ngân sách bạn mong muốn. ';
                    responseText = prompt + `Bạn muốn tìm ở khu vực nào? (Trung tâm/Hồ Tuyền Lâm) để mình tìm chính xác hơn.`;
                    chips = [
                        { text: "Gần Trung tâm" }, 
                        { text: "View đồi núi" }, 
                        { text: "Gần chợ Đêm" }
                    ];

                // TH3: Đã có Vị trí (hoặc Vị trí + Ngân sách) nhưng thiếu Loại hình
                } else if (location && !loai_cho_o) {
                    responseText = `Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort** ở khu vực ${location} ạ?`;
                    chips = [
                        { text: "Khách sạn" }, 
                        { text: "Homestay" }, 
                        { text: "Resort" }
                    ];
                } 
                // TH4: Thiếu Ngân sách (chỉ còn lại)
                else if (loai_cho_o && location && !budget) {
                    responseText = `Mình cần biết thêm **ngân sách** của bạn (Ví dụ: 800k, dưới 1 triệu) để tìm phòng phù hợp nhất ạ.`;
                    chips = [
                        { text: "Dưới 500k" }, 
                        { text: "500k - 1 triệu" }, 
                        { text: "Trên 1 triệu" }
                    ];
                }
                // TH5: Phản hồi ban đầu (Chưa có Parameter nào)
                else {
                    responseText = "Bạn muốn tìm **Khách sạn**, **Homestay** hay **Resort**? Và bạn muốn ở khu vực nào (Trung tâm/Hồ Tuyền Lâm)?";
                    chips = [
                        { text: "Khách sạn giá rẻ" }, 
                        { text: "Homestay view đẹp" }, 
                        { text: "Resort nghỉ dưỡng" }
                    ];
                }

                // Gửi Context và phản hồi
                return res.json({
                    fulfillmentMessages: [{ text: { text: [responseText] } }],
                    contextOut: [newContext], // LUÔN GỬI Context đã lưu Parameter
                    payload: { richContent: [[{ type: "chips", options: chips }]] }
                });
            }
            
            // ===================================
            // 📅 INTENT: plan_itinerary
            // ===================================
            case "plan_itinerary": {
                const so_ngay = getParam(req, 'so_ngay');
                
                if (so_ngay) {
                    responseText = `Đây là lịch trình ${so_ngay} mẫu. Bạn có muốn mình hỗ trợ **tìm chỗ ở** hoặc **thuê xe máy** để tiện di chuyển không?`; 
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
                return res.json(createSimpleResponse(responseText, chips));
            }

            // ===================================
            // 🚨 Default Fallback Intent (Xử lý khi mất Context)
            // ===================================
            case "Default Fallback Intent":
                // Nếu có Context tìm chỗ ở đang tồn tại, bot sẽ trả lời liên quan
                if (hotelContext) {
                    responseText = `Mình không hiểu câu bạn vừa nhập, nhưng yêu cầu tìm chỗ ở của bạn vẫn đang được giữ. Bạn muốn tìm **Vị trí** hay **Ngân sách** tiếp theo?`;
                    chips = [{ text: "Vị trí" }, { text: "Ngân sách" }];
                } else {
                    responseText = "Xin lỗi, mình chưa hiểu ý bạn lắm. Bạn muốn hỏi về **Địa điểm**, **Món ăn**, **Lịch trình** hay **Chỗ ở** ạ?";
                    chips = [
                        { text: "Tìm chỗ ở" },
                        { text: "Địa điểm check-in" }
                    ];
                }
                return res.json(createSimpleResponse(responseText, chips));

            default:
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