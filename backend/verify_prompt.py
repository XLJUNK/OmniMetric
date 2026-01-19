import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from gms_engine import generate_multilingual_report

def verify_protocol_v5_3():
    print("--- [AI PROTOCOL v5.3 AUDIT] ---")
    
    # Mock data for testing
    mock_data = {
        "SPY": {"price": 500, "prev_price": 490, "daily_chg": 2.0},
        "BTC": {"price": 60000, "prev_price": 58000, "daily_chg": 3.4}
    }
    mock_score = 75 # Risk On
    
    print(f"Generating report for score {mock_score}...")
    reports = generate_multilingual_report(mock_data, mock_score)
    
    if not reports:
        print("FAIL: No reports generated.")
        return
    
    languages = ["EN", "JP", "CN", "ES", "HI", "ID", "AR"]
    all_pass = True
    
    for lang in languages:
        text = reports.get(lang, "")
        count = len(text)
        preview = text[:50].replace('\n', ' ') + "..."
        print(f"[{lang}] Count: {count} | Preview: {preview}")
        
        # Protocol v5.3 Strict Range: 200 - 250
        if 200 <= count <= 250:
            status = "PASS"
        else:
            status = "FAIL (Out of v5.3 range 200-250)"
            all_pass = False
        
        print(f" - Status: {status}")
        
    if all_pass:
        print("\n[RESULT] AI Protocol v5.3: COMPLIANT")
    else:
        print("\n[RESULT] AI Protocol v5.3: NON-COMPLIANT (Length issues)")

if __name__ == "__main__":
    verify_protocol_v5_3()
