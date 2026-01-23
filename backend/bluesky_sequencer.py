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
        Simplified Schedule: ALWAYS returns EN task.
        Timing is controlled by GitHub Actions Cron (xx:05, xx:35).
        """
        # Always execute EN task when invoked
        return [("EN", 1, False)]
