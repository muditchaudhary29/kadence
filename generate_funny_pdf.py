import os
from reportlab.lib.pagesizes import inch
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle

PAGE_WIDTH = 11.0 * inch
PAGE_HEIGHT = 6.1875 * inch

# Vibrant Dark Palette
BG_DARK = HexColor('#0F172A')
CARD_BG = HexColor('#1E293B')
CARD_BORDER = HexColor('#334155')
TEXT_WHITE = HexColor('#FFFFFF')
TEXT_MUTED = HexColor('#94A3B8')
NEON_CYAN = HexColor('#06B6D4')
NEON_PINK = HexColor('#EC4899')
NEON_YELLOW = HexColor('#FACC15')
NEON_GREEN = HexColor('#10B981')
NEON_PURPLE = HexColor('#A855F7')

def draw_background(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(BG_DARK)
    canvas.rect(0, 0, PAGE_WIDTH, PAGE_HEIGHT, fill=True, stroke=False)
    
    # Header bar
    canvas.setFillColor(CARD_BG)
    canvas.rect(0.4*inch, PAGE_HEIGHT - 0.65*inch, PAGE_WIDTH - 0.8*inch, 0.45*inch, fill=True, stroke=False)
    
    canvas.setFillColor(NEON_CYAN)
    canvas.setFont("Helvetica-Bold", 12)
    canvas.drawString(0.6*inch, PAGE_HEIGHT - 0.5*inch, "VoiceCraft 🗣️")
    
    canvas.setFillColor(TEXT_MUTED)
    canvas.setFont("Helvetica", 10)
    canvas.drawString(1.6*inch, PAGE_HEIGHT - 0.5*inch, "Kadence AI — How to Stop Sounding Like a Nervous Potato 🥔")
    
    # Footer bar
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(TEXT_MUTED)
    canvas.drawString(0.4*inch, 0.3*inch, "VoiceCraft (Kadence AI) Fun Edition Presentation")
    canvas.drawRightString(PAGE_WIDTH - 0.4*inch, 0.3*inch, f"Slide {doc.page} / 8")
    
    canvas.restoreState()

def create_funny_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=(PAGE_WIDTH, PAGE_HEIGHT),
        leftMargin=0.5*inch,
        rightMargin=0.5*inch,
        topMargin=0.8*inch,
        bottomMargin=0.6*inch
    )

    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'DocTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=28, leading=34,
        textColor=TEXT_WHITE, alignment=1, spaceAfter=10
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubTitle', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=15, leading=19,
        textColor=NEON_CYAN, alignment=1, spaceAfter=12
    )

    body_center = ParagraphStyle(
        'BodyCenter', parent=styles['Normal'],
        fontName='Helvetica', fontSize=11, leading=15,
        textColor=NEON_YELLOW, alignment=1, spaceAfter=16
    )
    
    slide_cat_style = ParagraphStyle(
        'SlideCat', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=10, leading=12,
        textColor=NEON_PINK, spaceAfter=4
    )

    slide_heading_style = ParagraphStyle(
        'SlideHeading', parent=styles['Normal'],
        fontName='Helvetica-Bold', fontSize=20, leading=24,
        textColor=TEXT_WHITE, spaceAfter=15
    )

    card_body_style = ParagraphStyle(
        'CardBody', parent=styles['Normal'],
        fontName='Helvetica', fontSize=9.5, leading=13.5,
        textColor=TEXT_MUTED
    )

    story = []

    # SLIDE 1
    story.append(Spacer(1, 0.3*inch))
    story.append(Paragraph("How to Stop Sounding Like a<br/>Nervous Potato in Technical Interviews 🥔✨", title_style))
    story.append(Paragraph("VoiceCraft (Kadence AI) — The AI Vocal Telemetry Shield", subtitle_style))
    story.append(Paragraph("The AI-Powered Telemetry Engine That Banishes 'Um', 'Like', & Panic Silences Forever.", body_center))
    story.append(Spacer(1, 0.15*inch))

    pills_data = [
        [
            Paragraph("<b>🚨 47 Filler Words / Min</b>", ParagraphStyle('P1', parent=card_body_style, alignment=1, textColor=NEON_PINK)),
            Paragraph("<b>🏎️ 220 WPM Panic Velocity</b>", ParagraphStyle('P2', parent=card_body_style, alignment=1, textColor=NEON_YELLOW)),
            Paragraph("<b>👻 Ghost Result Syndrome</b>", ParagraphStyle('P3', parent=card_body_style, alignment=1, textColor=NEON_PURPLE)),
            Paragraph("<b>🪄 Executive Magic</b>", ParagraphStyle('P4', parent=card_body_style, alignment=1, textColor=NEON_GREEN))
        ]
    ]
    pill_table = Table(pills_data, colWidths=[2.3*inch]*4)
    pill_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, NEON_CYAN),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(pill_table)
    story.append(PageBreak())

    # SLIDE 2
    story.append(Paragraph("EXPECTATION VS REALITY 🤡", slide_cat_style))
    story.append(Paragraph("The Anatomy of an Interview Meltdown", slide_heading_style))

    p1 = Paragraph("<b><font color='#10B981'>😎 Me Practicing in Front of the Mirror</font></b><br/><br/>"
                   "• Smooth, confident posture 🗿<br/><br/>"
                   "• Flawless STAR framework execution ✨<br/><br/>"
                   "• Crisp 130 WPM executive velocity 👔<br/><br/>"
                   "• Zero hesitation, zero sweat, pure charisma 🔥", card_body_style)
    
    p2 = Paragraph("<b><font color='#EC4899'>🫠 Me 30 Seconds into Live Interview</font></b><br/><br/>"
                   "• 'Um, so... basically... like... you know...' 🔁<br/><br/>"
                   "• Brain reboots like Windows 95 mid-sentence 💻<br/><br/>"
                   "• Speaking at 210 WPM like Eminem 🎤<br/><br/>"
                   "• Forgot Result entirely & ended with '...and yeah' 💀", card_body_style)

    prob_data = [[p1, p2]]
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

    # SLIDE 3
    cat_yellow = ParagraphStyle('CatY', parent=slide_cat_style, textColor=NEON_YELLOW)
    story.append(Paragraph("THE HALL OF SHAME 🏆", cat_yellow))
    story.append(Paragraph("Meet the 4 Villains Ruining Your Interviews", slide_heading_style))

    v1 = Paragraph("<b><font size=24>🧟</font></b><br/><b>The Filler Fiend</b><br/><br/><font color='#94A3B8'>Averages 18 'um's & 24 'like's per minute. Dilutes authority by 90%.</font>", card_body_style)
    v2 = Paragraph("<b><font size=24>🏎️</font></b><br/><b>The Speed Demon</b><br/><br/><font color='#94A3B8'>Speaks at 220 WPM without breathing. Listener needs CPR.</font>", card_body_style)
    v3 = Paragraph("<b><font size=24>🦥</font></b><br/><b>The Sloth Pauser</b><br/><br/><font color='#94A3B8'>4-second awkward silences while brain reboots.</font>", card_body_style)
    v4 = Paragraph("<b><font size=24>👻</font></b><br/><b>The Ghost Result</b><br/><br/><font color='#94A3B8'>Tells a 5-minute story... forgets to mention what actually happened.</font>", card_body_style)

    v_data = [[v1, v2, v3, v4]]
    v_table = Table(v_data, colWidths=[2.3*inch]*4)
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, NEON_PINK),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(v_table)
    story.append(PageBreak())

    # SLIDE 4
    cat_cyan = ParagraphStyle('CatC', parent=slide_cat_style, textColor=NEON_CYAN)
    story.append(Paragraph("THE SUPERHERO ARRIVES 🦸‍♂️", cat_cyan))
    story.append(Paragraph("VoiceCraft (Kadence AI): Real-Time Vocal Telemetry Shield", slide_heading_style))

    f1 = Paragraph("<b><font color='#06B6D4'>🎙️ Live Voice Waveform</font></b><br/><font color='#94A3B8'>Real-time Web Audio canvas visualizer so you can see your voice energy live.</font><br/><br/>"
                   "<b><font color='#FACC15'>⚡ WPM Speed Arc Gauge</font></b><br/><font color='#94A3B8'>Keeps you right in the 120–160 WPM sweet spot. Green light = Exec speed!</font>", card_body_style)

    f2 = Paragraph("<b><font color='#EC4899'>🎯 Filler Word Exterminator</font></b><br/><font color='#94A3B8'>Detects 'um', 'like', 'basically' instantly. Highlights them in red pill badges!</font><br/><br/>"
                   "<b><font color='#10B981'>📊 STAR Radar Analysis</font></b><br/><font color='#94A3B8'>Visual radar chart checking if you gave a real Result or just handed out vibes.</font>", card_body_style)

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

    # SLIDE 5
    story.append(Paragraph("LAZY GENIUS FEATURE 🧠⚡", cat_yellow))
    story.append(Paragraph("Notes-to-Questions: Drop Messy Docs -> Get FAANG Questions", slide_heading_style))

    s1 = Paragraph("<b><font color='#FACC15'>📁 Step 1</font></b><br/><b>Dump Messy Notes</b><br/><br/><font color='#94A3B8'>Drag & drop 3-year-old project notes, PDFs, or resume drafts.</font>", card_body_style)
    s2 = Paragraph("<b><font color='#FACC15'>🤖 Step 2</font></b><br/><b>Concept Sniffer</b><br/><br/><font color='#94A3B8'>Extracts tech terms, frameworks, & hidden achievements.</font>", card_body_style)
    s3 = Paragraph("<b><font color='#FACC15'>🔥 Step 3</font></b><br/><b>Grill Generator</b><br/><br/><font color='#94A3B8'>Generates 5-8 hyper-specific STAR questions for your project.</font>", card_body_style)
    s4 = Paragraph("<b><font color='#FACC15'>🚀 Step 4</font></b><br/><b>1-Click Practice</b><br/><br/><font color='#94A3B8'>Click card & start vocal practice before panic sets in.</font>", card_body_style)

    steps_data = [[s1, s2, s3, s4]]
    steps_table = Table(steps_data, colWidths=[2.3*inch]*4)
    steps_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, NEON_YELLOW),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(steps_table)
    story.append(PageBreak())

    # SLIDE 6
    cat_purple = ParagraphStyle('CatP', parent=slide_cat_style, textColor=NEON_PURPLE)
    story.append(Paragraph("THE MAGIC TRICK 🪄✨", cat_purple))
    story.append(Paragraph("The 'How to Say It Better' Executive STAR Transformer", slide_heading_style))

    c1 = Paragraph("<b><font color='#EC4899'>💩 What You Spoke (Raw Panic Transcript)</font></b><br/><br/>"
                   "<i>'Um... so, like, our database was getting super slow and crashing all the time... so I went in and, you know, added some cache stuff and fixed some index queries... and basically it stopped crashing, I think?'</i>", card_body_style)

    c2 = Paragraph("<b><font color='#10B981'>💎 What VoiceCraft Turns It Into (Exec STAR)</font></b><br/><br/>"
                   "<b>'I spearheaded the database optimization initiative (Situation/Task) by implementing Redis query caching and restructuring database indexes (Action), which reduced API P99 latency by 45% and eliminated production outages (Result).'</b>", card_body_style)

    magic_data = [[c1, c2]]
    magic_table = Table(magic_data, colWidths=[4.7*inch, 4.7*inch])
    magic_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 14),
        ('RIGHTPADDING', (0,0), (-1,-1), 14),
    ]))
    story.append(magic_table)
    story.append(PageBreak())

    # SLIDE 7
    cat_green = ParagraphStyle('CatG', parent=slide_cat_style, textColor=NEON_GREEN)
    story.append(Paragraph("THE BOTTOM LINE 📈", cat_green))
    story.append(Paragraph("Why VoiceCraft Will Make You Unstoppable", slide_heading_style))

    st1 = Paragraph("<b><font size=28 color='#06B6D4'>0%</font></b><br/><b>Awkward Silence</b><br/><br/><font color='#94A3B8'>No more blanking mid-interview</font>", card_body_style)
    st2 = Paragraph("<b><font size=28 color='#EC4899'>-85%</font></b><br/><b>Filler Word Count</b><br/><br/><font color='#94A3B8'>Say goodbye to 'um' & 'like'</font>", card_body_style)
    st3 = Paragraph("<b><font size=28 color='#FACC15'>100%</font></b><br/><b>Quantified Impact</b><br/><br/><font color='#94A3B8'>Every story has a real Result</font>", card_body_style)
    st4 = Paragraph("<b><font size=28 color='#10B981'>10x</font></b><br/><b>Offer Rate Boost</b><br/><br/><font color='#94A3B8'>Confidence is 90% of the battle</font>", card_body_style)

    stat_data = [[st1, st2, st3, st4]]
    stat_table = Table(stat_data, colWidths=[2.3*inch]*4)
    stat_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), CARD_BG),
        ('BOX', (0,0), (-1,-1), 1, CARD_BORDER),
        ('INNERGRID', (0,0), (-1,-1), 1, CARD_BORDER),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 14),
        ('BOTTOMPADDING', (0,0), (-1,-1), 14),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(stat_table)
    story.append(PageBreak())

    # SLIDE 8
    story.append(Spacer(1, 0.4*inch))
    story.append(Paragraph("🎉 GO FORTH & GET HIRED!", title_style))
    story.append(Paragraph("VoiceCraft (Kadence AI) is ready to supercharge your vocal confidence.", subtitle_style))
    story.append(Spacer(1, 0.2*inch))
    story.append(Paragraph("Any Questions? (Or are you too busy counting your 'ums' right now? 😉)", body_center))
    story.append(Spacer(1, 0.3*inch))

    cta_p = Paragraph("<b><font size=14 color='#0F172A'>🚀 Try VoiceCraft Now</font></b>", ParagraphStyle('CTA', parent=card_body_style, alignment=1))
    cta_table = Table([[cta_p]], colWidths=[4.0*inch])
    cta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NEON_CYAN),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('TOPPADDING', (0,0), (-1,-1), 12),
        ('BOTTOMPADDING', (0,0), (-1,-1), 12),
    ]))
    story.append(cta_table)

    doc.build(story, onFirstPage=draw_background, onLaterPages=draw_background)
    print(f"Successfully generated Funny PDF: {filename}")

if __name__ == '__main__':
    output_pdf = '/Users/parththakur/.gemini/antigravity/scratch/voicecraft/VoiceCraft_Funny_Presentation.pdf'
    create_funny_pdf(output_pdf)
