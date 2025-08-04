"""Simple scheduler to generate and dispatch reports using the standard library."""

from datetime import datetime, timedelta
from pathlib import Path
import sched
import time

from reports.generator import generate_report


scheduler = sched.scheduler(time.time, time.sleep)


def job() -> None:
    data = [1, 2, 3, 4, 5]
    generate_report(data, Path("output"))


def run_scheduler() -> None:
    run_time = datetime.now() + timedelta(seconds=1)
    scheduler.enterabs(run_time.timestamp(), 1, job)
    scheduler.run()


if __name__ == "__main__":
    run_scheduler()
