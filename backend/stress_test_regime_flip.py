import os
import json
import sys
from gms_engine import generate_multilingual_report

def run_stress_test():
    print("=== STARTING REGIME FLIP STRESS TEST ===")
    
    # Mock data structure matching gms_engine expectations
    mock_data = {
        "STOCKS": {"price": 100, "prev_price": 95, "daily_chg": 5.26},
        "VIX": {"price": 12.0, "prev_price": 15.0, "daily_chg": -20.0},
        "COPPER": {"price": 4.5, "prev_price": 4.2, "daily_chg": 7.14}
    }
    
    # 1. Bull Scenario
    bull_context = {
        "score": 85,
        "trend_vector": "QUAD_2: FIRE (Expansive Growth / Rising Inflation)",
        "market_summary": "S&P 500 at All-Time Highs. VIX at 12.0. Copper/Gold Ratio surging."
    }
    
    # 2. Bear Shock Scenario
    bear_context = {
        "score": 25,
        "trend_vector": "QUAD_3: ICE (Degrading Growth / Disinflationary Pressure)",
        "market_summary": "Global markets in sell-off. VIX spikes to 35.0. Copper/Gold Ratio crashes."
    }
    
    contexts = [("BULL", bull_context)]
    
    for label, ctx in contexts:
        print(f"\n--- TESTING {label} REGIME ---")
        try:
            report = generate_multilingual_report(
                data=mock_data,
                score=ctx["score"],
                trend_context={"vector": ctx["trend_vector"], "narrative": "Stress test simulation."}
            )
            
            print(f"Result (JP): {report.get('JP', 'N/A')}")
            print(f"Result (EN): {report.get('EN', 'N/A')}")
            
            if "[MARKET STATUS:" in report.get("EN", "") or "[ACTION:" in report.get("EN", ""):
                 print("✅ Mandatory Labels Found.")
            else:
                 print("❌ Mandatory Labels MISSING.")
        except Exception as e:
            print(f"Error in {label} test: {e}")

if __name__ == "__main__":
    run_stress_test()
