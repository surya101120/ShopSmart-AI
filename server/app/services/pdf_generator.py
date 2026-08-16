import io
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

def generate_invoice_pdf(order):
    """Generates a professional PDF invoice for an order."""
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
    story = []

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'InvoiceTitle',
        parent=styles['Heading1'],
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#4F46E5'),
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'InvoiceSubtitle',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#6B7280')
    )

    header_data = [
        [
            Paragraph("<b>SHOPSMART AI</b><br/><font color='#6B7280'>Intelligent E-Commerce Platform</font>", title_style),
            Paragraph(f"<b>INVOICE</b><br/>Invoice #: <b>{order.order_number}</b><br/>Date: {order.created_at.strftime('%d %b %Y') if order.created_at else 'N/A'}<br/>Payment: {order.payment_method.upper()}", subtitle_style)
        ]
    ]

    header_table = Table(header_data, colWidths=[300, 240])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (1,0), (1,0), 'RIGHT')
    ]))
    story.append(header_table)
    story.append(Spacer(1, 15))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceBefore=5, spaceAfter=15))

    # Customer & Shipping details
    address_str = ""
    if order.shipping_address:
        sa = order.shipping_address if isinstance(order.shipping_address, dict) else {}
        address_str = f"{sa.get('name', '')}<br/>{sa.get('address_line1', '')}, {sa.get('address_line2', '')}<br/>{sa.get('city', '')}, {sa.get('state', '')} - {sa.get('pincode', '')}<br/>Phone: {sa.get('phone', '')}"

    details_data = [
        [
            Paragraph(f"<b>Billed & Shipped To:</b><br/>{address_str}", subtitle_style),
            Paragraph(f"<b>Order Status:</b> <font color='#10B981'>{order.status.upper()}</font><br/><b>Payment Status:</b> {order.payment_status.upper()}", subtitle_style)
        ]
    ]

    details_table = Table(details_data, colWidths=[350, 190])
    details_table.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP')]))
    story.append(details_table)
    story.append(Spacer(1, 20))

    # Items table
    items_data = [["Item Description", "Qty", "Unit Price", "Total Price"]]
    for item in order.items:
        items_data.append([
            Paragraph(f"<b>{item.product_name}</b>" + (f" ({item.color}/{item.size})" if item.color or item.size else ""), subtitle_style),
            str(item.quantity),
            f"₹{float(item.unit_price):,.2f}",
            f"₹{float(item.total_price):,.2f}"
        ])

    items_table = Table(items_data, colWidths=[280, 50, 105, 105])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#4F46E5')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('ALIGN', (1,0), (-1,-1), 'RIGHT'),
        ('ALIGN', (0,0), (0,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E5E7EB')),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, colors.HexColor('#F9FAFB')])
    ]))
    story.append(items_table)
    story.append(Spacer(1, 15))

    # Summary table
    summary_data = [
        ["Subtotal:", f"₹{float(order.subtotal):,.2f}"],
        ["Discount:", f"-₹{float(order.discount_amount or 0):,.2f}"],
        ["GST (18%):", f"₹{float(order.gst_amount or 0):,.2f}"],
        ["Shipping:", f"₹{float(order.shipping_cost or 0):,.2f}"],
        ["Grand Total:", f"₹{float(order.total_amount):,.2f}"]
    ]
    summary_table = Table(summary_data, colWidths=[435, 105])
    summary_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'RIGHT'),
        ('FONTNAME', (0,-1), (-1,-1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0,-1), (-1,-1), colors.HexColor('#4F46E5')),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(summary_table)

    story.append(Spacer(1, 30))
    story.append(Paragraph("<b>Thank you for shopping with ShopSmart AI!</b><br/><font color='#9CA3AF'>This is a computer generated invoice and requires no signature.</font>", subtitle_style))

    doc.build(story)
    buffer.seek(0)
    return buffer
