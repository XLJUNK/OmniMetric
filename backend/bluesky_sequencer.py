from datetime import datetime, timedelta, timezone

class BlueskySequencer:
    """
    Simplified scheduler for priority languages only.
    Focuses on DE, FR, EN at fixed times.
    """
    
    # Simplified Schedule (JST = UTC+9)
    # Format: "LANG": [(Hour_JST, Minute_JST)]
    SCHEDULE = {
        "JA": [(8, 0)],    # 08:00 JST = 23:00 UTC (prev day) (Japan market)
        "ZH": [(9, 0)],    # 09:00 JST = 00:00 UTC (China/Asia markets)
        "DE": [(16, 0)],   # 16:00 JST = 07:00 UTC (European market open)
        "FR": [(16, 0)],   # 16:00 JST = 07:00 UTC (European market open)
        "ES": [(16, 0)],   # 16:00 JST = 07:00 UTC (Spain market open - 1hr)
        "EN": [(17, 0), (22, 0)]  # 17:00 JST = 08:00 UTC (UK), 22:00 JST = 13:00 UTC (US)
    }

    def get_jst_now(self):
        """Returns current JST time."""
        return datetime.now(timezone.utc) + timedelta(hours=9)

    def check_schedule(self):
        """
        Checks if the current time matches any schedule slots.
        Returns a list of tuples: (LANG, PHASE_ID, FORCE_FLAG)
        """
        now_jst = self.get_jst_now()
        current_hour = now_jst.hour
        current_minute = now_jst.minute
        
        matches = []
        
        # Helper to check time match (within 10 minute window)
        def is_time_match(h, m):
            if h != current_hour:
                return False
            # Allow 0-9 minute delay
            if m <= current_minute < m + 10:
                return True
            return False

        for lang, slots in self.SCHEDULE.items():
            for i, (h, m) in enumerate(slots):
                if is_time_match(h, m):
                    matches.append((lang, i+1, False))
        
        return matches

    def find_recent_slot(self, lookback_minutes=60):
        """
        Stateful Catch-up Logic:
        Checks if there was a schedule slot within the last X minutes.
        Returns a list of unique (LANG, PHASE, FORCE) tuples for the *latest* slot found.
        """
        now_jst = self.get_jst_now()
        start_jst = now_jst - timedelta(minutes=lookback_minutes)
        
        found_matches = []
        
        # Iterate all defined slots
        for lang, slots in self.SCHEDULE.items():
            for i, (h, m) in enumerate(slots):
                # Create datetime for this slot (check today, yesterday, tomorrow)
                candidates = [
                    now_jst.replace(hour=h, minute=m, second=0, microsecond=0),
                    now_jst.replace(hour=h, minute=m, second=0, microsecond=0) - timedelta(days=1),
                    now_jst.replace(hour=h, minute=m, second=0, microsecond=0) + timedelta(days=1)
                ]
                
                for slot_dt in candidates:
                    # Check if slot is within the window [Start < Slot <= Now]
                    if start_jst < slot_dt <= now_jst:
                        found_matches.append((lang, i+1, False))
                            
        # Deduplication
        return list(set(found_matches))
