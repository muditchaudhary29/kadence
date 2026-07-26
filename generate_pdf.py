import os
from reportlab.lib.pagesizes import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

# 16:9 Widescreen dimensions
PAGE_WIDTH = 11.0 * inch
PAGE_HEIGHT = 6.1875 * inch

# Colors
BG_DARK = HexColor('#09090B')
CARD_BG = HexColor('#18181B')
CARD_BORDER = HexColor('#27272A')
TEXT_WHITE = HexColor('#FFFFFF')
TEXT_MUTED = HexColor('#94A3B8')
ACCENT_BLUE = HexColor('#38BDF8')
ACCENT_INDIGO = HexColor('#818CF8')
ACCENT_EMERALD = HexColor('#34D399')
ACCENT_AMBER = HexColor('#FBBF24')
ACCENT_RED = HexColor('#EF4444')

def draw_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # Header bar
    canvas.setFillColor(HexColor('#18181B'))
    canvas.rect(0.4*inch, PAGE_HEIGHT - 0.65*inch, PAGE_WIDTH - 0.8*inch, 0.45*inch, fill=True, stroke=False)
    
    canvas.setFillColor(ACCENT_BLUE)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(0.6*inch, PAGE_HEIGHT - 0.5*inch, "VoiceCraft")
    
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("Helvetica", 10)
    canvas.drawString(1.4*inch, PAGE_HEIGHT - 0.5*inch, "Kadence AI — Product Presentation")
    
    # Footer bar
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(0.4*inch, 0.3*inch, "VoiceCraft (Kadence AI) Presentation Deck")
    canvas.drawRightString(PAGE_WIDTH - 0.4*inch, 0.3*inch, f"Slide {doc.page} / 8")
    
    canvas.restoreState()

def create_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
        topMargin=0.8*inch,
        bottomMargin=0.6*inch
    )

    styles = getSampleStyleSheet()
    
    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=32,
        leading=38,
        textColor=TEXT_WHITE,
        alignment=1, # Center
        spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=16,
        leading=20,
        textColor=ACCENT_BLUE,
        alignment=1,
        spaceAfter=12
    )

    body_center = ParagraphStyle(
        'BodyCenter',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=11,
        leading=15,
        textColor=TEXT_MUTED,
        alignment=1,
        spaceAfter=20
    )
    
    slide_cat_style = ParagraphStyle(
        'SlideCat',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=12,
        textColor=ACCENT_BLUE,
        spaceAfter=4
    )

    slide_heading_style = ParagraphStyle(
        'SlideHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        textColor=TEXT_WHITE,
        spaceAfter=15
    )

    card_title_style = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=TEXT_WHITE,
        spaceAfter=6
    )

    card_body_style = ParagraphStyle(
        'CardBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=TEXT_MUTED
    )

    story = []

    # -------------------------------------------------------------------------
    # SLIDE 1: Title Slide
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 0.4*inch))
    story.append(Paragraph("VoiceCraft / Kadence AI", title_style))
    story.append(Paragraph("Next-Generation AI Speech & Interview Coach", subtitle_style))
    story.append(Paragraph("Real-Time Vocal Telemetry  •  STAR Method Radar  •  Notes-to-Questions Engine  •  Executive AI Rewrite", body_center))
    story.append(Spacer(1, 0.2*inch))

    pills_data = [
        [
            Paragraph("<b>🎙️ Live Voice Wave</b><br/><font size=8 color='#94A3B8'>Web Audio Canvas</font>", ParagraphStyle('P1', parent=card_body_style, alignment=1, textColor=TEXT_WHITE)),
            Paragraph("<b>⚡ WPM Speed Arc</b><br/><font size=8 color='#94A3B8'>Optimal Rate Tracker</font>", ParagraphStyle('P2', parent=card_body_style, alignment=1, textColor=TEXT_WHITE)),
            Paragraph("<b>🎯 STAR Radar</b><br/><font size=8 color='#94A3B8'>Response Structure</font>", ParagraphStyle('P3', parent=card_body_style, alignment=1, textColor=TEXT_WHITE)),
            Paragraph("<b>📝 Notes Engine</b><br/><font size=8 color='#94A3B8'>PDF / Doc Generator</font>", ParagraphStyle('P4', parent=card_body_style, alignment=1, textColor=TEXT_WHITE))
        ]
    ]
    pill_table = Table(pills_data, colWidths=[2.3*inch]*4)
    pill_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_INDIGO),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(pill_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 2: The Core Problem
    # -------------------------------------------------------------------------
    story.append(Paragraph("THE CORE PROBLEM", slide_cat_style))
    story.append(Paragraph("Why Candidates Struggle in High-Stakes Interviews", slide_heading_style))

    p1 = Paragraph("<b>⚠️ Uncontrolled Pacing & Velocity</b><br/><font color='#94A3B8'>Nerves cause candidates to speak too fast (&gt;170 WPM) or pause unnaturally, making core points hard to follow.</font>", card_body_style)
    p2 = Paragraph("<b>⚡ Excessive Filler Word Dilution</b><br/><font color='#94A3B8'>Frequent hesitation terms ('um', 'like', 'basically') erode perceived authority and confidence.</font>", card_body_style)
    p3 = Paragraph("<b>📐 Unstructured STAR Framework</b><br/><font color='#94A3B8'>Candidates fail to structure stories around Situation, Task, Action, & Result, missing key impact metrics.</font>", card_body_style)
    p4 = Paragraph("<b>📄 Generic & Unfocused Practice</b><br/><font color='#94A3B8'>Generic question banks fail to prepare candidates for specific resume projects or technical notes.</font>", card_body_style)

    prob_data = [[p1, p2], [p3, p4]]
    prob_table = Table(prob_data, colWidths=[4.7*inch, 4.7*inch])
    prob_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(prob_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 3: The Solution
    # -------------------------------------------------------------------------
    cat_emerald = ParagraphStyle('CatE', parent=slide_cat_style, textColor=ACCENT_EMERALD)
    story.append(Paragraph("THE SOLUTION", cat_emerald))
    story.append(Paragraph("VoiceCraft AI: Real-Time Vocal Telemetry & AI Coaching", slide_heading_style))

    s1 = Paragraph("<b>🎙️ Live Voice Wave</b><br/><br/><font color='#94A3B8'>Web Audio API canvas visualizer & Web Speech STT microphone transcription.</font>", card_body_style)
    s2 = Paragraph("<b>📊 Precision Metrics</b><br/><br/><font color='#94A3B8'>WPM speed arc gauge, filler word ratio, & vocal confidence index.</font>", card_body_style)
    s3 = Paragraph("<b>🎯 STAR Radar</b><br/><br/><font color='#94A3B8'>Multi-dimensional evaluation scoring Situation, Task, Action, & Result.</font>", card_body_style)
    s4 = Paragraph("<b>🪄 Executive Rewrite</b><br/><br/><font color='#94A3B8'>Automated strengths, growth tips, & executive STAR rewrite.</font>", card_body_style)

    sol_data = [[s1, s2, s3, s4]]
    sol_table = Table(sol_data, colWidths=[2.3*inch]*4)
    sol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_BLUE),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 18),
        ('BOTTOMPADDING', (0,0), (-1,-1), 18),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(sol_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 4: Feature Deep-Dive
    # -------------------------------------------------------------------------
    cat_indigo = ParagraphStyle('CatI', parent=slide_cat_style, textColor=ACCENT_INDIGO)
    story.append(Paragraph("FEATURE DEEP-DIVE", cat_indigo))
    story.append(Paragraph("Real-Time Vocal Telemetry & Visual Analytics", slide_heading_style))

    f1 = Paragraph("<b><font color='#38BDF8'>⚡ Speed & Filler Telemetry</font></b><br/><br/>"
                   "• <b>WPM Arc Gauge:</b> Tracks speaking rate against 120–160 WPM sweet spot.<br/><br/>"
                   "• <b>Filler Word Engine:</b> Detects 'um', 'like', 'basically' with count & ratio.<br/><br/>"
                   "• <b>Live Pills:</b> Highlights filler occurrences in real-time transcript viewer.<br/><br/>"
                   "• <b>Confidence Index:</b> Continuous vocal stability score calculation.", card_body_style)

    f2 = Paragraph("<b><font color='#34D399'>🎯 STAR Framework Radar</font></b><br/><br/>"
                   "• <b>Situation (25%):</b> Evaluates background context and team setup.<br/><br/>"
                   "• <b>Task (25%):</b> Validates problem definition & engineering goal.<br/><br/>"
                   "• <b>Action (25%):</b> Assesses specific personal execution steps.<br/><br/>"
                   "• <b>Result (25%):</b> Scans for quantitative metrics (% latency, revenue).", card_body_style)

    feat_data = [[f1, f2]]
    feat_table = Table(feat_data, colWidths=[4.7*inch, 4.7*inch])
    feat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(feat_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 5: Notes-to-Questions Engine
    # -------------------------------------------------------------
    cat_amber = ParagraphStyle('CatA', parent=slide_cat_style, textColor=ACCENT_AMBER)
    story.append(Paragraph("SMART QUESTION GENERATION", cat_amber))
    story.append(Paragraph("Notes-to-Questions AI Engine", slide_heading_style))

    q1 = Paragraph("<b><font size=18 color='#FBBF24'>01</font></b><br/><b>Upload Material</b><br/><br/><font color='#94A3B8'>Drag & drop .txt, .md, or .pdf files. Powered by client PDF.js parsing.</font>", card_body_style)
    q2 = Paragraph("<b><font size=18 color='#FBBF24'>02</font></b><br/><b>Concept Extraction</b><br/><br/><font color='#94A3B8'>Keyword extractor identifies technical terms & milestones.</font>", card_body_style)
    q3 = Paragraph("<b><font size=18 color='#FBBF24'>03</font></b><br/><b>Question Gen</b><br/><br/><font color='#94A3B8'>Maps concepts into 5-8 custom STAR & technical questions.</font>", card_body_style)
    q4 = Paragraph("<b><font size=18 color='#FBBF24'>04</font></b><br/><b>1-Click Practice</b><br/><br/><font color='#94A3B8'>Click generated question card to launch live vocal practice.</font>", card_body_style)

    q_data = [[q1, q2, q3, q4]]
    q_table = Table(q_data, colWidths=[2.3*inch]*4)
    q_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, ACCENT_AMBER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(q_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 6: AI Coaching & Executive Rewrite
    # -------------------------------------------------------------------------
    story.append(Paragraph("AI COACHING ENGINE", slide_cat_style))
    story.append(Paragraph("Automated AI Feedback & Executive STAR Rewrite", slide_heading_style))

    c1 = Paragraph("<b><font color='#34D399'>💡 Automated Feedback Insights</font></b><br/><br/>"
                   "• <b>✔ Strengths:</b> Clear action verbs & logical technical sequencing.<br/><br/>"
                   "• <b>⚠️ Growth Tips:</b> Pacing dropped in technical section; quantify Result impact metric.", card_body_style)

    c2 = Paragraph("<b><font color='#818CF8'>✨ Executive STAR Rewrite</font></b><br/><br/>"
                   "<b>Raw:</b> 'Um, so we had this issue with slow database queries...'<br/><br/>"
                   "<b>Executive Rewrite:</b> 'I led database optimization (S/T) by implementing Redis query caching (Action), reducing P99 latency by 45% (Result).'", card_body_style)

    coach_data = [[c1, c2]]
    coach_table = Table(coach_data, colWidths=[4.7*inch, 4.7*inch])
    coach_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(coach_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 7: Technical Architecture
    # -------------------------------------------------------------------------
    story.append(Paragraph("TECHNICAL ARCHITECTURE", cat_indigo))
    story.append(Paragraph("System Stack, Data Flow & LLM Schema", slide_heading_style))

    t1 = Paragraph("<b><font color='#38BDF8'>Frontend UI & Visuals</font></b><br/><font color='#94A3B8'>React 18, Vite, Tailwind CSS, Recharts radar/arc, Lucide Icons.</font><br/><br/>"
                   "<b><font color='#818CF8'>Audio Telemetry</font></b><br/><font color='#94A3B8'>Web Audio API AnalyserNode, Web Speech STT, WPM calculator.</font>", card_body_style)

    t2 = Paragraph("<b><font color='#FBBF24'>Document Engine</font></b><br/><font color='#94A3B8'>FileReader API, client PDF.js parser, localStorage session vault.</font><br/><br/>"
                   "<b><font color='#34D399'>LLM Orchestration</font></b><br/><font color='#94A3B8'>Validated JSON schema, modular prompt, GPT-4o / Gemini / Claude.</font>", card_body_style)

    arch_data = [[t1, t2]]
    arch_table = Table(arch_data, colWidths=[4.7*inch, 4.7*inch])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(arch_table)
    story.append(PageBreak())

    # -------------------------------------------------------------------------
    # SLIDE 8: Product Roadmap
    # -------------------------------------------------------------------------
    story.append(Paragraph("PRODUCT ROADMAP", cat_emerald))
    story.append(Paragraph("Roadmap to Next-Gen Voice Coaching", slide_heading_style))

    r1 = Paragraph("<b><font color='#34D399'>Phase 1 (Completed)</font> — Web Voice Telemetry & Notes Engine</b><br/><font color='#94A3B8'>Real-time WPM, filler word detection, STAR radar, PDF parser, session history.</font>", card_body_style)
    r2 = Paragraph("<b><font color='#38BDF8'>Phase 2 (Q3 2026)</font> — Multimodal Video & Gesture Telemetry</b><br/><font color='#94A3B8'>Eye contact tracking, facial micro-expressions, body posture scoring.</font>", card_body_style)
    r3 = Paragraph("<b><font color='#818CF8'>Phase 3 (Q4 2026)</font> — Adaptive AI Conversational Interviewer</b><br/><font color='#94A3B8'>Real-time voice avatar asking adaptive follow-up questions & team dashboards.</font>", card_body_style)

    road_data = [[r1], [r2], [r3]]
    road_table = Table(road_data, colWidths=[9.4*inch])
    road_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(road_table)

    # Build PDF
    doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)
    print(f"Successfully created PDF: {filename}")

if __name__ == '__main__':
    output_pdf = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/VoiceCraft_Presentation.pdf'
    create_pdf(output_pdf)
