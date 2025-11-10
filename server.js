import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ===================================
// HÀM HELPER ĐỂ GỬI RESPONSE KÈM CHIPS (Giữ nguyên)
// ===================================
const createResponseWithChips = (responseText, chips = []) => {
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

// Hàm này giúp lấy Context để xử lý plan_itinerary (Giữ nguyên)
const getContextParam = (req, paramName, contextName) => {
    const context = req.body.queryResult.outputContexts?.find(c => c.name.includes(contextName));
    return context?.parameters[paramName] || null;
};


app.get("/", (req, res) => {
    res.send("🚀 Webhook for Dialogflow ES is running!");
});

// Keep-alive endpoint để tránh server bị sleep
app.get("/keep-alive", (req, res) => {
    res.json({ 
        status: "Server is alive", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime() 
    });
});

app.post("/webhook", (req, res) => {
    try {
        const intent = req.body.queryResult.intent.displayName;
        const queryText = req.body.queryResult.queryText;

        console.log("👉 Intent:", intent);
        console.log("👉 QueryText:", queryText);

        let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
        const q = queryText.toLowerCase(); // Biến này dùng cho logic tìm kiếm queryText

        // Định nghĩa chips cơ bản
        let chips = [
            { text: "📍 Địa điểm nổi bật" },
            { text: "🍲 Món ăn đặc sản" },
            { text: "⏰ Giờ mở cửa" },
            { text: "📅 Lịch trình du lịch" },
            { text: "🎟️ Giá vé tham quan" },
            { text: "🛌 Chỗ ở giá rẻ" },
            { text: "🛵 Thuê xe máy" }
        ];

        // Chips chính cho Fallback/Welcome
        const mainChips = [
            { text: "📍 Địa điểm nổi bật" },
            { text: "🍲 Món ăn đặc sản" },
            { text: "📅 Lịch trình du lịch" },
            { text: "🛌 Chỗ ở giá rẻ" },
            { text: "🛵 Thuê xe máy" }
        ];

        // ======================
        // XỬ LÝ CÁC CHIPS CỤ THỂ TRƯỚC KHI VÀO INTENT
        // ======================
        
        // ======================
        // XỬ LÝ CÁC CHIPS CON CỤ THỂ
        // ======================
        
        // Chips về món ăn cụ thể
        if (q.includes("bánh căn")) {
            responseText = 
                "🥞 **Bánh căn ngon nhất Đà Lạt:**\n\n" +
                "🏆 **Bánh căn Nhà Chung** - 1 Nhà Chung\n" +
                "⭐ Đánh giá: 4.8/5 - Nổi tiếng nhất\n" +
                "💰 Giá: 3.000đ/chiếc\n\n" +
                "🥈 **Bánh căn Lệ** - 27/44 Yersin\n" +
                "⭐ Đánh giá: 4.6/5 - Giá rẻ\n" +
                "💰 Giá: 2.500đ/chiếc\n\n" +
                "📍 **Cách đi:** Cả 2 quán đều gần chợ trung tâm";
            chips = [
                { text: "Địa chỉ cụ thể" },
                { text: "Giá cả" },
                { text: "Lẩu gà lá é" }
            ];
        }
        else if (q.includes("lẩu gà lá é")) {
            responseText = 
                "🍲 **Lẩu gà lá é đặc sản:**\n\n" +
                "🏆 **Lẩu gà lá é Tao Ngộ** - 27 Lê Đại Hành\n" +
                "⭐ Nổi tiếng nhất, vị đậm đà\n" +
                "💰 Giá: 150.000đ/nồi (2-3 người)\n\n" +
                "🥈 **Lẩu gà lá é Lâm Ký** - 2 Hoàng Văn Thụ\n" +
                "⭐ Không gian rộng rãi\n" +
                "💰 Giá: 140.000đ/nồi\n\n" +
                "🌿 **Đặc biệt:** Lá é có tác dụng làm thơm thịt gà";
            chips = [
                { text: "Địa chỉ cụ thể" },
                { text: "Nem nướng" },
                { text: "Bánh căn" }
            ];
        }
        else if (q.includes("nem nướng")) {
            responseText = 
                "🥗 **Nem nướng Đà Lạt:**\n\n" +
                "🏆 **Nem nướng Bà Hùng** - 328 Phan Đình Phùng\n" +
                "⭐ Lâu đời nhất, gia truyền\n" +
                "💰 Giá: 25.000đ/phần\n\n" +
                "🥈 **Nem nướng Dũng Lộc** - 254 Phan Đình Phùng\n" +
                "⭐ Nem to, nhiều rau sống\n" +
                "💰 Giá: 23.000đ/phần\n\n" +
                "🥬 **Kèm theo:** Bánh tráng, rau sống, nước chấm";
            chips = [
                { text: "Địa chỉ cụ thể" },
                { text: "Bánh tráng nướng" },
                { text: "Lẩu gà lá é" }
            ];
        }
        else if (q.includes("bánh tráng nướng")) {
            responseText = 
                "🥮 **Bánh tráng nướng Đà Lạt:**\n\n" +
                "🏆 **Dì Đinh** - 26 Hoàng Diệu\n" +
                "⭐ Nổi tiếng nhất, đông khách\n" +
                "💰 Giá: 8.000đ - 12.000đ/chiếc\n\n" +
                "🥈 **Quán 112** - 112 Nguyễn Văn Trỗi\n" +
                "⭐ Ít đông hơn, vị ngon\n" +
                "💰 Giá: 7.000đ - 10.000đ/chiếc\n\n" +
                "🔥 **Đặc biệt:** Nướng than hoa, có trứng + pate";
            chips = [
                { text: "Địa chỉ cụ thể" },
                { text: "Giá cả" },
                { text: "Nem nướng" }
            ];
        }
        // Xử lý riêng cho các chips phổ biến
        else if (q.includes("món ăn đặc sản") || q === "🍲 món ăn đặc sản") {
            responseText = 
                "🍲 Món ăn đặc sản Đà Lạt nổi tiếng:\n\n" +
                "🥞 **Bánh căn** - Bánh căn Nhà Chung (1 Nhà Chung)\n" +
                "🍲 **Lẩu gà lá é** - Tao Ngộ (27 Lê Đại Hành)\n" +
                "🥗 **Nem nướng** - Bà Hùng (328 Phan Đình Phùng)\n" +
                "🥮 **Bánh tráng nướng** - Dì Đinh (26 Hoàng Diệu)\n" +
                "🍦 **Kem bơ** - Thanh Thảo (76 Nguyễn Văn Trỗi)\n" +
                "🥛 **Sữa đậu nành nóng** - Quán Hoa Sữa (gần chợ đêm)";
            chips = [
                { text: "Bánh căn" },
                { text: "Lẩu gà lá é" },
                { text: "Nem nướng" },
                { text: "Bánh tráng nướng" }
            ];
        }
        // Chips về thuê xe máy cụ thể
        else if (q.includes("giá thuê xe")) {
            responseText = 
                "💰 **Bảng giá thuê xe máy Đà Lạt:**\n\n" +
                "🏍️ **Xe số (Wave, Sirius):**\n" +
                "• 1 ngày: 100k-120k\n" +
                "• 3 ngày: 280k-320k\n" +
                "• 1 tuần: 600k-700k\n\n" +
                "🛵 **Xe tay ga (Vision, Lead):**\n" +
                "• 1 ngày: 130k-150k\n" +
                "• 3 ngày: 350k-400k\n" +
                "• 1 tuần: 800k-900k\n\n" +
                "⛽ **Xăng:** ~25k/lít\n" +
                "🛡️ **Bảo hiểm:** +20k/ngày (tuỳ chọn)";
            chips = [
                { text: "Địa chỉ cụ thể" },
                { text: "Thủ tục thuê xe" },
                { text: "Lưu ý quan trọng" }
            ];
        }
        else if (q.includes("địa chỉ cụ thể") || q.includes("địa chỉ thuê xe")) {
            responseText = 
                "📍 **Địa chỉ thuê xe máy cụ thể:**\n\n" +
                "🏪 **Minh Thư Motor**\n" +
                "📍 22 Bùi Thị Xuân (cách chợ 200m)\n" +
                "📞 0263.3822.892\n" +
                "⏰ 7:00 - 21:00\n\n" +
                "🏪 **Thuê xe Hùng**\n" +
                "📍 40 Hai Bà Trưng (gần Hồ Xuân Hương)\n" +
                "📞 0913.456.789\n" +
                "⏰ 6:30 - 22:00\n\n" +
                "🏪 **Xe máy Phương Nam**\n" +
                "📍 8 Tăng Bạt Hổ (gần bến xe)\n" +
                "📞 0987.654.321\n" +
                "⏰ 7:00 - 20:00";
            chips = [
                { text: "Giá thuê xe" },
                { text: "Thủ tục thuê xe" },
                { text: "Đường đi" }
            ];
        }
        else if (q.includes("thủ tục thuê xe")) {
            responseText = 
                "📋 **Thủ tục thuê xe máy:**\n\n" +
                "📄 **Giấy tờ cần thiết:**\n" +
                "• CMND/CCCD (bản gốc)\n" +
                "• GPLX A1 hoặc A2 (bản gốc)\n" +
                "• Đặt cọc: 1-2 triệu VNĐ\n\n" +
                "⚠️ **Lưu ý quan trọng:**\n" +
                "• Kiểm tra xe trước khi nhận\n" +
                "• Chụp ảnh vết xước (nếu có)\n" +
                "• Hỏi số điện thoại hỗ trợ\n" +
                "• Đổ đầy bình xăng khi trả\n\n" +
                "🕐 **Giờ nhận/trả:** Thường 7:00-21:00";
            chips = [
                { text: "Giá thuê xe" },
                { text: "Địa chỉ cụ thể" },
                { text: "Tips lái xe" }
            ];
        }
        else if (q.includes("thuê xe máy") || q === "🛵 thuê xe máy") {
            responseText = 
                "🛵 **Dịch vụ thuê xe máy ở Đà Lạt:**\n\n" +
                "🏪 **Minh Thư Motor** - 22 Bùi Thị Xuân (gần chợ)\n" +
                "📞 Hotline: 0263.3822.892\n" +
                "💰 Giá: 120.000đ - 150.000đ/ngày\n\n" +
                "🏪 **Thuê xe Hùng** - 40 Hai Bà Trưng\n" +
                "💰 Giá: 100.000đ - 130.000đ/ngày\n\n" +
                "🏪 **Xe máy Phương Nam** - 8 Tăng Bạt Hổ\n" +
                "💰 Giá: 110.000đ - 140.000đ/ngày\n\n" +
                "⚠️ **Lưu ý:** Cần GPLX và đặt cọc 1-2 triệu";
            chips = [
                { text: "Giá thuê xe" },
                { text: "Địa chỉ cụ thể" },
                { text: "Thủ tục thuê xe" }
            ];
        }
        // Chips về chỗ ở cụ thể
        else if (q.includes("giá dưới 500k") || q.includes("dưới 500k")) {
            responseText = 
                "💰 **Chỗ ở dưới 500k/đêm:**\n\n" +
                "🏡 **Homestay giá rẻ (200k-400k):**\n" +
                "• **Tre's House** - Trần Hưng Đạo (350k)\n" +
                "• **Mai Villa** - 1/1 Mai Anh Đào (320k)\n" +
                "• **Dalat Backpackers** - 31 Trương Công Định (280k)\n\n" +
                "🏨 **Khách sạn bình dân (400k-480k):**\n" +
                "• **Green Hotel** - 151 Phan Đình Phùng (450k)\n" +
                "• **Khách sạn Ngọc Lan** - Nguyễn Chí Thanh (420k)\n\n" +
                "⭐ Tất cả đều có WiFi, nước nóng, gần trung tâm";
            chips = [
                { text: "Homestay gần trung tâm" },
                { text: "Khách sạn view đẹp" },
                { text: "500k - 1 triệu" }
            ];
        }
        else if (q.includes("homestay gần trung tâm")) {
            responseText = 
                "🏡 **Homestay gần trung tâm Đà Lạt:**\n\n" +
                "🏆 **Dalat Lacasa** - 59 Nam Kỳ Khởi Nghĩa\n" +
                "⭐ Cách chợ 300m, đẹp, sạch\n" +
                "💰 Giá: 600k-800k/đêm\n\n" +
                "🥈 **The Art** - 30 Trần Bình Trọng\n" +
                "⭐ Thiết kế nghệ thuật, Instagram\n" +
                "💰 Giá: 550k-750k/đêm\n\n" +
                "🥉 **Bonjour Homestay** - 15 Nam Hồ\n" +
                "⭐ Phong cách Pháp, view đẹp\n" +
                "💰 Giá: 500k-700k/đêm";
            chips = [
                { text: "Giá dưới 500k" },
                { text: "Homestay view đồi núi" },
                { text: "Khách sạn view đẹp" }
            ];
        }
        else if (q.includes("khách sạn view đẹp")) {
            responseText = 
                "🏨 **Khách sạn view đẹp Đà Lạt:**\n\n" +
                "🏆 **Dalat Palace Heritage** - 12 Trần Phú\n" +
                "⭐ View hồ Xuân Hương tuyệt đẹp\n" +
                "💰 Giá: 1.2tr-2tr/đêm\n\n" +
                "🥈 **Ana Mandara Villas** - Lê Lai\n" +
                "⭐ Villa riêng, view núi đồi\n" +
                "💰 Giá: 2.5tr-4tr/đêm\n\n" +
                "🥉 **Green Hotel** - 151 Phan Đình Phùng\n" +
                "⭐ View thành phố, giá hợp lý\n" +
                "💰 Giá: 450k-650k/đêm";
            chips = [
                { text: "Giá dưới 500k" },
                { text: "500k - 1 triệu" },
                { text: "Homestay gần trung tâm" }
            ];
        }
        else if (q.includes("500k - 1 triệu") || q.includes("500k-1tr")) {
            responseText = 
                "💎 **Chỗ ở 500k - 1 triệu/đêm:**\n\n" +
                "🏡 **Homestay cao cấp:**\n" +
                "• **The Art** - 30 Trần Bình Trọng (750k)\n" +
                "• **Dalat Lacasa** - 59 Nam Kỳ Khởi Nghĩa (800k)\n" +
                "• **Bonjour Homestay** - 15 Nam Hồ (650k)\n\n" +
                "🏨 **Khách sạn 3-4 sao:**\n" +
                "• **Green Hotel** - 151 Phan Đình Phùng (550k)\n" +
                "• **Saigon Dalat Hotel** - 6 Hoa Sen (850k)\n" +
                "• **Villa Pink House** - Bùi Thị Xuân (700k)";
            chips = [
                { text: "Homestay view đồi núi" },
                { text: "Khách sạn view đẹp" },
                { text: "Trên 1 triệu" }
            ];
        }
        else if (q.includes("chỗ ở giá rẻ") || q === "🛌 chỗ ở giá rẻ" || q.includes("homestay giá rẻ")) {
            responseText = 
                "🛌 **Chỗ ở giá rẻ ở Đà Lạt:**\n\n" +
                "🏡 **Homestay giá tốt (300k-500k/đêm):**\n" +
                "- Tre's House - Trần Hưng Đạo\n" +
                "- Dalat Backpackers - 31 Trương Công Định\n" +
                "- Mai Villa - 1/1 Mai Anh Đào\n\n" +
                "🏨 **Khách sạn bình dân (400k-600k/đêm):**\n" +
                "- Khách sạn Ngọc Lan - Nguyễn Chí Thanh\n" +
                "- Green Hotel - 151 Phan Đình Phùng\n" +
                "- Dalat Palace Heritage - 12 Trần Phú";
            chips = [
                { text: "Homestay gần trung tâm" },
                { text: "Khách sạn view đẹp" },
                { text: "Giá dưới 500k" }
            ];
        }
        
        // Nếu đã xử lý chips, return luôn không cần vào switch case
        if (q.includes("món ăn đặc sản") || q.includes("thuê xe máy") || q.includes("chỗ ở giá rẻ")) {
            return res.json(createResponseWithChips(responseText, chips));
        }

        // ======================
        // Intent chính
        // ======================
        switch (intent) {
            case "find_place": {
                // --- LOGIC GỐC CỦA BẠN ---
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
                } else if (q.includes("homestay")) { // Logic này sẽ chạy cho "Homestay view đồi núi"
                    responseText =
                        "🏡 Homestay đẹp & giá hợp lý:\n" +
                        "- The Wilder-nest - Hồ Tuyền Lâm\n" +
                        "- Tre's House - Trần Hưng Đạo\n" +
                        "- LengKeng Homestay - Làng hoa Vạn Thành";
                     // THÊM: Xử lý cụ thể cho "view đồi núi" nếu cần
                     if (q.includes("view đồi núi")) {
                         responseText =
                            "🏡 Homestay view đồi núi đẹp:\n" +
                            "- The Wilder-nest - Hồ Tuyền Lâm\n" +
                            "- Hai Ả Homestay - Đồi Đa Phú\n" +
                            "- The Kupid - Đồi Robin";
                     }
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
                } else { // Logic này sẽ chạy cho "Chỗ ở", "Nghỉ ngơi"
                    responseText =
                        "📍 Một số địa điểm nổi bật:\n" +
                        "✨ Quảng trường Lâm Viên\n" +
                        "🌊 Hồ Xuân Hương\n" +
                        "⛰️ Núi Langbiang\n" +
                        "🌺 Vườn hoa TP\n" +
                        "🏞️ Thác Datanla";
                }
                // --- KẾT THÚC LOGIC GỐC ---
                break;
            }

            // --- CÁC CASE KHÁC GIỮ NGUYÊN ---
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
            case "opening_hours": {
                 responseText =
                    "⏰ Giờ mở cửa:\n\n" +
                    "⛰️ Langbiang: 7:00 - 17:00\n" +
                    "🌺 Vườn hoa TP: 7:30 - 17:00\n" +
                    "🏞️ Thác Datanla: 7:00 - 17:00\n" +
                    "🏯 Đường hầm đất sét: 7:00 - 17:00\n" +
                    "🌙 Chợ đêm: 17:00 - 22:00";
                break;
            }
            case "plan_itinerary": {
                 responseText = "Bạn muốn đi mấy ngày?";
                chips = [
                    { text: "2 ngày 1 đêm" },
                    { text: "3 ngày 2 đêm" },
                    { text: "4 ngày 3 đêm" }
                ];
                break;
            }
            case "ticket_price": {
                 responseText =
                    "🎟️ Giá vé:\n\n" +
                    "⛰️ Langbiang: 30.000đ\n" +
                    "🌺 Vườn hoa TP: 50.000đ\n" +
                    "🏞️ Thác Datanla: 50.000đ\n" +
                    "🌄 Thung lũng Tình Yêu: 100.000đ\n" +
                    "🚉 Ga Đà Lạt: 10.000đ";
                break;
            }
            case "itinerary_2d1n": case "2 ngày 1 đêm": case "2N1Đ": {
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
            }
            case "itinerary_3d2n": case "3 ngày 2 đêm": case "3N2Đ": {
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
            }
            case "itinerary_4d3n": case "4 ngày 3 đêm": case "4N3Đ": {
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
            case "user_intention": {
                const query = req.body.queryResult.queryText.toLowerCase();

                if (query.includes("giá vé") || query.includes("bao nhiêu") || query.includes("vé")) {
                    responseText =
                        "🎟️ Giá vé tham quan Đà Lạt:\n" +
                        "- Langbiang: 30.000đ\n" +
                        "- Vườn hoa TP: 50.000đ\n" +
                        "- Thác Datanla: 50.000đ\n" +
                        "- Thung lũng Tình Yêu: 100.000đ\n" +
                        "- Ga Đà Lạt: 10.000đ";
                }
                else if (query.includes("chỗ ở giá rẻ") || query.includes("chỗ nghỉ rẻ") || query.includes("homestay rẻ")) {
                    responseText =
                        "🛌 Gợi ý chỗ ở giá tốt (dưới 500k/đêm):\n" +
                        "- **Dalat Backpackers Hostel** (150k/giường dorm, gần trung tâm).\n" +
                        "- **The Note Homestay** (Khoảng 300k/phòng riêng, yên tĩnh).\n" +
                        "- **YOLO Camp Site** (Từ 400k/phòng, view đẹp, hơi xa trung tâm).\n" +
                        "- **The Hobbit Home** (TB 350k/phòng, phong cách độc đáo).\n" +
                        "Bạn muốn xem thêm homestay gần trung tâm hay view đồi núi không?";
                    chips = [
                        { text: "Homestay gần trung tâm" },
                        { text: "Homestay view đồi núi" },
                        { text: "🛵 Thuê xe máy" }
                    ];
                }
                else if (query.includes("thuê xe máy") || query.includes("giá thuê xe")) {
                    responseText =
                        "🛵 **Giá thuê xe máy** tại Đà Lạt:\n" +
                        "- Xe số (Wave/Sirius): ~100k - 120k/ngày.\n" +
                        "- Xe tay ga (Vision/Lead): ~130k - 150k/ngày.\n\n" +
                        "**Một số địa chỉ tham khảo:**\n" +
                        "- **Thuê xe máy Hoàng Anh:** Gần chợ Đà Lạt (SĐT: 02633 99 78 73).\n" +
                        "- **Dịch vụ Thuê xe Đà Lạt:** Đường Bùi Thị Xuân (SĐT: 0909 363 463).\n" +
                        "- Nhiều cửa hàng trên đường **Phan Bội Châu** (gần chợ).\n\n" +
                        "Bạn có cần SĐT cụ thể của chỗ nào không?";
                    chips = [
                        { text: "Lấy SĐT Hoàng Anh" },
                        { text: "Lấy SĐT Bùi Thị Xuân" },
                        { text: "📅 Lịch trình du lịch" }
                    ];
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

                // Nếu không phải là 2 trường hợp mới thì dùng chips mặc định
                if (!(query.includes("chỗ ở giá rẻ") || query.includes("thuê xe máy"))){
                     chips = [
                        { text: "📍 Địa điểm nổi bật" },
                        { text: "🍲 Món ăn đặc sản" },
                        { text: "⏰ Giờ mở cửa" },
                        { text: "📅 Lịch trình du lịch" },
                        { text: "🎟️ Giá vé tham quan" },
                        { text: "🛌 Chỗ ở giá rẻ" },
                        { text: "🛵 Thuê xe máy" }
                    ];
                }
                break;
            }
            // --- KẾT THÚC CÁC CASE KHÁC ---

            // ===================================
            // SỬA LỖI: DEFAULT WELCOME/FALLBACK
            // ===================================
            case "Default Welcome Intent":
            case "Default Fallback Intent":
                // Sử dụng chung logic xử lý chips với phần trên
                // Không cần viết lại, sẽ được xử lý ở phần "XỬ LÝ CÁC CHIPS CỤ THỂ"
                
                // === THÊM KIỂM TRA KEYWORD CHO CHỖ Ở ===
                if (q.includes("homestay") || q.includes("chỗ ở") || q.includes("nghỉ ngơi")) {
                    // Chạy lại logic homestay từ case "find_place"
                    if (q.includes("homestay") && q.includes("trung tâm")) {
                         responseText =
                            "🏡 Homestay gần trung tâm:\n" +
                            "- Dalat Lacasa - 59 Nam Kỳ Khởi Nghĩa\n" +
                            "- The Art - 30 Trần Bình Trọng\n" +
                            "- Bonjour Homestay - 15 Nam Hồ";
                    } else if (q.includes("view đồi núi")) { // Bắt "Homestay view đồi núi"
                         responseText =
                            "🏡 Homestay view đồi núi đẹp:\n" +
                            "- The Wilder-nest - Hồ Tuyền Lâm\n" +
                            "- Hai Ả Homestay - Đồi Đa Phú\n" +
                            "- The Kupid - Đồi Robin";
                    } else if (q.includes("homestay")) { // Bắt "homestay" chung
                         responseText =
                            "🏡 Homestay đẹp & giá hợp lý:\n" +
                            "- The Wilder-nest - Hồ Tuyền Lâm\n" +
                            "- Tre's House - Trần Hưng Đạo\n" +
                            "- LengKeng Homestay - Làng hoa Vạn Thành";
                    } else { // Bắt "chỗ ở", "nghỉ ngơi" chung -> Trả lời địa điểm nổi bật như logic gốc
                         responseText =
                            "📍 Một số địa điểm nổi bật:\n" +
                            "✨ Quảng trường Lâm Viên\n" +
                            "🌊 Hồ Xuân Hương\n" +
                            "⛰️ Núi Langbiang\n" +
                            "🌺 Vườn hoa TP\n" +
                            "🏞️ Thác Datanla";
                    }
                    // Dùng chips mặc định sau khi trả lời về chỗ ở
                    chips = [
                        { text: "📍 Địa điểm nổi bật" }, { text: "🍲 Món ăn đặc sản" },
                        { text: "📅 Lịch trình du lịch" }, { text: "🛌 Chỗ ở giá rẻ" },
                        { text: "🛵 Thuê xe máy" }
                    ];
                }
                // === KẾT THÚC KIỂM TRA KEYWORD ===
                else {
                    // Nếu không phải keyword chỗ ở, trả lời mặc định
                    responseText = "Mình là Chatbot du lịch Đà Lạt, có thể giúp bạn tìm địa điểm, món ăn và lịch trình. Bạn muốn hỏi về gì?";
                    chips = mainChips; // Gửi 5 chips chính
                }
                break;
        }

        res.json(createResponseWithChips(responseText, chips));

    } catch (error) {
        console.error("❌ Webhook Error:", error);
        res.status(500).send("Webhook error!");
    }
});

// Tự động ping để giữ server alive (chỉ khi deploy)
const RENDER_URL = process.env.RENDER_EXTERNAL_URL; // Render sẽ tự set biến này
if (RENDER_URL) {
    setInterval(() => {
        fetch(`${RENDER_URL}/keep-alive`)
            .then(() => console.log("✅ Keep-alive ping sent"))
            .catch(() => console.log("❌ Keep-alive ping failed"));
    }, 14 * 60 * 1000); // Ping mỗi 14 phút
}

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    if (RENDER_URL) {
        console.log(`🔄 Keep-alive enabled for: ${RENDER_URL}`);
    }
});