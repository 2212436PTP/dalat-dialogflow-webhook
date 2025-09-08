// server.js (ESM)
// Webhook cho Dialogflow ES – Du lịch Đà Lạt
// by you + assistant :)

import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ----------------------------------------------------
// Paths & config
// ----------------------------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_PATH = process.env.DATA_PATH || path.join(__dirname, "data.json");
const PORT = process.env.PORT || 10000;

const app = express();
app.use(bodyParser.json());

// ----------------------------------------------------
// Utils
// ----------------------------------------------------
const vnNormalize = (s = "") =>
  s
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const replyText = (text) => ({
  fulfillmentText: text,
  fulfillmentMessages: [{ text: { text: [text] } }],
});

// Tìm key gần đúng trong object theo chuỗi truy vấn (bỏ dấu, không phân biệt hoa thường)
function findBestKey(obj, query) {
  if (!obj || !query) return null;
  const q = vnNormalize(query);
  const keys = Object.keys(obj);
  // ưu tiên khớp chính xác trước
  for (const k of keys) if (vnNormalize(k) === q) return k;
  // sau đó khớp chứa
  for (const k of keys) if (vnNormalize(k).includes(q) || q.includes(vnNormalize(k))) return k;
  return null;
}

// ----------------------------------------------------
// Load dữ liệu
// ----------------------------------------------------
let DATA = {
  opening_hours: {},
  ticket_price: {},
  food_recommendation: {},
  find_place: {},
};

function loadData() {
  try {
    const raw = fs.readFileSync(DATA_PATH, "utf8");
    DATA = JSON.parse(raw);
    console.log(`✅ Loaded data.json (${Object.keys(DATA).join(", ")})`);
  } catch (e) {
    console.error("❌ Cannot load data.json:", e.message);
  }
}
loadData();

// (Tuỳ chọn) hot-reload dữ liệu: gọi GET /reload (nên bảo vệ bằng env SECRET nếu dùng thật)
app.get("/reload", (_req, res) => {
  loadData();
  res.send("Data reloaded");
});

// ----------------------------------------------------
// Health check
// ----------------------------------------------------
app.get("/", (_req, res) => res.send("✅ Webhook is running"));
app.get("/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// ----------------------------------------------------
// Dialogflow Webhook
// ----------------------------------------------------
app.post("/webhook", (req, res) => {
  try {
    const result = req.body?.queryResult || {};
    const intent = result?.intent?.displayName || "";
    const p = result?.parameters || {};
    console.log("➡️  Intent:", intent, "| Params:", p);

    // Trả lời theo intent
    switch (intent) {
      case "Default Welcome Intent": {
        const msg =
          "Xin chào 👋 Mình là trợ lý du lịch Đà Lạt.Mình có thể giúp gì trong trải nghiệm ở Đà Lạt của bạn?";
        return res.json(replyText(msg));
      }

      case "opening_hours": {
        const placeRaw = p.place_name || "";
        const key = findBestKey(DATA.opening_hours, placeRaw);
        if (key) {
          return res.json(replyText(`⏰ ${key} mở cửa: ${DATA.opening_hours[key]}.`));
        }
        return res.json(replyText(`Mình chưa có giờ mở cửa của “${placeRaw}”.`));
      }

      case "ticket_price": {
        const placeRaw = p.place_name || "";
        const key = findBestKey(DATA.ticket_price, placeRaw);
        if (key) {
          return res.json(replyText(`🎫 Giá vé ${key}: ${DATA.ticket_price[key]}.`));
        }
        return res.json(replyText(`Mình chưa có giá vé của “${placeRaw}”.`));
      }

      case "find_place": {
        // place_type là text (ví dụ: "cà phê", "homestay", "thác", "chợ", "check-in")
        const typeRaw = p.place_type || "";
        const key = findBestKey(DATA.find_place, typeRaw);
        if (key) {
          const list = DATA.find_place[key] || [];
          if (list.length) {
            const msg =
              `Gợi ý ${key} nổi bật ở Đà Lạt:\n` +
              list.slice(0, 10).map((x) => `• ${x}`).join("\n");
            return res.json(replyText(msg));
          }
        }
        return res.json(replyText(`Chưa tìm được gợi ý phù hợp cho “${typeRaw}”.`));
      }

      case "food_recommendation": {
        const foodRaw = p.food_name || "";
        const key = findBestKey(DATA.food_recommendation, foodRaw);
        if (key) {
          return res.json(replyText(DATA.food_recommendation[key]));
        }
        const fallback =
          "Bạn có thể thử bánh căn, bánh tráng nướng, lẩu gà lá é, nem nướng hoặc kem bơ – đặc sản Đà Lạt.";
        return res.json(replyText(fallback));
      }

      case "plan_itinerary": {
        const duration = (p.duration || "").toString();
        const budget = (p.budget || "vừa phải").toString();
        const interests = p.interests || []; // mảng

        // Lấy key chính xác/ gần đúng
        const durKey = findBestKey(DATA.itineraries || {}, duration);
        let budKey = "vừa phải";
        if (DATA.itineraries?.[durKey]) {
          const keys = Object.keys(DATA.itineraries[durKey]);
          const tmp = findBestKey(
            keys.reduce((o,k)=> (o[k]=k, o),{}),
            budget
          );
          budKey = tmp || budKey;
        }

        if (!durKey || !DATA.itineraries?.[durKey]) {
          return res.json(replyText("Mình chưa có lịch trình cho thời lượng này. Thử 2N1Đ / 3N2Đ / 4N3Đ nhé!"));
        }

        const plan = DATA.itineraries[durKey][budKey] || DATA.itineraries[durKey]["vừa phải"];
        let msg = `📅 Lịch trình **${durKey}** (${budKey}):\n` + plan.map((d,i)=>`- ${d}`).join("\n");

        if (interests?.length) {
          msg += `\n\n💡 Theo sở thích: ${interests.join(", ")}, mình có thể tinh chỉnh thêm quán ăn/cafe/điểm chụp hình.`;
        }
        return res.json(replyText(msg));
      }

      default: {
        return res.json(replyText("Mình đã nhận yêu cầu, bạn mô tả rõ hơn nhé."));
      }
    }
  } catch (err) {
    console.error("❌ Webhook error:", err);
    return res.json(replyText("Có lỗi xảy ra khi xử lý yêu cầu. Bạn thử lại giúp mình nhé!"));
  }
});

// ----------------------------------------------------
// Start server
// ----------------------------------------------------
app.listen(PORT, () => {
  console.log(`🚀 Webhook listening on port ${PORT}`);
  console.log(`📄 Using data: ${DATA_PATH}`);
});
