from datetime import datetime, timedelta

class BlueskySequencer:
    """
    Manages the 'Golden Schedule' for BlueSky posts.
    Handles 7-Language Dispersion and 2-Phase Logic based on JST.
    """
    
    # Golden Schedule (JST)
    # Format: "LANG": {"PH1": (Hour, Minute), "PH2": (Hour, Minute)}
    SCHEDULE = {
        "JP": {"PH1": (7, 5),  "PH2": (10, 35)},
        "ZH": {"PH1": (8, 35), "PH2": (11, 35)},
        "ID": {"PH1": (9, 35), "PH2": (12, 5)},
        "HI": {"PH1": (12, 5), "PH2": (15, 5)},
        "AR": {"PH1": (15, 35),"PH2": (18, 35)},
        "ES": {"PH1": (16, 35),"PH2": (23, 35)},
        "EN": {"PH1": (21, 35),"PH2": (0, 5)} # 00:05 Next Day
    }

    def get_jst_now(self):
        """Returns current JST time."""
        return datetime.utcnow() + timedelta(hours=9)

    def is_weekend(self, jst_dt):
        """Returns True if Saturday or Sunday (JST)."""
        # 5=Sat, 6=Sun
        return jst_dt.weekday() >= 5

    def check_schedule(self, jst_now=None):
        """
        Checks if the current time matches any scheduled slot.
        Returns:
            match_found (bool): True if matched
            lang (str): Language code (e.g., "JP")
            phase (int): 1 or 2
            force_post (bool): True if Smart Skip should be bypassed
        """
        if jst_now is None:
            jst_now = self.get_jst_now()
            
        j_hour = jst_now.hour
        j_min = jst_now.minute
        is_wknd = self.is_weekend(jst_now)

        # Iterate through all languages and slots
        for lang, phases in self.SCHEDULE.items():
            # Check Phase 1
            p1_h, p1_m = phases["PH1"]
            if j_hour == p1_h:
                # 15 min buffer window (e.g. 05-20 for 05 slot)
                if p1_m <= j_min <= p1_m + 15:
                    # Match Found: Phase 1
                    # Weekday: Smart Skip ON (Force=False)
                    # Weekend: Force Post (Weekly Summary)
                    force = True if is_wknd else False
                    return True, lang, 1, force

            # Check Phase 2
            p2_h, p2_m = phases["PH2"]
            if j_hour == p2_h:
                if p2_m <= j_min <= p2_m + 15:
                    # Match Found: Phase 2
                    # Weekday: Force Post (Deep Analysis)
                    # Weekend: Force Post (Weekly Summary)
                    return True, lang, 2, True

        return False, None, 0, False
