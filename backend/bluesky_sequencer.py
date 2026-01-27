from datetime import datetime, timedelta, timezone

class BlueskySequencer:
    """
    Manages the 'Golden Schedule' for BlueSky posts.
    Handles 7-Language Dispersion and 2-Phase Logic based on JST.
    """
    
    # Golden Schedule (JST)
    # Format: "LANG": {"PH1": (Hour, Minute), "PH2": (Hour, Minute), "PH3": (Hour, Minute)}
    # Times are JST (UTC+9)
    SCHEDULE_WEEKDAY = {
        "JP": [(7, 5), (10, 35), (14, 35)],  # Pre-open, Lunch, Close-1h (Adjusted to Cron 05/35)
        # 14:00 is not x:05/35. Closest is 14:05 (Close-55m) or 13:35. User said "Close-1h".
        # Close is 15:00. 14:00 is target. Cron runs 13:35, 14:05.
        # Let's use 14:05 as "Close-1h approx".
        
        "EN": [(21, 35), (0, 5), (5, 5)], # US Pre-open, Mid-day, Close
        "ZH": [(10, 35), (14, 5)],        # HK/CN Lunch, Close
        "ID": [(10, 35), (16, 5)],        # Jakarta
        "HI": [(12, 35), (16, 35)],       # Mumbai
        "AR": [(16, 5), (19, 35)],        # Riyadh/Dubai
        "ES": [(17, 5), (23, 35)]         # Madrid/Latam
    }

    SCHEDULE_WEEKEND = {
        "JP": [(9, 35)],      # Sat AM Recap
        "EN": [(21, 5)],      # Sun Evening (US time) / Mon Morning JST
        "ALL": [(20, 35)]     # Sun Night Global
    }

    def get_jst_now(self):
        """Returns current JST time."""
        return datetime.now(timezone.utc) + timedelta(hours=9)

    def is_weekend(self, jst_dt):
        """Returns True if Saturday or Sunday (JST)."""
        return jst_dt.weekday() >= 5

    def check_schedule(self):
        """
        Checks if the current time matches any Golden Schedule slots.
        Returns a list of tuples: (LANG, PHASE_ID, FORCE_FLAG)
        """
        now_jst = self.get_jst_now()
        
        # Virtual Day Logic: Treat 00:00-05:59 as "Previous Day" (for US Market continuity)
        # Mon 00:05 is Sunday Night -> Weekend (Skip)
        # Sat 00:05 is Friday Night -> Weekday (Post)
        effective_dt = now_jst
        if now_jst.hour < 6:
            effective_dt = now_jst - timedelta(days=1)

        is_we = self.is_weekend(effective_dt)
        
        current_hour = now_jst.hour
        current_minute = now_jst.minute
        
        matches = []
        
        # Tolerance window (since cron might be slightly delayed)
        # Target: 05 and 35
        # We check if we are within [Target, Target+10m]
        
        schedule = self.SCHEDULE_WEEKEND if is_we else self.SCHEDULE_WEEKDAY
        
        # Helper to check time match
        def is_time_match(h, m):
            # Strict hour match
            if h != current_hour:
                return False
            # Loose minute match (0-9 min delay allowed)
            if m <= current_minute < m + 10:
                return True
            return False

        if is_we:
             # Weekday Logic
             for lang, slots in self.SCHEDULE_WEEKEND.items(): # Use self.

                 for i, (h, m) in enumerate(slots):
                     if is_time_match(h, m):
                         if lang == "ALL":
                             # Add all major langs
                             for l in ["JP", "EN", "ZH", "ES"]:
                                 matches.append((l, 99, True))
                         else:
                             matches.append((lang, i+1, True))
        else:
            # Weekday Logic
            for lang, slots in self.SCHEDULE_WEEKDAY.items(): # Use self.
                for i, (h, m) in enumerate(slots):
                    if is_time_match(h, m):
                        matches.append((lang, i+1, False))
        
        return matches
