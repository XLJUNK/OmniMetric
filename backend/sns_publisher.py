import os
import json
import tweepy
from datetime import datetime, timezone
import pytz
from atproto import Client
from bluesky_sequencer import BlueskySequencer
from dotenv import load_dotenv

# Load local environment variables for terminal execution
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
if os.path.exists(env_path):
    load_dotenv(env_path)

class SNSPublisher:
    def __init__(self, site_url="https://omnimetric.net", log_callback=None):
        self.site_url = site_url
        self.log_callback = log_callback
        self.sequencer = BlueskySequencer()
        
        # State tracking
        self.state_file = os.path.join(os.path.dirname(__file__), "sns_last_post.json")
        self.status_log_file = os.path.join(os.path.dirname(__file__), "sns_status.json")

    def get_regime_name(self, score):
        if score > 60: return "ACCUMULATE (リスク選好)"
        if score < 40: return "DEFENSIVE (リスク回避)"
        return "NEUTRAL (中立局面)"

    def get_regime_name_en(self, score):
        if score > 60: return "ACCUMULATE (Risk-On)"
        if score < 40: return "DEFENSIVE (Risk-Off)"
        return "NEUTRAL (Wait & See)"

    def get_regime_name_es(self, score):
        if score > 60: return "ACUMULAR (Apetito de Riesgo)"
        if score < 40: return "DEFENSIVA (Aversión al Riesgo)"
        return "NEUTRAL (Paridad de Riesgo)"

    def get_regime_name_de(self, score):
        if score > 60: return "AKKUMULIEREN (Risikoappetit)"
        if score < 40: return "DEFENSIV (Risikoavers)"
        return "NEUTRAL (Marktbeobachtung)"

    def get_regime_name_fr(self, score):
        if score > 60: return "ACCUMULER (Appétence au risque)"
        if score < 40: return "DÉFENSIF (Aversion au risque)"
        return "NEUTRE (Attente)"
        
    # OGP Image Generation Removed - Using Static Link Previews (Logic moved to ogp_generator.py)


    def _write_status(self, platform, status, message=None):
        """Writes the latest attempt status to a JSON file for Git tracking."""
        try:
            current_status = {}
            if os.path.exists(self.status_log_file):
                with open(self.status_log_file, 'r') as f:
                    current_status = json.load(f)
            
            current_status[platform] = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "status": status,
                "message": message or "OK"
            }
            
            with open(self.status_log_file, 'w') as f:
                json.dump(current_status, f, indent=4)
        except Exception as e:
            print(f"Failed to write status log: {e}")

    def _log(self, message, is_error=False, platform="SYSTEM"):
        # Console Output for CI
        prefix = f"[SNS][{platform}]" if platform != "SYSTEM" else "[SNS]"
        print(f"{prefix} {message}")
        
        # File Callback (if used)
        if self.log_callback:
            self.log_callback(f"{prefix} {message}")

        # Update Status File if it's a significant event (Error or Success)
        if is_error:
            self._write_status(platform, "FAILURE", message)
        elif "Success:" in message:
            self._write_status(platform, "SUCCESS", message)

    def format_post(self, data):
        """
        Generates high-density macro analysis posts.
        """
        score = data.get("gms_score", 50)
        sectors = data.get("sector_scores", {})
        
        stocks = sectors.get("STOCKS", "N/A")
        crypto = sectors.get("CRYPTO", "N/A")
        forex = sectors.get("FOREX", "N/A")
        commod = sectors.get("COMMODITIES", "N/A")
        
        analysis = data.get("analysis", {})
        reports = analysis.get("reports", {})
        ai_summary = reports.get("EN", "")
        
        # Truncate for X (Leave room for header, numbers, and tags)
        if len(ai_summary) > 140:
            ai_summary = ai_summary[:137] + "..."
            
        icon = "🟢" if score > 60 else ("🔴" if score < 40 else "🟡")
        
        # Build Template (Professional Terminal Style)
        header_en = f"【GMS Alert】Current Risk Index: {score}/100 {icon}"
        header_jp = f"【GMS Alert】現在のリスク指数は {score}/100 {icon}。"
        
        sector_line_en = f"Sectors: Stocks {stocks} | Crypto {crypto} | Forex {forex} | Commodities {commod}"
        sector_line_jp = f"各セクター：株 {stocks} / 仮想通貨 {crypto} / 為替 {forex} / 商品 {commod}"
        
        # Conditional Hashtags
        tags = "#OmniMetric #Macro #Investment"
        if score < 40:
            tags += " #RiskOff #MarketCrash"
        elif score > 60:
            tags += " #RiskOn #BullMarket"

        tracked_url = f"{self.site_url}?utm_source=twitter&utm_medium=social"
        
        post_en = f"{header_en}\n" \
                  f"{sector_line_en}\n\n" \
                  f"AI Analysis: {ai_summary}\n\n" \
                  f"{tracked_url}\n{tags}"
                  
        ai_summary_jp = reports.get("JP", "")
        if len(ai_summary_jp) > 100:
             ai_summary_jp = ai_summary_jp[:97] + "..."

        post_jp = f"{header_jp}\n" \
                  f"{sector_line_jp}\n\n" \
                  f"AI分析：{ai_summary_jp}\n\n" \
                  f"{tracked_url}\n{tags}"

        return {"EN": post_en, "JP": post_jp}

    def should_skip(self, current_score, force=False):
        """Smart-skip logic to prevent redundant posts across all platforms."""
        if force:
             self._log(f"Smart-skip: BYPASSED (Forced Post). Score: {current_score}", platform="TWITTER")
             return False
             
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                    last_score = state.get("last_twitter_score")
                    if last_score == current_score:
                        self._log(f"Smart-skip: Current score ({current_score}) matches last posted Twitter score. Skipping.", platform="TWITTER")
                        self._write_status("TWITTER", "SKIPPED", f"Score {current_score} unchanged")
                        return True
        except Exception as e:
            self._log(f"State check failed: {e}", is_error=True, platform="TWITTER")
        return False

    def update_state(self, score):
        """Updates the shared state file for SNS tracking."""
        state = {}
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
            
            state["last_twitter_score"] = score
            state["last_post_at"] = datetime.now(timezone.utc).isoformat()
            
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=4)
        except Exception as e:
            self._log(f"Failed to update state file: {e}")

    def publish_update(self, data, force_override=False):
        """
        Main entry point for publishing.
        Handles Weekend Dispersion, Multilingual OGP, and Stateful Catch-up.
        """
        posts = self.format_post(data)
        score = data.get("gms_score", 50)
        sectors = data.get("sector_scores", {})
        results = {}
        
        # SEQUENCER LOGIC (Golden Schedule + Stateful Catch-up)
        matches = []
        if force_override:
            # Force only priority languages
            matches = [("DE", 1, True), ("FR", 2, True), ("EN", 3, True)]
        else:
            # STRICT MODE: Use Time Window Catch-up
            # Look back 55 minutes (Cron runs every 60m or 30m, 55m window covers enough overlap without double posting)
            matches = self.sequencer.find_recent_slot(lookback_minutes=55)
        
        if not matches:
             self._log("Sequencer: No schedule slot found in the last 55 minutes. Standby.")
             return {"STATUS": "STANDBY"}

        # STATEFUL FILTER: Remove already posted tasks
        # We need to check if we posted this Language recently (e.g., in the last 50 mins)
        # This prevents double posting if the Cron runs twice in the same window (e.g. at :35 and then manually)
        
        valid_matches = []
        last_posts = {}
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    last_posts = json.load(f).get("history", {})
        except: pass

        now_utc = datetime.now(timezone.utc)
        
        for (lang, phase, force) in matches:
            last_ts_str = last_posts.get(lang)
            should_run = True
            
            if last_ts_str:
                last_ts = datetime.fromisoformat(last_ts_str)
                # If posted within the last 50 minutes, skip it.
                if (now_utc - last_ts).total_seconds() < 3000: # 50 mins
                    should_run = False
                    self._log(f"Skipping {lang}: Already posted at {last_ts_str}")

            if should_run:
                valid_matches.append((lang, phase, force))

        if not valid_matches:
             self._log("All slots already processed. Standby.")
             return {"STATUS": "ALL_PROCESSED"}

        results["MATCHES"] = len(valid_matches)
        
        # 1. Post to Twitter (X) - INTEGRATED IN LOOP BELOW
        results["TW_SUCCESS_COUNT"] = 0
        
        # 2. Post to Bluesky
        try:
            from sns_publisher_bsky import BlueskyPublisher
            self._log(f"Processing Serial SNS Broadcast: Stage 2 (Bluesky) - {len(valid_matches)} Tasks")
            bsky_pub = BlueskyPublisher(log_callback=self.log_callback)
            
            # Sort: JP/JA first
            sorted_matches = sorted(valid_matches, key=lambda x: (0 if x[0] in ['JP', 'JA'] else (1 if x[0] == 'EN' else 2)))
            
            parent_post = None
            
            # Load OGP Generator
            from ogp_generator import generate_dynamic_ogp

            # Load clean history to update
            current_history = last_posts.copy()

            for (lang, phase, force_post) in sorted_matches:
                self._log(f"Executing Task: {lang} (Phase {phase}, Force: {force_post})")
                
                # 0. Generate Text (for Hash Check)
                text = bsky_pub.format_post(data, lang=lang)

                # Check Skip Logic (Content Hash check)
                if bsky_pub.should_skip(text, lang) and not force_post and not parent_post:
                     self._log(f"[{lang}] BlueSky Smart-Skip triggered (Content Unchanged).")
                     results[f"BSKY_{lang}"] = "SKIPPED"
                else:
                     # 1. Generate OGP Image (Disposable)
                     timestamp = datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S")
                     img_filename = f"gms_ogp_{lang}_{timestamp}.png"
                     img_path = os.path.join(os.path.dirname(__file__), img_filename)
                     
                     try:
                         generate_dynamic_ogp(data, img_path, lang=lang)
                     except Exception as e:
                         self._log(f"OGP Gen Error: {e}", is_error=True)
                         img_path = None # Fallback to no image

                     # 2. Publish to BlueSky
                     reply_to = None
                     if parent_post:
                         from atproto import models
                         reply_to = models.AppBskyFeedPost.ReplyRef(
                             parent=models.ComAtprotoRepoStrongRef.Main(cid=parent_post.cid, uri=parent_post.uri),
                             root=models.ComAtprotoRepoStrongRef.Main(cid=parent_post.cid, uri=parent_post.uri)
                         )

                     res_post = bsky_pub.publish(data, image_path=img_path, reply_to=reply_to, force=force_post, lang=lang, text=text) 
                     
                     if res_post:
                         results[f"BSKY_{lang}"] = "SUCCESS"
                         parent_post = res_post
                         # Update History Memory (Key: Lang)
                         current_history[lang] = datetime.now(timezone.utc).isoformat()
                     else:
                         results[f"BSKY_{lang}"] = "FAILED"
                     
                     # 3. Publish to Twitter (X) - Only for supported languages in format_post (EN, JP)
                     if lang in ["EN", "JP", "JA"]:
                         # Normalize JA -> JP for format_post compatibility
                         norm_lang = "JP" if lang == "JA" else lang
                         tw_text = posts.get(norm_lang)
                         if tw_text:
                             self._log(f"[{lang}] Posting to X (Twitter)...")
                             tw_id = self.post_to_twitter(tw_text)
                             if tw_id:
                                 results[f"TW_{lang}"] = "SUCCESS"
                                 results["TW_SUCCESS_COUNT"] += 1
                             else:
                                 results[f"TW_{lang}"] = "FAILED"

                     # 4. Cleanup
                     if img_path and os.path.exists(img_path):
                         try: os.remove(img_path)
                         except: pass
            
            # SAVE HISTORY
            try:
                full_state = {}
                if os.path.exists(self.state_file):
                    with open(self.state_file, 'r') as f:
                        full_state = json.load(f)
                
                full_state["history"] = current_history
                full_state["last_post_at"] = datetime.now(timezone.utc).isoformat()
                
                with open(self.state_file, 'w') as f:
                    json.dump(full_state, f, indent=4)
            except Exception as e:
                self._log(f"Failed to save history: {e}")

        except Exception as e:
            self._log(f"Bluesky Integration Error: {e}", is_error=True, platform="BLUESKY")
            results["BSKY_ERROR"] = str(e)
            
        return results

    def post_to_twitter(self, text):
        api_key = os.getenv("TWITTER_API_KEY")
        api_secret = os.getenv("TWITTER_API_SECRET")
        access_token = os.getenv("TWITTER_ACCESS_TOKEN")
        access_secret = os.getenv("TWITTER_ACCESS_SECRET")
        
        if not all([api_key, api_secret, access_token, access_secret]):
            self._log("Twitter credentials missing. Skipping Stage 1.", is_error=True, platform="TWITTER")
            return False

        try:
            client = tweepy.Client(
                consumer_key=api_key, consumer_secret=api_secret,
                access_token=access_token, access_token_secret=access_secret
            )
            response = client.create_tweet(text=text)
            self._log(f"Success: Posted to Twitter. ID: {response.data['id']}", platform="TWITTER")
            return response.data['id']
        except Exception as e:
            self._log(f"Twitter Error: {e}", is_error=True, platform="TWITTER")
            return False

    def publish_beacon_alert(self, alert_data):
        """
        Publish beacon alerts to BlueSky.
        
        Args:
            alert_data: {"timestamp": "...", "alerts": [...]}
        """
        alerts = alert_data.get("alerts", [])
        if not alerts:
            self._log("No alerts to publish.", platform="BEACON")
            return {"status": "skipped", "reason": "no_alerts"}
        
        # Load alert history to prevent spam
        history_file = os.path.join(os.path.dirname(__file__), "beacon_alert_history.json")
        alert_history = []
        if os.path.exists(history_file):
            try:
                with open(history_file, 'r', encoding='utf-8') as f:
                    alert_history = json.load(f)
            except:
                alert_history = []
        
        # Check rate limits
        now = datetime.now(timezone.utc)
        recent_alerts = [a for a in alert_history if (now - datetime.fromisoformat(a["timestamp"])).total_seconds() < 86400]  # 24 hours
        
        published_count = 0
        for alert in alerts:
            beacon_name = alert["beacon"]
            status = alert["status"]
            
            # Check if this beacon was already alerted in the last 24 hours
            if any(a["beacon"] == beacon_name and a["status"] == status for a in recent_alerts):
                self._log(f"Skipping {beacon_name} alert (already sent in last 24h)", platform="BEACON")
                continue
            
            # Generate multi-language posts
            display_value = alert["display"]
            full_name = alert["name"]
            
            # Emoji mapping
            emoji = "🚨" if status == "danger" else "⚠️"
            
            posts = {
                "EN": f"{emoji} OmniWarning Alert\n\n{full_name}\nStatus: {status.upper()}\nValue: {display_value}\n\nMonitor: omnimetric.net\n\n#OmniMetric #MarketAlert",
                "JP": f"{emoji} 警告シグナル\n\n{full_name}\nステータス: {status}\n値: {display_value}\n\n詳細: omnimetric.net\n\n#OmniMetric #市場警告",
                "DE": f"{emoji} Marktwarnung\n\n{full_name}\nStatus: {status}\nWert: {display_value}\n\nDetails: omnimetric.net\n\n#OmniMetric #Marktwarnung"
            }
            
            # Publish to BlueSky (priority languages only)
            for lang in ["EN", "JP", "DE"]:
                try:
                    success = self.sequencer.publish(posts[lang], lang=lang)
                    if success:
                        self._log(f"Published {beacon_name} {status} alert ({lang})", platform="BEACON")
                        published_count += 1
                except Exception as e:
                    self._log(f"Failed to publish {beacon_name} alert ({lang}): {e}", is_error=True, platform="BEACON")
            
            # Record in history
            alert_history.append({
                "timestamp": now.isoformat(),
                "beacon": beacon_name,
                "status": status,
                "value": alert["value"]
            })
        
        # Save updated history
        try:
            with open(history_file, 'w', encoding='utf-8') as f:
                json.dump(alert_history[-100:], f, indent=4)  # Keep last 100 alerts
        except Exception as e:
            self._log(f"Failed to save alert history: {e}", is_error=True, platform="BEACON")
        
        return {"status": "success", "published": published_count}

# CLI entry point
if __name__ == "__main__":
    import sys
    
    # Define DATA_FILE locally to avoid importing gms_engine (which imports tech_analysis -> pandas-ta)
    DATA_FILE = os.path.join(os.path.dirname(__file__), "current_signal.json")
    ALERT_FILE = os.path.join(os.path.dirname(__file__), "beacon_alerts.json")
    
    def log_diag(msg):
        """Simple logging function"""
        print(f"[SNS] {msg}")
    
    pub = SNSPublisher(log_callback=log_diag)
    print("\n--- SNS PUBLISHER EXECUTION ---")
    
    # Check for beacon alert mode
    if "--beacon-alert" in sys.argv:
        print("[CLI] Beacon Alert Mode")
        if os.path.exists(ALERT_FILE):
            with open(ALERT_FILE, 'r', encoding='utf-8') as f:
                alert_data = json.load(f)
            result = pub.publish_beacon_alert(alert_data)
            print(f"Result: {result}")
        else:
            print("[CLI] No beacon alerts file found.")
    else:
        # Normal GMS update mode
        with open(DATA_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        force_mode = "--force" in sys.argv
        if force_mode:
            print("[CLI] Force Mode Enabled: Bypassing Schedule Check.")
        
        res = pub.publish_update(data, force_override=force_mode)
        print(res)

