import os
import json
from datetime import datetime, timezone
from atproto import Client

class BlueskyPublisher:
    def __init__(self, site_url="https://www.omnimetric.net", log_callback=None):
        self.site_url = site_url
        self.log_callback = log_callback
        self.state_file = os.path.join(os.path.dirname(__file__), "sns_last_post.json")
        self.status_log_file = os.path.join(os.path.dirname(__file__), "sns_status.json")

    def format_post(self, data, lang="EN"):
        """
        Generates institutional-grade posts with marketing copy.
        Includes GMS score, key indicators (DXY, HY spread, 10Y-3M), AI insight.
        Strict 300 character limit.
        """
        score = data.get("gms_score", 50)
        
        # Extract key institutional indicators
        market_data = data.get("market_data", {})
        dxy = market_data.get("DXY", {}).get("price", 0)
        hy_spread = market_data.get("HY_SPREAD", {}).get("price", 0)
        yield_spread = market_data.get("YIELD_SPREAD", {}).get("price", 0)  # 10Y-3M
        
        # Extract AI Insight (shortened to 1 sentence)
        analysis = data.get("analysis", {})
        reports = analysis.get("reports", {})
        ai_insight = reports.get(lang, reports.get("EN", ""))
        
        # Get first sentence only
        delimiters = ["。", "！", "？", ".", "!", "?"]
        first_sentence = ""
        for char in ai_insight:
            first_sentence += char
            if char in delimiters:
                break
        
        # Localized marketing copy and formatting
        if lang == "DE":
            # German version
            header = f"【GMS: {score}/100】"
            promo = f"Kostenlose Institutionsanalyse: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #Börse"
            url = f"{self.site_url}/de"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "Mehr auf der Website"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            
        elif lang == "FR":
            # French version
            header = f"【GMS: {score}/100】"
            promo = f"Analyse institutionnelle gratuite: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #Bourse"
            url = f"{self.site_url}/fr"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "Plus de détails sur le site"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            
        elif lang == "JA":
            # Japanese version
            header = f"【GMS: {score}/100】"
            promo = f"無料の機関投資家向けマクロ分析: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #マクロ経済"
            url = f"{self.site_url}/jp"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "詳しくは本サイトで"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            
        elif lang == "ZH":
            # Chinese version
            header = f"【GMS: {score}/100】"
            promo = f"免费机构级宏观分析: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #宏观经济"
            url = f"{self.site_url}/cn"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "更多详情请访问网站"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            
        elif lang == "ES":
            # Spanish version
            header = f"【GMS: {score}/100】"
            promo = f"Análisis macro institucional gratuito: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #Bolsa"
            url = f"{self.site_url}/es"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "Más detalles en el sitio"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            
        else:  # EN (default for both UK and US)
            header = f"【GMS: {score}/100】"
            promo = f"Free institutional-grade macro: DXY {dxy:.2f}, HY {hy_spread:.2f}%, 10Y-3M {yield_spread:.2f}%"
            tags = "#OmniMetric #Macro"
            url = f"{self.site_url}/en"
            
            # Truncate AI insight to fit
            ai_text = first_sentence
            if len(ai_text) > 50:
                ai_text = ai_text[:47] + "..."
            
            cta = "Full analysis on site"
            post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
        
        # Final safety check for 300 character limit
        if len(post) > 300:
            # Calculate how much to trim
            excess = len(post) - 297  # 297 to leave room for "..."
            
            # For all languages, trim the AI insight
            ai_text = first_sentence
            if len(ai_text) > excess + 3:
                ai_text = ai_text[:len(ai_text) - excess - 3] + "..."
            else:
                ai_text = "..."
            
            # Rebuild post with trimmed AI
            if lang == "DE":
                cta = "Mehr auf der Website"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            elif lang == "FR":
                cta = "Plus de détails sur le site"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            elif lang == "JA":
                cta = "詳しくは本サイトで"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            elif lang == "ZH":
                cta = "更多详情请访问网站"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            elif lang == "ES":
                cta = "Más detalles en el sitio"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
            else:  # EN
                cta = "Full analysis on site"
                post = f"{header}\n\nAI: {ai_text}\n\n{promo}\n\n{cta} → {url}\n{tags}"
        
        return post

    def _write_status(self, status, message=None):
        """Writes the latest attempt status to a JSON file."""
        try:
            current_status = {}
            if os.path.exists(self.status_log_file):
                with open(self.status_log_file, 'r') as f:
                    current_status = json.load(f)
            
            # Merge Bluesky status
            current_status["BLUESKY"] = {
                "timestamp": datetime.now(timezone.utc).isoformat(),
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

    def should_skip(self, content, lang):
        """Checks if the exact content has already been posted for this language."""
        import hashlib
        try:
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
                    
                last_hashes = state.get("last_content_hashes", {})
                last_hash = last_hashes.get(lang)
                
                # Compute current hash
                current_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
                
                if last_hash == current_hash:
                    self._log(f"[{lang}] Smart-skip: Content identical to last post. Skipping.")
                    return True
        except Exception as e:
            self._log(f"State check failed: {e}", is_error=True)
        return False

    def update_state(self, content, lang):
        import hashlib
        try:
            state = {}
            if os.path.exists(self.state_file):
                with open(self.state_file, 'r') as f:
                    state = json.load(f)
            
            # Update Hash
            if "last_content_hashes" not in state:
                state["last_content_hashes"] = {}
                
            current_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
            state["last_content_hashes"][lang] = current_hash
            state["last_post_at"] = datetime.now(timezone.utc).isoformat()
            
            with open(self.state_file, 'w') as f:
                json.dump(state, f, indent=4)
        except Exception as e:
            self._log(f"Failed to update state file: {e}", is_error=True)

    def publish(self, data, image_path=None, reply_to=None, force=False, lang="EN", text=None):
        """Main entry point for Bluesky publishing."""
        
        if text is None:
            text = self.format_post(data, lang=lang)
            
        # We assume skip check is done by caller if they passed text, OR we check here if we want double safety.
        # But usually caller (sns_publisher) checks before generating OGP.
        # If called independently:
        if self.should_skip(text, lang) and not force:
             return None

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
            
            # Extract score just for log, though strictly we aren't using it for state anymore
            score = data.get("gms_score", 50)
            self._log(f"Success: Posted GMS Score {score} ({lang}) to Bluesky. Length: {len(text)} chars")
            
            if not reply_to: # Only update state for top-level posts
                self.update_state(text, lang)
                
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
        for lang in ["DE", "FR", "EN"]:
            post = pub.format_post(data, lang=lang)
            print(f"\n{lang} ({len(post)} chars):")
            print(post)
            print("-" * 50)
    else:
        print("current_signal.json not found for testing.")
