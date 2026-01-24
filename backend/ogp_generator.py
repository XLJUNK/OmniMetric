import matplotlib.pyplot as plt
import matplotlib.patches as patches
import io
import os
from datetime import datetime
import matplotlib.font_manager as fm

# Global font configuration
# Try to load NotoSansJP if available (deployed via GitHub Actions)
FONT_PATH = os.path.join(os.path.dirname(__file__), "assets", "fonts", "NotoSansJP-Bold.ttf")
PROP_FONT = None
if os.path.exists(FONT_PATH):
    PROP_FONT = fm.FontProperties(fname=FONT_PATH)
else:
    # Fallback to default sans-serif
    PROP_FONT = fm.FontProperties(family='sans-serif', weight='bold')

def generate_dynamic_ogp(data, output_path):
    """
    Generates a high-contrast 1200x630 OGP image.
    Visualizes: GMS Score (Gauge), Trend Vector, Date, Regime.
    """
    score = data.get("gms_score", 50)
    
    # 1. Setup Canvas (Dark Theme)
    fig, ax = plt.subplots(figsize=(1200/100, 630/100), dpi=100)
    fig.patch.set_facecolor('#0f172a') # Slate-900
    ax.set_facecolor('#0f172a')
    ax.set_xlim(0, 1200)
    ax.set_ylim(0, 630)
    ax.axis('off')

    # 2. Draw Header
    ax.text(60, 560, "GLOBAL MACRO SIGNAL", color='#94a3b8', fontsize=24, fontproperties=PROP_FONT, ha='left')
    
    today = datetime.now().strftime("%Y-%m-%d")
    ax.text(1140, 560, today, color='#94a3b8', fontsize=24, fontproperties=PROP_FONT, ha='right')

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
    ax.text(600, 315, str(score), color='white', fontsize=120, fontweight='bold', ha='center', va='center', fontproperties=PROP_FONT)
    ax.text(600, 180, regime_text, color=score_color, fontsize=30, fontweight='bold', ha='center', va='center', fontproperties=PROP_FONT)

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

        ax.text(x, y_pos, sec_names[i], color='#94a3b8', fontsize=16, ha='center', fontproperties=PROP_FONT)
        ax.text(x, y_pos - 40, str(sec_score), color=sec_color, fontsize=28, fontweight='bold', ha='center', fontproperties=PROP_FONT)

    # 5. Save
    try:
        plt.tight_layout()
        plt.savefig(output_path, format='png', facecolor=fig.get_facecolor())
        plt.close(fig)
        return True
    except Exception as e:
        print(f"[OGP] Generation Failed: {e}")
        return False
