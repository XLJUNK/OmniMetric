import os
import json
import tweepy
from datetime import datetime, timedelta
import pytz
from atproto import Client
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display
from bluesky_sequencer import BlueskySequencer

class SNSPublisher:
    def __init__(self, site_url="https://omnimetric.net", log_callback=None):
        self.site_url = site_url
        self.log_callback = log_callback
        # This file tracks the last successful score to prevent duplicates
        self.state_file = os.path.join(os.path.dirname(__file__), "sns_last_post.json")
        # This file tracks the detailed STATUS of the last attempt (Success/Fail/Error) for debugging
        self.status_log_file = os.path.join(os.path.dirname(__file__), "sns_status.json")
        self.sequencer = BlueskySequencer()
        
        # OGP Font Config (Windows)
        self.font_path_default = "C:\\Windows\\Fonts\\arial.ttf"
        self.font_bold_path_default = "C:\\Windows\\Fonts\\arialbd.ttf"
        
    def get_font_for_lang(self, language):
        """Returns the best available font path for the language on Windows."""
        # Priorities for Standard Windows Fonts
        font_map = {
            "JP": ["meiryo.ttc", "msgothic.ttc", "yugothr.ttc"],
            "CN": ["msyh.ttc", "simhei.ttf"],
            "AR": ["tahoma.ttf", "arial.ttf"], # Tahoma handles Arabic well
            "HI": ["nirmala.ttf", "mangal.ttf"],
            "ID": ["arial.ttf"],
            "ES": ["arial.ttf"],
            "EN": ["arial.ttf"]
        }
        
        candidates = font_map.get(language, ["arial.ttf"])
        windows_font_dir = "C:\\Windows\\Fonts"
        
        for filename in candidates:
            path = os.path.join(windows_font_dir, filename)
            if os.path.exists(path):
                return path
        
        return self.font_path_default
        
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
        
    def generate_ogp_image(self, score, language="EN"):
        """Generates a high-quality OGP image with GMS Score and Market Outlook."""
        try:
            # 1. Canvas Setup (1200x630 - Standard OGP)
            width, height = 1200, 630
            bg_color = (10, 10, 15) # Dark Slate/Black
            img = Image.new('RGB', (width, height), color=bg_color)
            draw = ImageDraw.Draw(img)
            
            # 2. Colors & Fonts
            score_color = (0, 255, 128) if score > 60 else ((255, 50, 50) if score < 40 else (255, 200, 0))
            text_color = (240, 240, 240)
            
            try:
                # Dynamic Font Loading
                font_file = self.get_font_for_lang(language)
                
                # For bold, we try to guess or just use the same font (many TTCs include weights, 
                # but PIL index logic is complex. We will stick to regular/base font for robustness 
                # or try to find a bold variant if standard naming).
                # For simplicity in this "Resilience" phase, we use the same base font for Large Text 
                # but increase size, as fallback.
                
                font_large = ImageFont.truetype(font_file, 180)
                font_medium = ImageFont.truetype(font_file, 60)
                font_small = ImageFont.truetype(font_file, 40)
                
            except Exception as e:
                self._log(f"Font loading failed ({font_file}): {e}. Using PIL default.", is_error=True)
                font_large = ImageFont.load_default()
                font_medium = ImageFont.load_default()
                font_small = ImageFont.load_default()
            
            # 3. Draw Content
            # Title
            draw.text((60, 50), "GLOBAL MACRO SIGNAL", font=font_small, fill=(150, 150, 150))
            
            # Score (Center Left)
            draw.text((60, 120), str(score), font=font_large, fill=score_color)
            
            # Risk Label (Localized)
            risk_labels = {
                "EN": {"HIGH": "RISK ON / ACCUMULATE", "LOW": "RISK OFF / DEFENSIVE", "MID": "RISK PARITY"},
                "JP": {"HIGH": "リスクオン (買い)", "LOW": "リスクオフ (守り)", "MID": "リスク中立"},
                "CN": {"HIGH": "风险偏好 (买入)", "LOW": "风险规避 (防御)", "MID": "风险中性"},
                "ES": {"HIGH": "APETITO DE RIESGO", "LOW": "AVERSIÓN AL RIESGO", "MID": "PARIDAD DE RIESGO"},
                "AR": {"HIGH": "شهية المخاطرة (تراكم)", "LOW": "تجنب المخاطرة (دفاعي)", "MID": "تكافؤ المخاطر"},
                "HI": {"HIGH": "जोखिम पर (खरीदें)", "LOW": "जोखिम से बचाव (रक्षात्मक)", "MID": "जोखिम समानता"},
                "ID": {"HIGH": "RISK ON / AKUMULASI", "LOW": "RISK OFF / DEFENSIF", "MID": "PARITAS RISIKO"}
            }
            
            rl_set = risk_labels.get(language, risk_labels["EN"])
            if score > 60: risk_label = rl_set["HIGH"]
            elif score < 40: risk_label = rl_set["LOW"]
            else: risk_label = rl_set["MID"]
            
            # Language Specific Title
            lang_map = {
                "EN": "Market Intelligence",
                "JP": "市場分析 (Market Analysis)",
                "CN": "市场分析 (Market Analysis)",
                "ES": "Inteligencia de Mercado",
                "AR": "تحليل السوق الاستراتيجي",
                "HI": "बाजार विश्लेषण",
                "ID": "Analisis Pasar Strategis"
            }
            title_text = lang_map.get(language, "Market Intelligence")

            # ARABIC FIX: Reshape and Reorder
            if language == "AR":
                try:
                    import arabic_reshaper
                    from bidi.algorithm import get_display
                    risk_label = get_display(arabic_reshaper.reshape(risk_label))
                    title_text = get_display(arabic_reshaper.reshape(title_text))
                except:
                    pass

            draw.text((60, 320), risk_label, font=font_medium, fill=score_color)
            draw.text((60, 450), title_text, font=font_small, fill=text_color)
            
            # 4. Save
            script_dir = os.path.dirname(os.path.abspath(__file__))
            filename = f"ogp_{language}_{datetime.now().strftime('%H%M')}.png"
            path = os.path.join(script_dir, filename)
            img.save(path)
            return path
            
        except Exception as e:
            self._log(f"OGP Generation Failed: {e}", is_error=True)
            return None

    def _write_status(self, platform, status, message=None):
        """Writes the latest attempt status to a JSON file for Git tracking."""
        try:
            current_status = {}
            if os.path.exists(self.status_log_file):
                with open(self.status_log_file, 'r') as f:
                    current_status = json.load(f)
            
            current_status[platform] = {
                "timestamp": datetime.utcnow().isoformat(),
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
            state["last_post_at"] = datetime.utcnow().isoformat()
            
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=4)
        except Exception as e:
            self._log(f"Failed to update state file: {e}")

    def publish_update(self, data):
        """
        Main entry point for publishing.
        Handles Weekend Dispersion and Multilingual OGP.
        """
        posts = self.format_post(data)
        score = data.get("gms_score", 50)
        sectors = data.get("sector_scores", {})
        results = {}
        
        # SEQUENCER LOGIC (Golden Schedule)
        # SEQUENCER LOGIC (Golden Schedule)
        matches = self.sequencer.check_schedule()
        
        if not matches:
             self._log("Sequencer: No slot match in this hour. Skipping.")
             return {"STATUS": "SKIPPED_NO_SLOT"}

        results["MATCHES"] = len(matches)
        
        # 1. Post to Twitter (X) - PAUSED
        self._log("Stage 1 (Twitter) is currently DISABLED per user request.")
        results["TW_SKIP"] = True
        
        # 2. Post to Bluesky
        try:
            from sns_publisher_bsky import BlueskyPublisher
            self._log(f"Processing Serial SNS Broadcast: Stage 2 (Bluesky) - {len(matches)} Tasks")
            bsky_pub = BlueskyPublisher(log_callback=self.log_callback)
            
            # Implementation of JA -> EN -> ES Threading Sequence
            # We sort matches to ensure JP is first if present
            sorted_matches = sorted(matches, key=lambda x: (0 if x[0] == 'JP' else (1 if x[0] == 'EN' else 2)))
            
            parent_post = None
            
            for (lang, phase, force_post) in sorted_matches:
                self._log(f"Executing Task: {lang} (Phase {phase}, Force: {force_post})")
                
                # OGP Generation
                image_path = self.generate_ogp_image(score, lang)
                
                # Check Skip Logic (Global Score check)
                if bsky_pub.should_skip(score) and not force_post and not parent_post:
                     self._log(f"[{lang}] BlueSky Smart-Skip triggered (Score Unchanged).")
                     results[f"BSKY_{lang}"] = "SKIPPED"
                else:
                     # Prepare Text
                     raw_posts = self.format_post(data)
                     
                     # 3-Line News Stream Dynamic Translation Pattern (Per User Request)
                     # We use specific templates for different languages in the thread
                     if lang == "JP":
                         text_body = f"最新のGMSスコアは{score}（{self.get_regime_name(score)}）です。\n\n"
                         text_body += f"株: {sectors.get('STOCKS', 'N/A')} | 仮想通貨: {sectors.get('CRYPTO', 'N/A')} | 商品: {sectors.get('COMMODITIES', 'N/A')}\n"
                         text_body += f"詳細: {self.site_url}/jp #OmniMetric"
                     elif lang == "EN":
                         text_body = f"Latest GMS Score: {score} ({self.get_regime_name_en(score)})\n\n"
                         text_body += f"Stocks: {sectors.get('STOCKS', 'N/A')} | Crypto: {sectors.get('CRYPTO', 'N/A')} | Cmdty: {sectors.get('COMMODITIES', 'N/A')}\n"
                         text_body += f"Live: {self.site_url}/en #Macro"
                     elif lang == "ES":
                         text_body = f"Puntaje GMS: {score} ({self.get_regime_name_es(score)})\n\n"
                         text_body += f"Acciones: {sectors.get('STOCKS', 'N/A')} | Cripto: {sectors.get('CRYPTO', 'N/A')} | Cmdty: {sectors.get('COMMODITIES', 'N/A')}\n"
                         text_body += f"Terminal: {self.site_url}/es #Inversion"
                     else:
                         # Fallback for other languages if schedule matches
                         text_body = raw_posts.get(lang, raw_posts.get("EN"))

                     # Resolve Threading (Reply Logic)
                     reply_to = None
                     if parent_post:
                         from atproto import models
                         reply_to = models.AppBskyFeedPost.ReplyRef(
                             parent=models.ComAtprotoRepoStrongRef.Main(cid=parent_post.cid, uri=parent_post.uri),
                             root=models.ComAtprotoRepoStrongRef.Main(cid=parent_post.cid, uri=parent_post.uri)
                         )

                     res_post = bsky_pub.publish(data, image_path=image_path, reply_to=reply_to, force=force_post) 
                     
                     if res_post:
                         results[f"BSKY_{lang}"] = "SUCCESS"
                         # Update parent for next reply in thread
                         parent_post = res_post 
                     else:
                         results[f"BSKY_{lang}"] = "FAILED"
                     
                # Cleanup Image per task
                if image_path and os.path.exists(image_path): os.remove(image_path)
                     
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

# CLI entry point
if __name__ == "__main__":
    from gms_engine import DATA_FILE, log_diag
    with open(DATA_FILE, 'r', encoding='utf-8') as f:
        data = json.load(f)
    pub = SNSPublisher(log_callback=log_diag)
    print("\n--- SEQUENCER EXECUTION TEST ---")
    
    # We will trigger publish_update directly.
    # It will check the sequencer for CURRENT TIME.
    # Likely "SKIPPED_NO_SLOT" unless we are lucky.
    
    res = pub.publish_update(data)
    print(res)
