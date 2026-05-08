import time
import subprocess
import threading

def run_scheduler():
    """Run the unlock notification checker every 5 minutes"""
    while True:
        try:
            print("🕐 Running automatic unlock notification check...")
            result = subprocess.run(
                ['python', 'manage.py', 'check_unlock_times'],
                cwd='.',
                capture_output=True,
                text=True
            )
            if result.returncode == 0:
                print("✅ Unlock notification check completed")
            else:
                print(f"❌ Error in unlock notification check: {result.stderr}")
        except Exception as e:
            print(f"❌ Scheduler error: {e}")
        
        # Wait 5 minutes (300 seconds)
        print("⏰ Next check in 5 minutes...")
        time.sleep(300)

def start_scheduler():
    """Start the scheduler in a background thread"""
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    print("🚀 Unlock notification scheduler started (runs every 5 minutes)")
    return scheduler_thread

if __name__ == "__main__":
    start_scheduler()
    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n🛑 Scheduler stopped")
