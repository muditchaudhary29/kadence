import os
from reportlab.lib.pagesizes import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

PAGE_WIDTH = 11.0 * inch
PAGE_HEIGHT = 6.1875 * inch

BG_DARK = HexColor('#09090B')
CARD_BG = HexColor('#18181B')
CARD_BORDER = HexColor('#27272A')
TEXT_WHITE = HexColor('#FFFFFF')
TEXT_MUTED = HexColor('#94A3B8')
NEON_CYAN = HexColor('#06B6D4')
NEON_PINK = HexColor('#EC4899')
NEON_YELLOW = HexColor('#FACC15')
NEON_GREEN = HexColor('#10B981')
NEON_PURPLE = HexColor('#A855F7')

IMG_HERO = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/public/kadence_hero.jpg'
IMG_PANIC = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/public/interview_panic.jpg'
IMG_NOTES = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/public/kadence_notes.jpg'
IMG_TRANSFORM = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/public/executive_transformation.jpg'

def draw_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # Header bar (Strictly KADENCE AI)
    canvas.setFillColor(CARD_BG)
    canvas.rect(0.4*inch, PAGE_HEIGHT - 0.6*inch, PAGE_WIDTH - 0.8*inch, 0.4*inch, fill=True, stroke=False)
    
    canvas.setFillColor(NEON_CYAN)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(0.6*inch, PAGE_HEIGHT - 0.45*inch, "⚡ KADENCE AI")
    
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("Helvetica", 9)
    canvas.drawString(1.8*inch, PAGE_HEIGHT - 0.45*inch, "How to Stop Sounding Like a Nervous Potato 🥔")
    
    # Footer bar (Clean strictly KADENCE AI)
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(0.4*inch, 0.25*inch, "KADENCE AI Presentation")
    canvas.drawRightString(PAGE_WIDTH - 0.4*inch, 0.25*inch, f"Slide {doc.page} / 8")
    
    canvas.restoreState()

def create_kadence_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=0.4*inch,
        rightMargin=0.4*inch,
        topMargin=0.7*inch,
        bottomMargin=0.5*inch
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=24, leading=28,
        textColor=TEXT_WHITE, alignment=1, spaceAfter=6
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=14, leading=17,
        textColor=NEON_CYAN, alignment=1, spaceAfter=8
    )

    body_center = ParagraphStyle(
        'BodyCenter', parent=styles['Normal'],
        fontName='Helvetica', fontSize=10, leading=13,
        textColor=NEON_YELLOW, alignment=1, spaceAfter=10
    )
    
    slide_cat_style = ParagraphStyle(
        'SlideCat', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=10, leading=12,
        textColor=NEON_CYAN, spaceAfter=2
    )

    slide_heading_style = ParagraphStyle(
        'SlideHeading', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=18, leading=22,
        textColor=TEXT_WHITE, spaceAfter=8
    )

    card_body_style = ParagraphStyle(
        'CardBody', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9, leading=12.5,
        textColor=TEXT_MUTED
    )

    story = []

    # SLIDE 1
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("How to Stop Sounding Like a<br/>Nervous Potato in Technical Interviews 🥔✨", title_style))
    story.append(Paragraph("KADENCE AI — Real-Time Vocal Telemetry Shield", subtitle_style))
    story.append(Paragraph("The Real-Time Vocal Telemetry Shield that Banishes 'Um', 'Like', & Panic Silences Forever.", body_center))
    
    story.append(Image(IMG_HERO, width=9.8*inch, height=3.0*inch))
    story.append(PageBreak())

    # SLIDE 2
    story.append(Paragraph("KADENCE AI  |  PROBLEM DIAGNOSIS 🤡", slide_cat_style))
    story.append(Paragraph("Expectation vs. Reality: The Interview Meltdown", slide_heading_style))

    img_p = Image(IMG_PANIC, width=5.0*inch, height=4.2*inch)
    
    p_text = Paragraph("<b><font color='#EC4899'>🫠 What Happens 30 Seconds in</font></b><br/><br/>"
                       "• 'Um, so... basically... like... you know...' 🔁<br/><br/>"
                       "• Brain reboots like Windows 95 mid-sentence 💻<br/><br/>"
                       "• Speaking at 210 WPM like Eminem 🎤<br/><br/>"
                       "• Forgot Result entirely & ended with '...and yeah' 💀<br/><br/>"
                       "• Panic sweating while interviewer stares blankly 😳", card_body_style)

    table2 = Table([[img_p, p_text]], colWidths=[5.1*inch, 4.8*inch])
    table2.setStyle(TableStyle([
        ('BACKGROUND', (1,0), (1,0), CARD_BG),
        ('BOX', (1,0), (1,0), 1, NEON_PINK),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(table2)
    story.append(PageBreak())

    # SLIDE 3
    cat_yellow = ParagraphStyle('CatY', parent=slide_cat_style, textColor=NEON_YELLOW)
    story.append(Paragraph("KADENCE AI  |  THE HALL OF SHAME 🏆", cat_yellow))
    story.append(Paragraph("Meet the 4 Villains Exterminated by KADENCE AI", slide_heading_style))

    v1 = Paragraph("<b><font size=20>🧟</font></b><br/><b>The Filler Fiend</b><br/><br/><font color='#94A3B8'>Averages 18 'um's & 24 'like's/min. Dilutes authority by 90%.</font>", card_body_style)
    v2 = Paragraph("<b><font size=20>🏎️</font></b><br/><b>The Speed Demon</b><br/><br/><font color='#94A3B8'>Speaks at 220 WPM without breathing. Listener needs CPR.</font>", card_body_style)
    v3 = Paragraph("<b><font size=20>🦥</font></b><br/><b>The Sloth Pauser</b><br/><br/><font color='#94A3B8'>4-second awkward silences while brain reboots.</font>", card_body_style)
    v4 = Paragraph("<b><font size=20>👻</font></b><br/><b>The Ghost Result</b><br/><br/><font color='#94A3B8'>Tells a 5-minute story... forgets to mention what happened.</font>", card_body_style)

    v_data = [[v1, v2, v3, v4]]
    v_table = Table(v_data, colWidths=[2.4*inch]*4)
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, NEON_PINK),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(v_table)
    story.append(PageBreak())

    # SLIDE 4
    story.append(Paragraph("KADENCE AI  |  CORE PLATFORM", slide_cat_style))
    story.append(Paragraph("KADENCE AI: Real-Time Vocal Telemetry & Visual Analytics", slide_heading_style))

    img_h = Image(IMG_HERO, width=5.2*inch, height=4.2*inch)
    f_text = Paragraph("<b><font color='#06B6D4'>🎙️ Live Voice Waveform</font></b><br/>Web Audio API canvas visualizer to monitor voice energy.<br/><br/>"
                       "<b><font color='#FACC15'>⚡ WPM Speed Arc Gauge</font></b><br/>Keeps pace in optimal 120–160 WPM green zone. Red = Slow down!<br/><br/>"
                       "<b><font color='#EC4899'>🎯 Filler Word Engine</font></b><br/>Detects 'um', 'like', 'basically' with red transcript pills.<br/><br/>"
                       "<b><font color='#10B981'>📊 STAR Radar Analysis</font></b><br/>Evaluates Situation, Task, Action, & Result live.", card_body_style)

    table4 = Table([[img_h, f_text]], colWidths=[5.3*inch, 4.6*inch])
    table4.setStyle(TableStyle([
        ('BACKGROUND', (1,0), (1,0), CARD_BG),
        ('BOX', (1,0), (1,0), 1, NEON_CYAN),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(table4)
    story.append(PageBreak())

    # SLIDE 5
    story.append(Paragraph("KADENCE AI  |  SMART QUESTION GENERATION 🧠⚡", cat_yellow))
    story.append(Paragraph("Notes-to-Questions: Drop Messy Docs -> Get FAANG Questions", slide_heading_style))

    img_n = Image(IMG_NOTES, width=5.2*inch, height=4.2*inch)
    s_text = Paragraph("<b><font color='#FACC15'>📁 Step 1: Dump Messy Notes</font></b><br/>Drag & drop .txt, .md, or .pdf project notes.<br/><br/>"
                       "<b><font color='#FACC15'>🤖 Step 2: Concept Sniffer</font></b><br/>Extracts technical buzzwords, terms, & milestones.<br/><br/>"
                       "<b><font color='#FACC15'>🔥 Step 3: Grill Generator</font></b><br/>Spits out 5-8 hyper-specific STAR questions.<br/><br/>"
                       "<b><font color='#FACC15'>🚀 Step 4: 1-Click Practice</font></b><br/>Click any card & start live vocal practice.", card_body_style)

    table5 = Table([[img_n, s_text]], colWidths=[5.3*inch, 4.6*inch])
    table5.setStyle(TableStyle([
        ('BACKGROUND', (1,0), (1,0), CARD_BG),
        ('BOX', (1,0), (1,0), 1, NEON_YELLOW),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(table5)
    story.append(PageBreak())

    # SLIDE 6
    cat_purple = ParagraphStyle('CatP', parent=slide_cat_style, textColor=NEON_PURPLE)
    story.append(Paragraph("KADENCE AI  |  AI REWRITE ENGINE 🪄✨", cat_purple))
    story.append(Paragraph("The 'How to Say It Better' Executive STAR Transformer", slide_heading_style))

    story.append(Image(IMG_TRANSFORM, width=9.8*inch, height=4.2*inch))
    story.append(PageBreak())

    # SLIDE 7
    cat_green = ParagraphStyle('CatG', parent=slide_cat_style, textColor=NEON_GREEN)
    story.append(Paragraph("KADENCE AI  |  MEASURABLE IMPACT 📈", cat_green))
    story.append(Paragraph("Why KADENCE AI Will Make You Unstoppable", slide_heading_style))

    st1 = Paragraph("<b><font size=24 color='#06B6D4'>0%</font></b><br/><b>Awkward Silence</b><br/><br/><font color='#94A3B8'>No mid-interview freezes</font>", card_body_style)
    st2 = Paragraph("<b><font size=24 color='#EC4899'>-85%</font></b><br/><b>Filler Word Count</b><br/><br/><font color='#94A3B8'>Say goodbye to 'um'</font>", card_body_style)
    st3 = Paragraph("<b><font size=24 color='#FACC15'>100%</font></b><br/><b>Quantified Impact</b><br/><br/><font color='#94A3B8'>Every story has a Result</font>", card_body_style)
    st4 = Paragraph("<b><font size=24 color='#10B981'>10x</font></b><br/><b>Offer Rate Boost</b><br/><br/><font color='#94A3B8'>Confidence is key</font>", card_body_style)

    stat_data = [[st1, st2, st3, st4]]
    stat_table = Table(stat_data, colWidths=[2.4*inch]*4)
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(stat_table)
    story.append(PageBreak())

    # SLIDE 8
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("🎉 GO FORTH & GET HIRED!", title_style))
    story.append(Paragraph("KADENCE AI is ready to supercharge your vocal confidence.", subtitle_style))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph("Any Questions? (Or are you too busy counting your 'ums' right now? 😉)", body_center))
    story.append(Spacer(1, 0.2*inch))

    cta_p = Paragraph("<b><font size=14 color='#09090B'>🚀 Try KADENCE AI Now</font></b>", ParagraphStyle('CTA', parent=card_body_style, alignment=1))
    cta_table = Table([[cta_p]], colWidths=[3.8*inch])
    cta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NEON_CYAN),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 10),
        ('BOTTOMPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(cta_table)

    doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)
    print(f"Successfully generated Kadence AI PDF: {filename}")

if __name__ == '__main__':
    output_pdf = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/Kadence_AI_Presentation.pdf'
    create_kadence_pdf(output_pdf)
