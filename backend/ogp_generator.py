import matplotlib.pyplot as plt
import matplotlib.patches as patches
import io
import os
from datetime import datetime
import matplotlib.font_manager as fm

# Font Mapping Configuration
FONT_DIR = os.path.join(os.path.dirname(__file__), "assets", "fonts")
FONT_MAP = {
    "JP": "NotoSansJP-Bold.ttf",
    "CN": "NotoSansSC-Bold.ttf",
    "ZH": "NotoSansSC-Bold.ttf",
    "HI": "NotoSansDevanagari-Bold.ttf",
    "AR": "NotoSansArabic-Bold.ttf"
}

def get_font_prop(lang="EN"):
    """Returns the appropriate FontProperties object for the given language."""
    font_filename = FONT_MAP.get(lang.upper(), "NotoSansJP-Bold.ttf") # Fallback to JP (covers Latin + Kana)
    font_path = os.path.join(FONT_DIR, font_filename)
    
    try:
        if os.path.exists(font_path):
            prop = fm.FontProperties(fname=font_path)
            # Simple check
            _ = prop.get_name()
            return prop
    except Exception as e:
        print(f"[OGP] Font load error for {lang} ({font_filename}): {e}")
    
    # Ultimate fallback
    return fm.FontProperties(family='sans-serif', weight='bold')

def generate_dynamic_ogp(data, output_path, lang="EN"):
    """
    Generates a high-contrast 1200x630 OGP image.
    Visualizes: GMS Score (Gauge), Trend Vector, Date, Regime.
    """
    score = data.get("gms_score", 50)
    font_prop = get_font_prop(lang)
    
    # 1. Setup Canvas (Dark Theme)
    fig, ax = plt.subplots(figsize=(1200/100, 630/100), dpi=100)
    fig.patch.set_facecolor('#0f172a') # Slate-900
    ax.set_facecolor('#0f172a')
    ax.set_xlim(0, 1200)
    ax.set_ylim(0, 630)
    ax.axis('off')

    # 2. Draw Header
    ax.text(60, 560, "GLOBAL MACRO SIGNAL", color='#94a3b8', fontsize=24, fontproperties=font_prop, ha='left')
    
    today = datetime.now().strftime("%Y-%m-%d")
    ax.text(1140, 560, today, color='#94a3b8', fontsize=24, fontproperties=font_prop, ha='right')

    # 3. Main Score Circle
    # Color based on score
    score_color = '#eab308' # Yellow
    regime_text = "NEUTRAL"
    if score > 60:
        score_color = '#22c55e' # Green
        regime_text = "RISK-ON"
    elif score < 40:
        score_color = '#ef4444' # Red
        regime_text = "RISK-OFF"

    # Draw Circle
    circle = patches.Circle((600, 315), 180, linewidth=10, edgecolor=score_color, facecolor='#1e293b')
    ax.add_patch(circle)
    
    # Draw Score Text
    ax.text(600, 315, str(score), color='white', fontsize=120, fontweight='bold', ha='center', va='center', fontproperties=font_prop)
    ax.text(600, 180, regime_text, color=score_color, fontsize=30, fontweight='bold', ha='center', va='center', fontproperties=font_prop)

    # 4. Sector Grid (Bottom)
    sectors = data.get("sector_scores", {})
    sec_names = ["STOCKS", "CRYPTO", "FOREX", "CMDTY"]
    sec_keys = ["STOCKS", "CRYPTO", "FOREX", "COMMODITIES"]
    
    start_x = 200
    gap = 266 # (1200-400)/3 approx
    
    y_pos = 80
    
    for i, key in enumerate(sec_keys):
        sec_score = sectors.get(key, 0)
        sec_color = '#eab308'
        if sec_score > 60: sec_color = '#22c55e'
        elif sec_score < 40: sec_color = '#ef4444'
        
        # Position distributed centered
        x = 200 + (i * 266)
        if len(sec_keys) == 4:
            x = 150 + (i * 300)

        ax.text(x, y_pos, sec_names[i], color='#94a3b8', fontsize=16, ha='center', fontproperties=font_prop)
        ax.text(x, y_pos - 40, str(sec_score), color=sec_color, fontsize=28, fontweight='bold', ha='center', fontproperties=font_prop)

    # 5. Save
    try:
        plt.tight_layout()
        plt.savefig(output_path, format='png', facecolor=fig.get_facecolor())
        plt.close(fig)
        return True
    except Exception as e:
        print(f"[OGP] Generation Failed: {e}")
        return False
