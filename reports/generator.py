from __future__ import annotations

import json
import statistics
from dataclasses import dataclass
from datetime import datetime
from email.message import EmailMessage
from pathlib import Path
from typing import Dict, List, Optional
from string import Template
import smtplib
import urllib.request


@dataclass
class EmailConfig:
    host: str
    username: str
    password: str
    from_addr: str
    to_addr: str
    port: int = 587


def compute_summary(data: List[float]) -> Dict[str, float]:
    """Compute basic summary statistics."""
    return {
        "count": len(data),
        "mean": statistics.mean(data) if data else 0,
        "median": statistics.median(data) if data else 0,
        "stdev": statistics.stdev(data) if len(data) > 1 else 0,
    }


def render_html(summary: Dict[str, float], labels: List[str], data: List[float], *,
                title: str = "Report", chart_type: str = "bar", dataset_label: str = "Data") -> str:
    template_path = Path(__file__).parent / "templates" / "report.html"
    template_text = template_path.read_text(encoding="utf-8")
    summary_items = "\n".join(f"<li>{k}: {v}</li>" for k, v in summary.items())
    tmpl = Template(template_text)
    return tmpl.substitute(
        title=title,
        generated_at=datetime.utcnow().isoformat(),
        summary_items=summary_items,
        labels=json.dumps(labels),
        data=json.dumps(data),
        chart_type=chart_type,
        dataset_label=dataset_label,
    )


def render_pdf(html: str, output_path: Path) -> Optional[Path]:
    """Stub for HTML to PDF rendering. Writes HTML to .pdf if converter unavailable."""
    try:
        import pdfkit  # type: ignore
    except Exception:
        output_path.write_text(html, encoding="utf-8")
        return output_path
    try:
        pdfkit.from_string(html, str(output_path))
        return output_path
    except Exception:
        output_path.write_text(html, encoding="utf-8")
        return output_path


def send_email(subject: str, html_body: str, attachment: Optional[Path], config: EmailConfig) -> None:
    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = config.from_addr
    msg["To"] = config.to_addr
    msg.set_content("See attached report.")
    msg.add_alternative(html_body, subtype="html")
    if attachment and attachment.exists():
        msg.add_attachment(
            attachment.read_bytes(),
            maintype="application",
            subtype="pdf",
            filename=attachment.name,
        )
    with smtplib.SMTP(config.host, config.port) as smtp:
        smtp.starttls()
        smtp.login(config.username, config.password)
        smtp.send_message(msg)


def send_slack(message: str, webhook: str) -> None:
    data = json.dumps({"text": message}).encode("utf-8")
    req = urllib.request.Request(webhook, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req) as resp:  # noqa: F841
        pass


def generate_report(
    data: List[float],
    outdir: Path,
    *,
    email: Optional[EmailConfig] = None,
    slack_webhook: Optional[str] = None,
) -> Dict[str, Optional[Path]]:
    outdir.mkdir(parents=True, exist_ok=True)
    summary = compute_summary(data)
    labels = list(range(len(data)))
    html = render_html(summary, labels, data)
    html_path = outdir / "report.html"
    html_path.write_text(html, encoding="utf-8")
    pdf_path = render_pdf(html, outdir / "report.pdf")
    if email:
        try:
            send_email("Automated Report", html, pdf_path, email)
        except Exception:
            pass
    if slack_webhook:
        try:
            send_slack(f"Report generated at {datetime.utcnow().isoformat()}", slack_webhook)
        except Exception:
            pass
    return {"html": html_path, "pdf": pdf_path, "summary": summary}


if __name__ == "__main__":
    sample = [1, 2, 3, 4, 5]
    generate_report(sample, Path("output"))
