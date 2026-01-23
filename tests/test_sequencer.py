
import sys
import os
from datetime import datetime, timedelta

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from bluesky_sequencer import BlueskySequencer

def test_time(h, m):
    seq = BlueskySequencer()
    # Mock JST time
    mock_jst = datetime(2026, 1, 23, h, m, 0)
    print(f"\nTesting Time: {mock_jst.strftime('%H:%M')} JST")
    
    match, lang, phase, force = seq.check_schedule(jst_now=mock_jst)
    print(f"Result: Match={match}, Lang={lang}, Phase={phase}")
    return match

print("--- DIAGNOSTIC: Sequencer Window Test ---")

# Test Case 1: The suspected failure time (based on last_updated xx:54)
# ID Phase 1 is 09:35. Window: 09:35 - 09:50.
# Execution: 09:54.
test_time(9, 54)

# Test Case 2: Ideal time
test_time(9, 40)

# Test Case 3: JP Phase 2 (10:35). Exec 10:54.
test_time(10, 54)
