// ========= ID & Cấu hình Bypass ========= //
const mapping = { 'Locket': ['Gold'] };
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

// LUỒNG 1: Xử lý xóa Header (ETag) nếu là HTTP Request
if (typeof $response === "undefined") {
    var modifiedHeaders = $request.headers;
    let etagKey = Object.keys(modifiedHeaders).find(k => k.toLowerCase() === "x-revenuecat-etag");
    if (etagKey) modifiedHeaders[etagKey] = "";
    else modifiedHeaders["X-RevenueCat-ETag"] = "";
    $done({ headers: modifiedHeaders });
} 
// LUỒNG 2: Xử lý tiêm gói Gold và Tính năng nếu là HTTP Response
else {
    var obj = {};
    try { obj = JSON.parse($response.body); } catch (e) { $done({}); }

    // 2.1 Giả mạo gói Gold (RevenueCat)
    if ($request.url.includes("api.revenuecat.com") && ua.includes("Locket")) {
        obj.Attention = "Locket Gold Active (TTSan)";
        var TTS = {
            auto_resume_date: null, display_name: "locket_1600_1y", is_sandbox: true,
            ownership_type: "PURCHASED", period_type: "normal",
            price: { "amount": 399000.0, "currency": "VND" },
            expires_date: "9999-01-09T10:10:14Z", purchase_date: "2027-11-25T10:10:14Z",
            store: "app_store"
        };
        var locketGold = {
            purchase_date: "2027-11-25T10:10:14Z", product_identifier: "locket_1600_1y",
            expires_date: "9999-01-09T10:10:14Z"
        };
        
        if (!obj.subscriber) obj.subscriber = { subscriptions: {}, entitlements: {} };
        const match = Object.keys(mapping).find(e => ua.includes(e));
        if (match) {
            let [e, s] = mapping[match];
            s ? (locketGold.product_identifier = s, obj.subscriber.subscriptions[s] = TTS) : obj.subscriber.subscriptions["locket_1600_1y"] = TTS, obj.subscriber.entitlements[e] = locketGold
        } else {
            obj.subscriber.subscriptions["locket_1600_1y"] = TTS;
            obj.subscriber.entitlements.pro = locketGold;
        }
    }

    // 2.2 Mở khóa tính năng (Firebase Remote Config)
    if ($request.url.includes("firebaseremoteconfig.googleapis.com") && ua.includes("Locket")) {
        obj.entries = obj.entries || {};
        Object.assign(obj.entries, {
            feature_gates: JSON.stringify({
                app_icon_picker: "enabled", camera_roll: "enabled", camera_theme: "enabled",
                locket_views: "enabled", long_captions: "enabled", longer_video: "enabled",
                unlimited_friends: "enabled", video: "enabled"
            }),
            camera: JSON.stringify({
                gold_max_duration: 30.0, max_duration: 30.0, ultra_wide: true, 
                volume_button: true, flash_button: true, telephoto: true, quality_mbps: 0.9
            }),
            camera_roll: JSON.stringify({
                gold_max_duration: 30.0, video_max_duration: 30.0, max_duration: 30.0,
                trim_max_duration: 30.0, camera_roll_max_duration: 30.0, quality_mbps: 0.9, flash_button: true
            }),
            history_ads_mode: "off",
            sentry_sample_rate: "0",
            max_friends_count: "999999",
            unsend_message_enabled: "true",
            typing_indicators_enabled: "true"
        });
    }
    
    $done({ body: JSON.stringify(obj) });
}
