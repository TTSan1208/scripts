// ========= LOCKET GOLD (Bản cá nhân của San) ========= //
const mapping = { 'Locket': ['Gold'] };
var ua = $request.headers["User-Agent"] \vert{}\vert{} $request.headers["user-agent"] || "";

// 1. LUỒNG REQUEST (Xóa ETag)
if (typeof $response === "undefined") {
    var modifiedHeaders = $request.headers;
    let etagKey = Object.keys(modifiedHeaders).find(k => k.toLowerCase() === "x-revenuecat-etag");
    if (etagKey) modifiedHeaders[etagKey] = "";
    else modifiedHeaders["X-RevenueCat-ETag"] = "";
    $done({ headers: modifiedHeaders });
} 
// 2. LUỒNG RESPONSE (Bơm dữ liệu)
else {
    var obj = {};
    try { obj = JSON.parse($response.body); } catch (e) {$done({}); }

    // --- Giả mạo gói Gold từ RevenueCat ---
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
            s ? (locketGold.product_identifier = s, obj.subscriber.subscriptions[s] = TTS) : obj.subscriber.subscriptions["locket_1600_1y"] = TTS, obj.subscriber.entitlements[e] = locketGold;
        } else {
            obj.subscriber.subscriptions["locket_1600_1y"] = TTS;
            obj.subscriber.entitlements.pro = locketGold;
        }
    }

    // --- Mở tính năng ẩn & Chèn Caption từ Firebase ---
    if ($request.url.includes("firebaseremoteconfig.googleapis.com") && ua.includes("Locket")) {
        obj.entries = obj.entries || {};
        Object.assign(obj.entries, {
            // Tính năng cốt lõi
            feature_gates: JSON.stringify({
                app_icon_picker: "enabled", camera_roll: "enabled", camera_theme: "enabled",
                locket_views: "enabled", long_captions: "enabled", longer_video: "enabled",
                unlimited_friends: "enabled", priority_support: "enabled", profile_badge: "enabled",
                remove_ads: "enabled", video: "enabled", custom_widget_frames: "enabled", streak_recovery: "enabled"
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
            typing_indicators_enabled: "true",
            
            // Cài đặt hiển thị & Rollcall
            rollcall_confirm_skip_tagging: "false",
            rollcall_tap_to_tag_enabled: "false",
            journal_settings: JSON.stringify({
                debug_menu_enabled: false, focus_animation: true, compact_header: true,
                friends_button: true, reverse_scroll_direction: false, streak_visualization: true,
                streak_visualization_style: "gradient", streak_header_minimum_count: 0,
                streak_visualization_minimum_count: 2,
                overlay_indicators: { location: true, music: true, static_content: true, weather: true }
            }),

            // Kho Captions 
            overlay_navigator_enabled: "true",
            overlays_v2_config: JSON.stringify({ suggestions_enabled: true }),
            captions_enabled: "true",
            music_caption_enabled: "true",
            music_caption_song_preview_enabled: "true",
            link_caption_link_enabled: "true",
            overlay_dynamic_captions: JSON.stringify([
                "standard", "poll", "color_palette", "review", "music", "location",
                "weather", "time", "streak", "star_sign", "party_time", "locket_count",
                "good_morning", "goodnight", "ootd", "miss_you", "custom", "phunu_2010", "halloween_2026"
            ]),
            overlay_items: JSON.stringify([
                {
                    section: "🎨 General",
                    items: [
                        { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },
                        { overlay_id: "caption:review", source: "local", caption: { type: "review" } },
                        { overlay_id: "caption:music", source: "local", caption: { type: "music" } },
                        { overlay_id: "caption:location", source: "local", caption: { type: "location" } },
                        { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },
                        { overlay_id: "caption:time", source: "local", caption: { type: "time" } },
                        { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },
                        { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },
                        { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },
                        { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },
                        { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } }
                    ]
                },
                {
                    section: "🎨 Holiday Caption",
                    items: [
                        { overlay_id: "caption:halloween_2026", source: "remote", caption: { background: { colors: ["#150804", "#C8540D"] }, icon: { data: "🎃", type: "emoji" }, max_lines: 1, text: "Halloween", localized_text: { en: "Halloween", vn: "Halloween" }, text_color: "#FFB182", type: "static_content" } },
                        { overlay_id: "caption:autumn_2026", source: "remote", caption: { background: { colors: ["#FFE0A0", "#F6A53A"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "Xin chào Mùa Thu", localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" }, text_color: "#FFFFFF", type: "static_content" } },
                        { overlay_id: "caption:christmas_eve_2026", source: "remote", caption: { background: { colors: ["#2FA85F", "#176B3A"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
                        { overlay_id: "caption:christmas_day_2026", source: "remote", caption: { background: { colors: ["#E53935", "#A81818"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
                        { overlay_id: "caption:new_years_eve_2026", source: "remote", caption: { background: { colors: ["#FFC64B", "#FFEDBF"] }, icon: { data: "🥂", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#643F00", type: "static_content" } },
                        { overlay_id: "caption:new_years_day_2027", source: "remote", caption: { background: { colors: ["#3B00EC", "#823FFF"] }, icon: { data: "💫", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#FFFFFF", type: "static_content" } }
                    ]
                },
                {
                    section: "🎨 Tình yêu & Cơm chó 💕",
                    items: [
                        { overlay_id: "caption:toi_nho_em", source: "remote", caption: { background: { colors: ["#FFFFFF", "#6D9EEB"] }, max_lines: 1, text: "보고 싶어 🥺", text_color: "#000000E6", type: "static_content" } },
                        { overlay_id: "caption:miss_you", source: "remote", caption: { background: { colors: ["#EC0C00", "#FF493F"] }, icon: { data: "🥰", type: "emoji" }, max_lines: 1, text: "Miss you", text_color: "#FFFFFFDB", type: "static_content" } },
                        { overlay_id: "caption:em_nho_anhh", source: "remote", caption: { background: { colors: ["#F2B8CF", "#E8C8EE", "#D7C9F5"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "em nhớ anhh", text_color: "#69465F", type: "static_content" } },
                        { overlay_id: "caption:nho_anh_phien", source: "remote", caption: { background: { colors: ["#F0B5CB", "#F6D0DF", "#DCCAF0"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "nhớ anh tới mức hơi phiền", text_color: "#70445A", type: "static_content" } },
                        { overlay_id: "caption:i_love_you", source: "remote", caption: { background: { colors: ["#F4BFD3", "#F9D9CF", "#DCCDF5"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "i love you", text_color: "#70465F", type: "static_content" } },
                        { overlay_id: "caption:yeu_cuc_dang", source: "remote", caption: { background: { colors: ["#F2B5C8", "#F8D5D9", "#F6E5D2"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "yêu cục dàng", text_color: "#754454", type: "static_content" } },
                        { overlay_id: "caption:yeu_emmm", source: "remote", caption: { background: { colors: ["#F2AFC6", "#F7C9D9", "#E5CFF4"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "Yeu Emmm", text_color: "#70445C", type: "static_content" } },
                        { overlay_id: "caption:yeu_anhhh", source: "remote", caption: { background: { colors: ["#B8C9F2", "#D5DDF8", "#E8CFF0"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "Yeu Anhhh", text_color: "#414C72", type: "static_content" } },
                        { overlay_id: "caption:baby_love", source: "remote", caption: { background: { colors: ["#FFB6C1", "#FF69B4", "#FF1493"] }, icon: { data: "🧸", type: "emoji" }, max_lines: 1, text: "Baby Love 💖", text_color: "#FFFFFFE6", type: "static_content" } },
                        { overlay_id: "caption:muon_duoc_om", source: "remote", caption: { background: { colors: ["#FF9A9E", "#FECFEF"] }, icon: { data: "🫂", type: "emoji" }, max_lines: 1, text: "Muốn được ôm", text_color: "#FFFFFF", type: "static_content" } },
                        { overlay_id: "caption:cho_hun_mieng", source: "remote", caption: { background: { colors: ["#F3AFC7", "#F8D0D8", "#F4C9BB"] }, icon: { data: "😘", type: "emoji" }, max_lines: 1, text: "cho hun miếng coi", text_color: "#754252", type: "static_content" } },
                        { overlay_id: "caption:me_anh_me_ngu", source: "remote", caption: { background: { colors: ["#C4C8EF", "#DED3F4", "#EBCDE4"] }, icon: { data: "💤", type: "emoji" }, max_lines: 1, text: "mê anh hơn mê ngủ", text_color: "#4F4770", type: "static_content" } },
                        { overlay_id: "caption:be_be_can_do", source: "remote", caption: { background: { colors: ["#F4C2D5", "#F9E1E8", "#E9D4F5"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "em bé cần được dỗ", text_color: "#75495F", type: "static_content" } },
                        { overlay_id: "caption:iu_thi_noi", source: "remote", caption: { background: { colors: ["#F4BFD0", "#E9C7EF", "#D7D0F4"] }, icon: { data: "🤭", type: "emoji" }, max_lines: 1, text: "iu thì nói, đừng có ngại", text_color: "#68465F", type: "static_content" } },
                        { overlay_id: "caption:iu_hong_thi_bao", source: "remote", caption: { background: { colors: ["#F1B5CE", "#F8D6E4", "#E8C8F0"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "iu hong thì bảo", text_color: "#70445E", type: "static_content" } },
                        { overlay_id: "caption:anh_thuong_em", source: "remote", caption: { background: { colors: ["#E9B9CF", "#F5D5DF", "#D8C8F0"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "anh có thương em thiệt hong", text_color: "#70465D", type: "static_content" } },
                        { overlay_id: "caption:yeu_em_nhiem_vu", source: "remote", caption: { background: { colors: ["#E9B7CD", "#F3D0DD", "#E4C6F1"] }, icon: { data: "🫡", type: "emoji" }, max_lines: 1, text: "yêu em là nhiệm vụ cả đời", text_color: "#71455F", type: "static_content" } },
                        { overlay_id: "caption:crush_nhin", source: "remote", caption: { background: { colors: ["#F0C0D5", "#E0C8EF", "#C8D5F3"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "crush nhìn em một cái là xong", text_color: "#594664", type: "static_content" } },
                        { overlay_id: "caption:ngoai_le_cua_em", source: "remote", caption: { background: { colors: ["#E7B8D0", "#E4D0F2", "#C8D8F2"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "anh là ngoại lệ của em", text_color: "#584762", type: "static_content" } },
                        { overlay_id: "caption:dang_ban_tuong_tu", source: "remote", caption: { background: { colors: ["#1A2980", "#26D0CE"] }, icon: { data: "💭", type: "emoji" }, max_lines: 1, text: "Đang bận tương tư", text_color: "#FFFFFF", type: "static_content" } },
                        { overlay_id: "caption:mac_bay_tinh_yeu", source: "remote", caption: { background: { colors: ["#EE9CA7", "#FFDDE1"] }, icon: { data: "💘", type: "emoji" }, max_lines: 1, text: "Mắc bẫy tình yêu", text_color: "#000000E6", type: "static_content" } },
                        { overlay_id: "caption:minh_cuoi_nhau", source: "remote", caption: { background: { colors: ["#F0B8CD", "#F7D4DF", "#E7C9EF"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "hông ấy mình cưới nhau đi", text_color: "#70465B", type: "static_content" } },
                        { overlay_id: "caption:wedding_time", source: "remote", caption: { background: { colors: ["#FFE4E1", "#E73C7E"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "Wedding Time!", localized_text: { en: "Wedding Time!", vn: "Đám cưới nè!" }, text_color: "#FFFFFFE6", type: "static_content" } },
                        { overlay_id: "caption:dating_time", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Dating Time!", text_color: "#FFFFFFE6", type: "static_content" } },
                        { overlay_id: "caption:cam_thay_hanh_phuc", source: "remote", caption: { background: { colors: ["#EC407A", "#F8BBD0"] }, icon: { data: "🇻🇳", type: "emoji" }, max_lines: 1, text: "Cảm thấy hạnh phúc", localized_text: { en: "Feeling Happy", vn: "Cảm thấy hạnh phúc" }, text_color: "#FFFFFFE6
