import os, struct, zlib
W = H = 1024
F = "EHHVHHHUHHUHHUFGGGGGFUHHHHHUVGGUGGVVGGUGGGFGGNHHFHHHVHHHE44444E72222ICHIKOKIHGGGGGGVHRLLHHHHPLJHHHEHHHHHEUHHUGGGEHHHLIDUHHUKIHFGGE11UV444444HHHHHHEHHHHHA4HHHLLRHHHA4AHHHHA4444V1248GVEJLLLPE4C4444EEH1248VU11E11U26AIV22VGGU11UEGGUHHEV124888EHHEHHEEHHF11E00000000000CC800000CC000V000044V440122488G0CC0CC0"
CH = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ,.-+/:"
BG = (12, 16, 26); CARD = (27, 34, 49); INK = (248, 249, 252)
SUB = (223, 231, 242); GOLD = (240, 196, 88); RED = (124, 26, 32)
C = [
("DIPLOMACY", (38, 96, 148), "G3 SUMMIT SHENZHEN", "TRUMP, PUTIN, XI PLEDGE", "NO DEAL, INDIA TAKES NOTE"),
("UKRAINE", (158, 46, 42), "KINDERGARTEN STRUCK", "RUSSIAN STRIKE, SCHOOL FIRE", "ZAPORIZHZHIA FLATS AFIRE"),
("UKRAINE TALKS", (98, 68, 148), "NO NATO GUARANTEES", "MOSCOW REJECTS, TRUMP: GOOD", "ZELENSKY: PUTIN ENEMY"),
("MIDEAST", (176, 106, 32), "RIYADH TOWER HIT", "HOUTHI PROJECTILE STRIKES", "PIF TOWER FLOORS DAMAGED"),
("EUROPE", (32, 112, 106), "DENMARK EXPELS AIDE", "RUSSIAN DEFENSE ATTACHE", "RAPPER PLOT NEAR COPENHAGEN"),
("US JUSTICE", (72, 80, 116), "235 MONTHS SENTENCE", "NIKHIL GUPTA SENTENCED", "19+ YEARS, PANNUN TARGET"),
("TECH", (40, 92, 154), "CHINA CHIP CURBS", "NVIDIA ACCESS CUT", "BEIJING AI PUSH HIT"),
("GAMING", (146, 56, 112), "GTA VI LAUNCHES", "PLAYSTATION NETWORK DOWN", "PSN OUT HOURS BEFORE DROP"),
]
T = ["KENYA DISCHARGES LAST EBOLA PATIENT", "BANGLADESH FACES FRESH ARSON ATTACKS",
     "TRUMP FIRES CYBER CHIEF AS OUTAGES HIT US"]
def box(q, x, y, w, h, k):
    a = max(0, x); b = max(0, y); e = min(W, x + w); f = min(H, y + h)
    if a >= e or b >= f: return
    r = bytes(k) * (e - a)
    for j in range(b, f): q[(j * W + a) * 3:(j * W + e) * 3] = r
def poly(q, p, k):
    for y in range(min(v for u, v in p), max(v for u, v in p) + 1):
        xs = []
        for (ax, ay), (bx, by) in zip(p, p[1:] + p[:1]):
            if min(ay, by) <= y < max(ay, by): xs.append(ax + (y - ay) * (bx - ax) // (by - ay))
        xs.sort()
        for a, b in zip(xs[::2], xs[1::2]): box(q, a, y, b - a, 1, k)
def txt(q, x, y, s, z, k, lim):
    assert len(s) * 6 * z <= lim, (s, len(s) * 6 * z, lim)
    for i, ch in enumerate(s):
        p = CH.find(ch)
        if p < 0: p = CH.find(" ")
        for r in range(7):
            v = int(F[p * 7 + r], 36)
            for b in range(5):
                if v >> (4 - b) & 1: box(q, x + i * 6 * z + b * z, y + r * z, z, z, k)
def art(q, n, ox, oy):
    def B(x, y, w, h, k): box(q, ox + x, oy + y, w, h, k)
    def P(p, k): poly(q, [(ox + x, oy + y) for x, y in p], k)
    L = (240, 244, 250); R = (232, 72, 60); O = (252, 150, 40); Y = (250, 214, 86)
    D = (12, 18, 30); S = (176, 186, 202)
    if n == 0:
        for x, c in ((22, (44, 72, 140)), (172, (238, 240, 244)), (322, (206, 44, 44))):
            B(x, 4, 4, 54, S); B(x + 4, 8, 76, 30, c)
        for y in (10, 16, 22, 28): B(26, y, 74, 3, (220, 62, 56))
        B(26, 8, 30, 14, (36, 60, 126))
        for y, c in ((8, (250, 250, 250)), (17, (56, 88, 176)), (26, (222, 48, 44))): B(176, y, 74, 9, c)
        B(348, 14, 14, 14, Y); B(370, 22, 22, 4, Y)
        B(8, 56, 400, 9, S); B(8, 65, 400, 4, (110, 120, 136))
        for x in (58, 208, 358): B(x, 46, 3, 10, D); B(x - 5, 41, 13, 6, D)
    elif n == 1:
        P([(12, 24), (92, 2), (172, 24)], (178, 72, 58)); B(20, 24, 144, 44, (216, 220, 228))
        for x in (32, 66, 126): B(x, 32, 22, 18, (70, 94, 126)); B(x + 10, 32, 2, 18, L); B(x, 40, 22, 2, L)
        B(80, 44, 26, 24, (92, 102, 120))
        P([(176, 16), (226, 32), (176, 46), (190, 31)], R)
        B(238, 12, 172, 56, (196, 202, 212))
        for x in (250, 290, 330, 370):
            B(x, 22, 24, 18, (86, 104, 132)); B(x, 48, 24, 18, (86, 104, 132))
        P([(252, 12), (260, 0), (268, 12), (264, 12), (272, 2), (278, 14), (286, 12)], O)
        P([(312, 12), (320, 2), (326, 14), (334, 4), (342, 16)], Y)
    elif n == 2:
        P([(26, 4), (134, 4), (134, 34), (80, 70), (26, 34)], (76, 140, 212))
        B(74, 12, 12, 40, L); B(60, 26, 40, 12, L)
        P([(16, 66), (132, 0), (146, 8), (30, 74)], R)
        B(186, 8, 116, 38, (236, 240, 246)); P([(196, 46), (220, 46), (196, 62)], (236, 240, 246))
        for y in (18, 27, 36): B(198, y, 76, 4, (120, 132, 152))
        B(276, 48, 136, 22, (206, 216, 230))
        for y in (54, 62): B(288, y, 100, 3, (120, 132, 152))
    elif n == 3:
        B(62, 2, 108, 68, (178, 190, 206)); B(110, 0, 8, 6, S)
        for y in (8, 20, 32, 44, 56):
            for x in (72, 96, 120, 144): B(x, y, 14, 8, (66, 82, 108))
        P([(168, 6), (198, 18), (176, 30), (200, 40), (166, 44)], O)
        P([(186, 22), (410, 2), (412, 10), (196, 32)], R)
        B(292, 36, 54, 32, (98, 108, 126)); B(292, 32, 54, 5, S)
        B(374, 38, 6, 30, (76, 190, 122)); P([(366, 44), (388, 44), (377, 26)], (76, 190, 122))
    elif n == 4:
        B(18, 6, 104, 60, (206, 44, 50)); B(58, 6, 22, 60, L); B(18, 28, 104, 20, L)
        P([(238, 8), (256, 8), (264, 18), (256, 28), (238, 28), (230, 18)], L)
        B(236, 30, 36, 38, L); B(244, 40, 20, 6, (90, 100, 118))
        P([(220, 68), (300, 2), (312, 10), (232, 74)], R)
        B(340, 32, 48, 7, L); P([(386, 18), (414, 35), (386, 52)], L)
    elif n == 5:
        P([(24, 68), (86, 14), (96, 22), (34, 74)], (196, 152, 90)); B(66, 6, 56, 20, (196, 152, 90))
        B(196, 18, 8, 48, S); B(172, 64, 56, 6, S); B(128, 16, 144, 6, S)
        P([(104, 22), (178, 22), (166, 44), (116, 44)], L); P([(222, 22), (296, 22), (284, 44), (234, 44)], L)
        for x in (116, 166, 234, 284): B(x, 22, 3, 10, S)
        for x in (332, 352, 372, 392): B(x, 12, 6, 58, (154, 164, 180))
        B(328, 6, 74, 6, (154, 164, 180))
    elif n == 6:
        for x in (26, 46, 66):
            B(x, 12, 14, 48, (152, 162, 178)); B(x + 18, 18, 6, 6, (86, 196, 122))
        B(124, 6, 180, 58, (58, 116, 172)); B(142, 20, 144, 30, (26, 56, 96))
        for x in range(142, 288, 20): B(x, 0, 8, 8, S); B(x, 62, 8, 8, S)
        for y in range(18, 54, 12): B(116, y, 8, 8, S); B(304, y, 8, 8, S)
        P([(104, 66), (322, 2), (332, 10), (114, 74)], R)
    else:
        B(24, 2, 152, 52, (78, 88, 108)); B(32, 10, 136, 36, (14, 22, 38))
        P([(48, 16), (56, 14), (110, 42), (102, 44)], R); P([(108, 14), (116, 16), (54, 44), (46, 42)], R)
        P([(194, 18), (332, 18), (364, 38), (352, 68), (214, 68), (184, 48)], (216, 222, 232))
        B(224, 34, 10, 28, D); B(216, 42, 26, 10, D)
        B(322, 30, 12, 12, R); B(338, 44, 12, 12, (64, 128, 216))
        for x, y in ((390, 4), (402, 16), (414, 28)): B(x, y, 6, 8, S)
def main():
    q = bytearray(W * H * 3)
    box(q, 0, 0, W, H, BG)
    box(q, 0, 0, W, 148, RED); box(q, 0, 0, W, 4, GOLD); box(q, 0, 144, W, 4, GOLD)
    txt(q, 152, 12, "WORLD NEWS", 12, (252, 244, 224), W)
    box(q, 0, 100, W, 44, GOLD)
    txt(q, 272, 105, "21 NOVEMBER 2026", 5, (18, 22, 30), W)
    for i, (reg, col, head, a, b) in enumerate(C):
        x = 8 + (i % 2) * 507; y = 156 + (i // 2) * 196
        box(q, x, y, 501, 190, CARD); box(q, x, y, 501, 24, col)
        box(q, x, y + 24, 501, 2, (10, 14, 22))
        txt(q, x + 7, y + 2, reg, 3, (252, 252, 252), 487)
        art(q, i, x + 40, y + 30)
        txt(q, x + 7, y + 108, head, 4, INK, 487)
        txt(q, x + 7, y + 140, a, 3, SUB, 487)
        txt(q, x + 7, y + 164, b, 3, SUB, 487)
    box(q, 0, 936, W, 88, (22, 28, 42)); box(q, 0, 936, W, 3, GOLD)
    for i, s in enumerate(T):
        box(q, 10, 944 + i * 25, 10, 10, GOLD)
        txt(q, 30, 941 + i * 25, s, 3, INK, 990)
    d = os.environ.get("MAKEFUN_OUTPUT_DIR") or os.environ.get("OUT_DIR") or "/output"
    os.makedirs(d, exist_ok=True)
    raw = b"".join(b"\0" + bytes(q[j * W * 3:(j + 1) * W * 3]) for j in range(H))
    def ck(t, v): return struct.pack(">I", len(v)) + t + v + struct.pack(">I", zlib.crc32(t + v) & 0xffffffff)
    png = b"\x89PNG\r\n\x1a\n" + ck(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0)) + ck(b"IDAT", zlib.compress(raw, 9)) + ck(b"IEND", b"")
    open(os.path.join(d, "entry.png"), "wb").write(png)
if __name__ == "__main__": main()
