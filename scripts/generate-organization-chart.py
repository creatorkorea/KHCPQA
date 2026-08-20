from PIL import Image, ImageDraw, ImageFont


WIDTH = 1600
HEIGHT = 1000
OUT = "public/assets/organization-chart.jpg"
FONT = "C:/Windows/Fonts/malgun.ttf"
FONT_BOLD = "C:/Windows/Fonts/malgunbd.ttf"


def font(size, bold=False):
    return ImageFont.truetype(FONT_BOLD if bold else FONT, size)


def rounded_rect(draw, xy, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(xy, radius=radius, fill=fill, outline=outline, width=width)


def centered_text(draw, box, lines, sizes, fills):
    x1, y1, x2, y2 = box
    metrics = []
    total = 0
    for line, size in zip(lines, sizes):
        max_width = (x2 - x1) - 12
        while size > 14:
            candidate = font(size, bold=size >= 28)
            bbox = draw.textbbox((0, 0), line, font=candidate)
            if bbox[2] - bbox[0] <= max_width:
                break
            size -= 2
        f = font(size, bold=size >= 28)
        bbox = draw.textbbox((0, 0), line, font=f)
        h = bbox[3] - bbox[1]
        metrics.append((line, f, h))
        total += h
    total += (len(lines) - 1) * 10
    y = y1 + ((y2 - y1) - total) / 2
    for index, (line, f, h) in enumerate(metrics):
        bbox = draw.textbbox((0, 0), line, font=f)
        x = x1 + ((x2 - x1) - (bbox[2] - bbox[0])) / 2
        draw.text((x, y), line, font=f, fill=fills[index])
        y += h + 10


def card(draw, center_x, y, w, h, title, subtitle="", accent="#6d4be0", fill="#ffffff"):
    x1 = center_x - w / 2
    x2 = center_x + w / 2
    y2 = y + h
    shadow = (int(x1) + 8, int(y) + 10, int(x2) + 8, int(y2) + 10)
    rounded_rect(draw, shadow, 24, "#d8d1ef")
    rounded_rect(draw, (x1, y, x2, y2), 24, fill, "#ddd7f0", 2)
    draw.rounded_rectangle((x1, y, x1 + 12, y2), radius=8, fill=accent)
    if subtitle:
        centered_text(draw, (x1 + 22, y + 8, x2 - 18, y2 - 8), [title, subtitle], [30, 20], ["#201a33", "#6f687f"])
    else:
        centered_text(draw, (x1 + 22, y + 8, x2 - 18, y2 - 8), [title], [30], ["#201a33"])
    return (x1, y, x2, y2)


def line(draw, start, end):
    draw.line((start, end), fill="#b7addb", width=5)


def main():
    img = Image.new("RGB", (WIDTH, HEIGHT), "#f7f8fb")
    draw = ImageDraw.Draw(img)

    for i in range(0, WIDTH, 80):
      color = "#f0eef8" if i % 160 == 0 else "#f3f4f8"
      draw.line((i, 0, i - 220, HEIGHT), fill=color, width=2)

    draw.text((92, 76), "KAHC 조직도", font=font(48, True), fill="#201a33")
    draw.text((94, 136), "The Korea Association for Health & Beauty Certification", font=font(22), fill="#6f687f")

    top = card(draw, 800, 205, 360, 104, "국제협회장", "Global Chair", "#2f8f68", "#f9fffc")
    second = card(draw, 800, 365, 340, 98, "한국 협회장", "Korea Chair", "#6d4be0")

    line(draw, ((top[0] + top[2]) / 2, top[3]), ((top[0] + top[2]) / 2, second[1]))

    row_y = 555
    nodes = [
        (270, "부회장 / 서울총본부", "본원 운영", "#4b7be5"),
        (530, "국제 디렉터", "해외 네트워크", "#6d4be0"),
        (800, "교육 운영", "커리큘럼 / 실습", "#2f8f68"),
        (1070, "자격·회원 관리", "자격 데이터 / 회원", "#cf6f42"),
        (1330, "커뮤니티·대외협력", "공지 / 활동 / 문의", "#7b63c9"),
    ]

    trunk_y = 505
    line(draw, ((second[0] + second[2]) / 2, second[3]), (800, trunk_y))
    line(draw, (270, trunk_y), (1330, trunk_y))

    lower_boxes = []
    for x, title, subtitle, accent in nodes:
        line(draw, (x, trunk_y), (x, row_y))
        lower_boxes.append(card(draw, x, row_y, 240, 92, title, subtitle, accent))

    detail_y = 735
    details = [
        (270, "대림캠퍼스", "강남마사지교육원"),
        (530, "몽골 · 프랑스", "대만 · 베트남 · 태국"),
        (800, "전문 과정", "국가자격 · 실무"),
        (1070, "자격 검증", "회원 / 수료 관리"),
        (1330, "대외 활동", "언론 · 행사 · 봉사"),
    ]

    for box, (x, title, subtitle) in zip(lower_boxes, details):
        line(draw, ((box[0] + box[2]) / 2, box[3]), (x, detail_y))
        card(draw, x, detail_y, 230, 82, title, subtitle, "#9a93aa", "#ffffff")

    rounded_rect(draw, (95, 874, 1505, 920), 20, "#ffffff", "#e2def0", 1)
    draw.text((124, 885), "국제협회장을 중심으로 국내 운영, 국제 디렉터 네트워크, 교육·자격·커뮤니티 운영을 연결한 최신 조직 구조입니다.", font=font(22), fill="#4a425f")

    img.save(OUT, quality=94, optimize=True)


if __name__ == "__main__":
    main()
