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

    def format_post(self, data):
        """
        Generates professional terminal-style posts for Bluesky.
        """
        score = data.get("gms_score", 50)
        regime = self.get_regime_name(score)
        sectors = data.get("sector_scores", {})
        
        stocks = sectors.get("STOCKS", "N/A")
        crypto = sectors.get("CRYPTO", "N/A")
        commodities = sectors.get("COMMODITIES", "N/A")
        
        analysis = data.get("analysis", {})
        reports = analysis.get("reports", {})
        ai_insight = reports.get("EN", "")
        
        # Shorten AI Insight for the "Analysis" section
        if len(ai_insight) > 160:
            ai_insight = ai_insight[:157] + "..."

        # Professional Template (v2.3.0)
        template = (
            f"【GMS Signal Report】\n"
            f"Global Regime: {regime}\n"
            f"(Score: {score}/100)\n\n"
            f"Analysis: {ai_insight}\n\n"
            f"Sector Breakdown:\n"
            f"Stocks: {stocks}\n"
            f"Crypto: {crypto}\n"
            f"Commodities: {commodities}\n\n"
            f"Live Terminal: {self.site_url} #OmniMetric #Macro #BlueskyFinance"
        )
        return template

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

    def publish(self, data):
        """Main entry point for Bluesky publishing."""
        score = data.get("gms_score", 50)
        
        if self.should_skip(score):
            return True # Not an error, just a skip

        text = self.format_post(data)
        
        bsky_user = os.getenv("BLUESKY_HANDLE")
        bsky_pass = os.getenv("BLUESKY_PASSWORD")
        
        if not all([bsky_user, bsky_pass]):
            self._log("Missing Bluesky credentials (BLUESKY_HANDLE / BLUESKY_PASSWORD).", is_error=True)
            return False
            
        try:
            client = Client()
            client.login(bsky_user, bsky_pass)
            # Use send_post for the standard text post
            client.send_post(text=text)
            self._log(f"Success: Posted GMS Score {score} to Bluesky.")
            self.update_state(score)
            return True
        except Exception as e:
            self._log(f"Error: {e}", is_error=True)
            return False

if __name__ == "__main__":
    # Test script for local verification
    DATA_FILE = os.path.join(os.path.dirname(__file__), "current_signal.json")
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        pub = BlueskyPublisher()
        print("\n--- BLUESKY POST PREVIEW ---")
        print(pub.format_post(data))
    else:
        print("current_signal.json not found for testing.")
