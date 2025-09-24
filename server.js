import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// ========================================================
// HELPER FUNCTION
// ========================================================
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// ========================================================
// RESPONSES DATABASE
// ========================================================

// ----- FIND_PLACE -----
const findPlaceResponses = [
  "📍 Một số địa điểm hot ở Đà Lạt: Quảng trường Lâm Viên, Hồ Xuân Hương, Langbiang.",
  "✨ Bạn có thể ghé Horizon Coffee để ngắm view núi, hoặc đi Thác Datanla cho trải nghiệm mạo hiểm.",
  "🌸 Địa điểm check-in nổi bật: Vườn hoa thành phố, Đồi chè Cầu Đất, Chợ đêm Đà Lạt.",
  "📷 Đi Đồi Mây, Hồ Tuyền Lâm cũng có nhiều góc sống ảo.",
  "🏡 Homestay rẻ đẹp: Nắng Homestay, The Barn Home Farm.",
  "☕ Quán cà phê view đẹp: Dalat Mountain View, Túi Mơ To.",
  "🌄 Nếu thích thiên nhiên, bạn nên đi Thác Pongour hoặc Thác Prenn.",
  "🏞️ Đường hầm đất sét là điểm mới lạ nhiều bạn trẻ thích.",
  "🌺 Làng Cù Lần và Langbiang phù hợp cho nhóm bạn đi chơi.",
  "🛍️ Buổi tối có thể dạo chợ đêm Đà Lạt mua đồ lưu niệm."
];

// ----- FOOD_RECOMMENDATION -----
const foodResponses = [
  "🍲 Đặc sản Đà Lạt: Bánh căn, Lẩu gà lá é, Nem nướng Bà Hùng.",
  "😋 Muốn ăn nhẹ thì thử bánh tráng nướng, uống sữa đậu nành nóng ở chợ đêm.",
  "🥘 Bạn có thể ghé Fungi Chingu để ăn BBQ, hoặc kem bơ Thanh Thảo để tráng miệng.",
  "🍜 Mì Quảng ngon tại quán Hồng, đường Phan Đình Phùng.",
  "🥗 Bánh ướt lòng gà – quán Trang nổi tiếng.",
  "🥖 Bánh mì xíu mại Hoàng Diệu, sáng nào cũng đông khách.",
  "🥞 Bánh căn Tăng Bạt Hổ là địa chỉ lâu đời.",
  "🍢 Ốc nhồi thịt đường Bà Triệu rất ngon.",
  "🍧 Chè thái ở khu Hòa Bình, rất nhiều quán.",
  "🍖 BBQ ngoài trời ở Barn House BBQ cực chill."
];

// ----- OPENING_HOURS -----
const openingHoursResponses = [
  "⏰ Langbiang mở từ 7:00 đến 17:00, còn chợ đêm hoạt động từ 17:00 đến 22:00.",
  "📅 Vườn hoa thành phố: 7:30 – 17:00, Đường hầm đất sét: 7:00 – 17:00.",
  "🕐 Thác Datanla mở cả ngày từ 7:00 – 17:00, buổi sáng đi là đẹp nhất.",
  "🌄 Thung lũng Tình Yêu mở 7:00 – 17:00.",
  "🏯 Nhà thờ Con Gà mở cửa từ 5:30 – 17:00.",
  "🌙 Lumiere buổi tối vẫn mở, thường đến 21:00.",
  "🌱 Đồi chè Cầu Đất mở từ 6:00 – 17:00.",
  "🏞️ Thác Prenn mở 7:00 – 17:00.",
  "🌊 Thác Pongour mở từ sáng tới 17:00.",
  "🌳 Quảng trường Lâm Viên mở cả ngày, đi tối thì đẹp hơn."
];

// ----- PLAN_ITINERARY -----
const planItineraryResponses = [
  "📅 2N1Đ: Ngày 1 tham quan Langbiang, Hồ Xuân Hương, tối đi chợ đêm. Ngày 2 ghé Vườn hoa và cà phê chill.",
  "🌄 3N2Đ: Ngày 1 city tour, Ngày 2 đi Langbiang – Thác Datanla, Ngày 3 đi Đồi chè Cầu Đất.",
  "🏞️ 4N3Đ: Kết hợp địa điểm tự nhiên (Langbiang, thác Pongour) và các quán cà phê sống ảo.",
  "✨ 2N1Đ: Buổi sáng Langbiang, chiều Hồ Tuyền Lâm, tối đi chợ đêm.",
  "🎉 3N2Đ: Ngày 1 Vườn hoa, Ngày 2 Langbiang – Làng Cù Lần, Ngày 3 chợ Đà Lạt.",
  "🍃 4N3Đ: Dành thêm thời gian tham quan Chùa Linh Phước, Đồi chè, Làng hoa Vạn Thành.",
  "📌 2N1Đ: Phù hợp cho nhóm bạn đi nhanh, chọn địa điểm gần trung tâm.",
  "👨‍👩‍👧‍👦 3N2Đ: Phù hợp gia đình, vừa đi chơi vừa nghỉ ngơi.",
  "📷 4N3Đ: Nhiều điểm check-in sống ảo: Quảng trường, Vườn hoa, Đồi chè.",
  "🔥 Tour tiết kiệm: tập trung vào địa điểm free như Quảng trường, Hồ Xuân Hương."
];

// ----- TICKET_PRICE -----
const ticketPriceResponses = [
  "🎟️ Langbiang: 30k, Thung lũng Tình Yêu: 100k, Vườn hoa thành phố: 50k.",
  "💰 Thác Datanla: 50k, Ga Đà Lạt: 10k, Nhà thờ Con Gà: miễn phí.",
  "📌 Một số địa điểm free: Quảng trường Lâm Viên, Hồ Xuân Hương.",
  "🤑 Lumiere vé khoảng 150k/người.",
  "💵 Đồi chè Cầu Đất: miễn phí tham quan.",
  "🎫 Đường hầm đất sét: 60k/người lớn, 30k/trẻ em.",
  "🪙 Thác Prenn: khoảng 50k/người.",
  "💲 Thác Pongour: 20k/người.",
  "🏯 Vé Vườn hoa thành phố khoảng 50k/người.",
  "📷 Một số combo ở Datanla có giá từ 150k – 300k."
];

// ----- EXTRA INTENTS: TRANSPORT -----
const transportResponses = [
  "🚖 Ở Đà Lạt bạn có thể gọi taxi Mai Linh hoặc Vinasun.",
  "🛵 Thuê xe máy khoảng 100k/ngày, nhiều cửa hàng gần chợ Đà Lạt.",
  "🚌 Xe bus nội thành giá rẻ, nhưng ít chuyến.",
  "🚲 Một số khách sạn có dịch vụ thuê xe đạp.",
  "🚗 GrabCar, GrabBike hoạt động khá phổ biến ở trung tâm.",
  "🚐 Có thể thuê ô tô tự lái với giá từ 800k/ngày.",
  "🛺 Xe điện du lịch chạy quanh hồ Xuân Hương cũng thú vị.",
  "🚕 Taxi Group Đà Lạt: gọi số 0263.38383838.",
  "🛵 Thuê xe máy xăng đầy bình, chỉ cần CMND/CCCD.",
  "🚙 Xe jeep chuyên chở khách lên đỉnh Langbiang."
];

// ----- EXTRA INTENTS: FESTIVAL -----
const festivalResponses = [
  "🌸 Festival Hoa Đà Lạt tổ chức 2 năm 1 lần, thu hút hàng ngàn khách.",
  "🎶 Thường có các đêm nhạc ngoài trời tại Quảng trường Lâm Viên.",
  "🌹 Lễ hội hoa xuân diễn ra quanh Hồ Xuân Hương.",
  "🍷 Lễ hội rượu vang thường tổ chức trong khuôn khổ Festival Hoa.",
  "🎭 Một số lễ hội đường phố diễn ra song song.",
  "🎉 Festival Hoa gần đây nhất là năm 2022.",
  "🌼 Vườn hoa thành phố là trung tâm sự kiện.",
  "📷 Rất nhiều hoạt động triển lãm hoa cảnh.",
  "🎶 Nhiều ca sĩ nổi tiếng tham gia biểu diễn.",
  "✨ Đây là sự kiện lớn nhất của thành phố Đà Lạt."
];

// ----- EXTRA INTENTS: HISTORY -----
const historyResponses = [
  "🏞️ Đà Lạt được thành lập bởi bác sĩ Alexandre Yersin vào năm 1893.",
  "🏯 Thời Pháp thuộc, nơi đây được quy hoạch thành khu nghỉ dưỡng.",
  "📖 Ga Đà Lạt xây từ năm 1932, là nhà ga cổ nhất Đông Dương.",
  "🌲 Đà Lạt nổi tiếng với rừng thông và khí hậu mát mẻ quanh năm.",
  "🏡 Biệt thự cổ ở Đà Lạt do người Pháp xây dựng.",
  "🕰️ Nhiều công trình kiến trúc Pháp còn tồn tại đến nay.",
  "🌺 Tên gọi 'Đà Lạt' xuất phát từ tiếng Latin 'Dat Aliis Laetitiam Aliis Temperiem'.",
  "📌 Ban đầu nơi này là khu nghỉ mát cho quan chức Pháp.",
  "🏛️ Dinh Bảo Đại là một trong những di tích lịch sử quan trọng.",
  "📷 Đà Lạt từng được mệnh danh 'Tiểu Paris'."
];

// ----- EXTRA INTENTS: TIPS -----
const tipsResponses = [
  "💡 Nên mang áo khoác vì buổi tối khá lạnh.",
  "🧳 Mang giày thể thao để đi bộ tham quan.",
  "📱 Luôn mang theo tiền mặt vì nhiều chỗ chưa hỗ trợ thẻ.",
  "🕐 Đi tham quan buổi sáng để tránh đông khách.",
  "📷 Đừng quên pin sạc dự phòng để chụp hình.",
  "🌧️ Mùa mưa nên chuẩn bị áo mưa hoặc ô.",
  "🛵 Nếu thuê xe máy, nhớ mang giấy tờ tùy thân.",
  "🍵 Buổi sáng sớm và chiều tối là thời điểm đẹp nhất để chụp hình.",
  "📌 Nên đặt phòng khách sạn trước 1–2 tuần.",
  "💰 Giá đặc sản trong chợ đêm thường cao, nên trả giá nhẹ."
];

// ----- EXTRA INTENTS: SHOPPING -----
const shoppingResponses = [
  "🛍️ Đặc sản Đà Lạt: mứt dâu, trà atiso, cà phê.",
  "🍓 Chợ đêm bán nhiều dâu tươi, dâu sấy.",
  "☕ Cà phê Cầu Đất nổi tiếng hương vị đậm đà.",
  "🌿 Trà atiso tốt cho sức khỏe, nên mua ở các cơ sở uy tín.",
  "🍯 Mật ong rừng cũng là món quà phổ biến.",
  "🍇 Nho sấy, chuối sấy được nhiều du khách ưa thích.",
  "🥭 Nhiều cửa hàng bán trái cây sấy đóng gói đẹp mắt.",
  "🛒 Big C và các siêu thị cũng bán đặc sản chuẩn.",
  "📦 Có thể đặt ship đặc sản tận nơi.",
  "🎁 Chợ Đà Lạt là địa điểm mua quà tặng phổ biến nhất."
];

// ========================================================
// WEBHOOK ENDPOINT
// ========================================================
app.post("/webhook", (req, res) => {
  try {
    const intent = req.body.queryResult.intent.displayName;
    console.log("👉 Intent nhận được:", intent);

    let responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";

    switch (intent) {
      case "find_place":
        responseText = getRandomResponse(findPlaceResponses);
        break;
      case "food_recommendation":
        responseText = getRandomResponse(foodResponses);
        break;
      case "opening_hours":
        responseText = getRandomResponse(openingHoursResponses);
        break;
      case "plan_itinerary":
        responseText = getRandomResponse(planItineraryResponses);
        break;
      case "ticket_price":
        responseText = getRandomResponse(ticketPriceResponses);
        break;
      case "transport":
        responseText = getRandomResponse(transportResponses);
        break;
      case "festival":
        responseText = getRandomResponse(festivalResponses);
        break;
      case "history":
        responseText = getRandomResponse(historyResponses);
        break;
      case "tips":
        responseText = getRandomResponse(tipsResponses);
        break;
      case "shopping":
        responseText = getRandomResponse(shoppingResponses);
        break;
      default:
        responseText = "👋 Xin chào, mình có thể hỗ trợ gì cho chuyến du lịch của bạn?";
    }

    // Chips luôn hiển thị lại
    const chips = [
      { text: "📍 Địa điểm nổi bật" },
      { text: "🍲 Món ăn đặc sản" },
      { text: "⏰ Giờ mở cửa" },
      { text: "📅 Lịch trình du lịch" },
      { text: "🎟️ Giá vé tham quan" },
      { text: "🚖 Đi lại ở Đà Lạt" },
      { text: "🎉 Festival Hoa Đà Lạt" },
      { text: "🏛️ Lịch sử Đà Lạt" },
      { text: "💡 Mẹo du lịch" },
      { text: "🛍️ Mua sắm đặc sản" }
    ];

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

// ========================================================
// START SERVER
// ========================================================
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
