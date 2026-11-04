// ========= CẤU HÌNH LOCKET GOLD CÁ NHÂN ========= //
const isRequest = typeof $response === "undefined";
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

if (isRequest) {
    // 1. LUỒNG REQUEST: Xóa ETag để tránh app load lại dữ liệu cũ chưa mở khóa
    let modifiedHeaders = $request.headers;
    let etagKey = Object.keys(modifiedHeaders).find(k => k.toLowerCase() === "x-revenuecat-etag");
    if (etagKey) modifiedHeaders[etagKey] = "";
    else modifiedHeaders["X-RevenueCat-ETag"] = "";
    $done({ headers: modifiedHeaders });
} else {
    // 2. LUỒNG RESPONSE: Sửa dữ liệu tải về để nhồi gói Gold và tính năng ẩn
    let obj = {};
    try { obj = JSON.parse($response.body); } catch (e) { $done({}); }
    
    // Mở khóa Gold (Bypass RevenueCat)
    if ($request.url.includes("api.revenuecat.com")) {
        obj.Attention = "Locket Gold Active";
        let NMS = {
            display_name: "locket_1600_1y",
            is_sandbox: true,
            ownership_type: "PURCHASED",
            period_type: "normal",
            price: { "amount": 399000.0, "currency": "VND" },
            expires_date: "9999-01-09T10:10:14Z",
            original_purchase_date: "2023-11-25T10:10:15Z",
            purchase_date: "2023-11-25T10:10:14Z",
            store: "app_store"
        };
        let locketGold = {
            purchase_date: "2023-11-25T10:10:14Z",
            product_identifier: "locket_1600_1y",
            expires_date: "9999-01-09T10:10:14Z"
        };
        if (!obj.subscriber) obj.subscriber = { subscriptions: {}, entitlements: {} };
        if (ua.includes("Locket")) {
            obj.subscriber.subscriptions["locket_1600_1y"] = NMS;
            obj.subscriber.entitlements["Gold"] = locketGold;
        }
        $done({ body: JSON.stringify(obj) });
    }
    
    // Mở khóa Tính năng (Bypass Firebase)
    if ($request.url.includes("firebaseremoteconfig.googleapis.com")) {
        if (ua.includes("Locket")) {
            obj.entries = obj.entries || {};
            Object.assign(obj.entries, {
                feature_gates: JSON.stringify({
                    app_icon_picker: "enabled", camera_roll: "enabled", camera_theme: "enabled",
                    locket_views: "enabled", long_captions: "enabled", longer_video: "enabled",
                    unlimited_friends: "enabled", priority_support: "enabled", profile_badge: "enabled",
                    remove_ads: "enabled", video: "enabled", custom_widget_frames: "enabled"
                }),
                camera: JSON.stringify({
                    gold_max_duration: 30.0, max_duration: 30.0,
                    ultra_wide: true, volume_button: true, flash_button: true, telephoto: true, quality_mbps: 0.9
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
    $done({ body: JSON.stringify(obj) });
}
