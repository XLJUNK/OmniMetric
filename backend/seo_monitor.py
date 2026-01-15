import os
import json
import requests
import datetime

class SEOMonitor:
    def __init__(self, host="omnimetric.net", log_callback=None):
        self.host = host
        self.log_callback = log_callback
        self.indexnow_key = os.getenv("INDEXNOW_KEY")
        self.indexnow_url = "https://api.indexnow.org/indexnow"

    def _log(self, message):
        if self.log_callback:
            self.log_callback(f"[SEO] {message}")
        else:
            print(f"[SEO] {message}")

    def notify_indexnow(self, score, prev_score, summary=""):
        """
        Triggers IndexNow if score hits thresholds (<40, >60) 
        or if delta is significant (>= 5).
        """
        delta = score - prev_score
        
        # Define "Significant Event"
        is_threshold_hit = (score < 40 and prev_score >= 40) or (score > 60 and prev_score <= 60)
        is_rapid_change = abs(delta) >= 5
        
        if not (is_threshold_hit or is_rapid_change):
            self._log(f"Score {score} (Delta: {delta}) is within normal parameters. Skipping IndexNow.")
            return False

        if not self.indexnow_key:
            self._log("IndexNow Triggered, but INDEXNOW_KEY is missing. Skipping notification.")
            return False

        self._log(f"IndexNow triggered: Score {score} (Delta: {delta})")
        
        try:
            headers = {"Content-Type": "application/json; charset=utf-8"}
            url_list = []
            base_paths = ["", "/stocks", "/crypto", "/forex", "/commodities"]
            languages = ["EN", "JP", "CN", "ES", "HI", "ID", "AR"]
            
            for path in base_paths:
                # Add root/canonical
                url_list.append(f"https://{self.host}{path}/")
                # Add language variants
                for lang in languages:
                    url_list.append(f"https://{self.host}{path}/?lang={lang}")

            data = {
                "host": self.host,
                "key": self.indexnow_key,
                "keyLocation": f"https://{self.host}/{self.indexnow_key}.txt",
                "urlList": url_list
            }
            # Note: IndexNow API doesn't use the summary, but it's good to have for future logs/GSC
            response = requests.post(self.indexnow_url, headers=headers, json=data, timeout=10)
            self._log(f"IndexNow Result: {response.status_code}")
            return response.status_code == 200
        except Exception as e:
            self._log(f"IndexNow Error: {e}")
            return False

# Keep legacy functionality for now or as CLI entry point
if __name__ == "__main__":
    monitor = SEOMonitor()
    # Test call
    monitor.notify_indexnow(35, 45, "Test rapid drop")
