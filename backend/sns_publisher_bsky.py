import os
import json
from datetime import datetime
from atproto import Client

class BlueskyPublisher:
    def __init__(self, site_url="https://omnimetric.net", log_callback=None):
        self.site_url = site_url
        self.log_callback = log_callback
        self.state_file = os.path.join(os.path.dirname(__file__), "sns_last_post.json")
        self.status_log_file = os.path.join(os.path.dirname(__file__), "sns_status.json")

    def get_trend_text(self, data, lang):
        """Returns localized trend direction text (e.g. 'Trend: UP', 'トレンド: 上昇')"""
        # Simplistic extraction from STOCKS or VIX for "Trend" proxy if GMS trend not explicit
        # Using simple Score direction or VIX trend
        
        # Localized Dictionaries
        terms = {
            "JP": {"UP": "上昇", "DOWN": "下落", "NEUTRAL": "中立", "RISK-ON": "リスク選好", "RISK-OFF": "リスク回避"},
            "EN": {"UP": "UP", "DOWN": "DOWN", "NEUTRAL": "NEUTRAL", "RISK-ON": "RISK-ON", "RISK-OFF": "RISK-OFF"},
            "CN": {"UP": "上升", "DOWN": "下跌", "NEUTRAL": "中性", "RISK-ON": "风险偏好", "RISK-OFF": "风险规避"},
            "ES": {"UP": "ALZA", "DOWN": "BAJA", "NEUTRAL": "NEUTRAL", "RISK-ON": "APETITO", "RISK-OFF": "AVERSIÓN"},
            "HI": {"UP": "ऊपर", "DOWN": "नीचे", "NEUTRAL": "तठस्थ", "RISK-ON": "जोखिम-पर", "RISK-OFF": "जोखिम-मना"},
            "ID": {"UP": "NAIK", "DOWN": "TURUN", "NEUTRAL": "NETRAL", "RISK-ON": "RISK-ON", "RISK-OFF": "RISK-OFF"},
            "AR": {"UP": "صعود", "DOWN": "هبوط", "NEUTRAL": "محايد", "RISK-ON": "مخاطرة", "RISK-OFF": "تجنب"},
        }
        
        score = data.get("gms_score", 50)
        regime = "NEUTRAL"
        if score > 60: regime = "RISK-ON"
        elif score < 40: regime = "RISK-OFF"
        
        t = terms.get(lang, terms["EN"])
        return t.get(regime, regime)

    def format_post(self, data, lang="EN"):
        """
        Generates professional posts respecting the user requirement:
        【GMS Score: XX/100】 [Trend] + [AI Insight (2 sentences)] + Tags
        """
        score = data.get("gms_score", 50)
        trend_text = self.get_trend_text(data, lang)
        
        # Extract AI Insight
        analysis = data.get("analysis", {})
        reports = analysis.get("reports", {})
        ai_insight = reports.get(lang, reports.get("EN", ""))
        
        # Truncate to ~2 sentences / 100-120 chars max for readability
        # Simple split by punctuation
        delimiters = ["。", "！", "？", ".", "!", "?"]
        sentences = []
        current = ""
        for char in ai_insight:
            current += char
            if char in delimiters:
                sentences.append(current)
                current = ""
        if current: sentences.append(current)
        
        # Take first 2 sentences
        short_summary = "".join(sentences[:2])
        if len(short_summary) > 130: # Hard cap
             short_summary = short_summary[:127] + "..."
             
        # Build Tags
        tags = "#OmniMetric"
        if lang == "JP": tags += " #株 #為替 #投資"
        elif lang == "EN": tags += " #Macro #Finance #Investing"
        elif lang == "CN": tags += " #美股 #宏观 #投资"
        elif lang == "ES": tags += " #Bolsa #Finanzas #Macro"
        elif lang == "ID": tags += " #Saham #Forex #Investasi"
        elif lang == "HI": tags += " #बाजार #निवेश #वित्त"
        elif lang == "AR": tags += " #استثمار #اقتصاد"

        # Construct Post
        # Format: 【GMS Score: XX/100】 [Trend] + [AI Insight] + Tags
        header = f"【GMS Score: {score}/100】"
        trend_section = f"[{trend_text}]"
        
        post_text = f"{header} {trend_section}\n\n{short_summary}\n\n{tags}"
        
        # Add Link
        # URL Logic: https://www.omnimetric.net/?lang=XX
        base_url = self.site_url.replace("https://omnimetric.net", "https://www.omnimetric.net")
        if not "www" in base_url: base_url = base_url.replace("https://", "https://www.")
        
        url_lang = lang.upper()
        # Exception: "CN" usually maps to "ZH" or "CN" in query logic? Assuming "CN" based on user context, but let's check.
        # Check backend/current_signal.json usage? "CN" is key.
        
        post_text += f"\n{base_url}/?lang={url_lang}"

        return post_text

    def _write_status(self, status, message=None):
        """Writes the latest attempt status to a JSON file."""
        try:
            current_status = {}
            if os.path.exists(self.status_log_file):
                with open(self.status_log_file, 'r') as f:
                    current_status = json.load(f)
            
            # Merge Bluesky status
            current_status["BLUESKY"] = {
                "timestamp": datetime.utcnow().isoformat(),
                "status": status,
                "message": message or "OK"
            }
            
            with open(self.status_log_file, 'w') as f:
                json.dump(current_status, f, indent=4)
        except Exception as e:
            print(f"[SNS_BSKY] Failed to write status log: {e}")

    def _log(self, message, is_error=False):
        prefix = "[SNS_BSKY]"
        print(f"{prefix} {message}")
        if self.log_callback:
            self.log_callback(f"{prefix} {message}")
        
        if is_error:
            self._write_status("FAILURE", message)
        elif "Success:" in message:
            self._write_status("SUCCESS", message)

    def get_regime_name(self, score):
        if score > 60: return "ACCUMULATE (Risk-On)"
        if score < 40: return "DEFENSIVE (Risk-Off)"
        return "NEUTRAL (Wait & See)"

    def should_skip(self, current_score):
        """Smart-skip logic to prevent redundant posts."""
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                    last_score = state.get("last_bsky_score")
                    if last_score == current_score:
                        self._log(f"Smart-skip: Current score ({current_score}) matches last posted score. Skipping.")
                        return True
        except Exception as e:
            self._log(f"State check failed: {e}", is_error=True)
        return False

    def update_state(self, score):
        try:
            with open(self.state_file, 'w') as f:
                json.dump({"last_bsky_score": score, "last_post_at": datetime.utcnow().isoformat()}, f)
        except Exception as e:
            self._log(f"Failed to update state file: {e}", is_error=True)

    def publish(self, data, image_path=None, reply_to=None, force=False, lang="EN"):
        """Main entry point for Bluesky publishing."""
        score = data.get("gms_score", 50)
        
        if self.should_skip(score) and not force:
            return None # Not an error, just a skip

        text = self.format_post(data, lang=lang)
        
        bsky_user = os.getenv("BLUESKY_HANDLE")
        bsky_pass = os.getenv("BLUESKY_PASSWORD")
        
        if not all([bsky_user, bsky_pass]):
            self._log("Missing Bluesky credentials (BLUESKY_HANDLE / BLUESKY_PASSWORD).", is_error=True)
            return None
            
        try:
            client = Client()
            client.login(bsky_user, bsky_pass)
            
            embed = None
            if image_path and os.path.exists(image_path):
                with open(image_path, 'rb') as f:
                    img_data = f.read()
                upload = client.upload_blob(img_data)
                from atproto import models
                embed = models.AppBskyEmbedImages.Main(
                    images=[models.AppBskyEmbedImages.Image(alt=f"Global Macro Signal {lang}", image=upload.blob)]
                )
                self._log(f"Image uploaded successfully: {image_path}")

            # Send post with optional threading
            post = client.send_post(text=text, reply_to=reply_to, embed=embed)
            
            self._log(f"Success: Posted GMS Score {score} ({lang}) to Bluesky.")
            if not reply_to: # Only update state for top-level posts
                self.update_state(score)
                
            return post # Returns models.AppBskyFeedPost.CreateRecordResponse
        except Exception as e:
            self._log(f"Error: {e}", is_error=True)
            return None

if __name__ == "__main__":
    # Test script for local verification
    DATA_FILE = os.path.join(os.path.dirname(__file__), "current_signal.json")
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        pub = BlueskyPublisher()
        print("\n--- BLUESKY POST PREVIEW ---")
        print(pub.format_post(data, lang="EN"))
    else:
        print("current_signal.json not found for testing.")
