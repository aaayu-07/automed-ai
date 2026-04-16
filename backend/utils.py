from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from reportlab.lib import colors
import io
from datetime import datetime

def generate_pdf_report(user, prediction):
    buffer = io.BytesIO()
    c = canvas.Canvas(buffer, pagesize=letter)
    width, height = letter
    
    # --- Header ---
    c.setFillColor(colors.HexColor("#0f172a"))
    c.rect(0, height - 100, width, 100, fill=1, stroke=0)
    
    c.setFillColor(colors.white)
    c.setFont("Helvetica-Bold", 24)
    c.drawString(50, height - 60, "AutoMed AI")
    
    c.setFont("Helvetica", 12)
    c.drawString(50, height - 80, "Advanced Diagnostic Report")
    
    c.drawRightString(width - 50, height - 60, f"Date: {datetime.utcnow().strftime('%Y-%m-%d')}")
    c.drawRightString(width - 50, height - 80, f"Report ID: {str(prediction.get('_id', 'N/A'))[-8:].upper()}")

    # --- Patient Info ---
    y = height - 120
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Patient Profile")
    c.setStrokeColor(colors.HexColor("#3b82f6"))
    c.line(50, y - 5, 200, y - 5)
    
    y -= 20
    c.setFont("Helvetica", 10)
    c.drawString(50, y, f"Name: {user.get('username', 'N/A')}")
    c.drawString(300, y, f"Email: {user.get('email', 'N/A')}")
    
    # --- Assessment Result ---
    y -= 40
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "AI Assessment Result")
    c.line(50, y - 5, 230, y - 5)
    
    y -= 25
    risk_level = prediction.get('risk_level', 'Unknown')
    probability = prediction.get('probability', 0) * 100
    
    # Color coded risk
    if risk_level == "High":
        c.setFillColor(colors.red)
    elif risk_level == "Moderate":
        c.setFillColor(colors.orange)
    else:
        c.setFillColor(colors.green)
        
    c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, f"Risk Classification: {risk_level.upper()}")
    
    # Reset color for details
    c.setFillColor(colors.black)
    c.setFont("Helvetica", 10)
    
    # Line 2: Confidence Score & Module
    y -= 20
    c.drawString(50, y, f"Confidence Score: {probability:.1f}%")
    
    mod_type = prediction.get('type', 'General').lower()
    display_module = 'Cardio' if mod_type in ['lifestyle', 'cardio'] else 'Diabetes' if mod_type == 'diabetes' else mod_type.title()
    c.drawString(300, y, f"Module: {display_module} Protocol")

    # --- Clinical Indicators ---
    y -= 40
    c.setFillColor(colors.black)
    c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "Clinical Indicators")
    c.setStrokeColor(colors.HexColor("#3b82f6"))
    c.line(50, y - 5, 200, y - 5)
    
    y -= 20
    c.setFont("Helvetica", 9)
    inputs = prediction.get('inputs', {})
    
    # Draw inputs in two columns
    col_x = 50
    start_y = y
    
    # Sort keys for consistent order, though original order is usually fine
    sorted_inputs = sorted(inputs.items())
    
    for i, (key, value) in enumerate(sorted_inputs):
        if i > 0 and i % 10 == 0:
            col_x += 280  # Increase column spacing
            y = start_y
            
        c.setFillColor(colors.HexColor("#64748b"))
        c.drawString(col_x, y, f"{key}:")
        
        c.setFillColor(colors.black)
        # Increased offset from 100 to 180 to prevent overlap on long keys
        c.drawString(col_x + 180, y, str(value))
        y -= 15

    # --- HealthLens AI Insights ---
    healthlens = prediction.get('healthlens', {})
    if healthlens and healthlens.get('explanation'):
        y -= 30
            
        c.setFillColor(colors.HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "HealthLens AI Diagnostic Insights")
        c.setStrokeColor(colors.HexColor("#3b82f6"))
        c.line(50, y - 5, 280, y - 5)
        
        y -= 20
        c.setFont("Helvetica-Oblique", 10)
        c.setFillColor(colors.HexColor("#1e293b"))
        
        explanation = healthlens.get('explanation', '')
        text_obj = c.beginText(50, y)
        text_obj.setFont("Helvetica-Oblique", 10)
        
        # Simple wrapping
        words = explanation.split()
        line = ""
        for word in words:
            if len(line + word) < 100:
                line += word + " "
            else:
                text_obj.textLine(line)
                line = word + " "
                y -= 12
        text_obj.textLine(line)
        c.drawText(text_obj)
        y -= 15

    # --- RiskFlow Engine Insights ---
    riskflow = prediction.get('riskflow', {})
    if riskflow and riskflow.get('trend'):
        y -= 15
            
        c.setFillColor(colors.HexColor("#0f172a"))
        c.setFont("Helvetica-Bold", 12)
        c.drawString(50, y, "Risk Trend Summary")
        c.setStrokeColor(colors.HexColor("#3b82f6"))
        c.line(50, y - 5, 200, y - 5)
        
        y -= 20
        c.setFont("Helvetica", 10)
        
        # Color based on trend
        trend = riskflow.get('trend', '')
        if trend == 'improving':
            c.setFillColor(colors.HexColor("#10b981")) # Green
        elif trend == 'worsening':
             c.setFillColor(colors.HexColor("#ef4444")) # Red
        else:
             c.setFillColor(colors.HexColor("#f59e0b")) # Yellow/Orange
        
        c.drawString(50, y, f"Trend: {trend.title()}")
        
        y -= 15
        c.setFillColor(colors.HexColor("#1e293b"))
        c.setFont("Helvetica-Oblique", 10)
        message = riskflow.get('message', '')
        c.drawString(50, y, message)
        y -= 15

    # --- Footer / Disclaimer ---
    c.setStrokeColor(colors.HexColor("#e2e8f0"))
    c.line(50, 70, width - 50, 70)
    
    c.setFillColor(colors.HexColor("#94a3b8"))
    c.setFont("Helvetica", 7)
    disclaimer = (
        "DISCLAIMER: This report is generated by an AI system (AutoMed AI) for informational purposes only. "
        "It DOES NOT constitute a medical diagnosis, advice, or treatment plan. "
        "The results are based solely on the provided inputs and statistical patterns. "
        "Always consult a qualified healthcare professional for medical concerns."
    )
    
    text_obj = c.beginText(50, 55)
    for line in range(0, len(disclaimer), 110):
        text_obj.textLine(disclaimer[line:line+110])
    c.drawText(text_obj)
    
    c.drawCentredString(width / 2, 20, "© 2024 AutoMed AI Research Systems")

    c.showPage()
    c.save()
    
    buffer.seek(0)
    return buffer
