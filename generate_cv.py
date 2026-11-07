"""Script to generate a valid, clean, professional cv.pdf for Maria Hayet Puthi"""

def create_pdf(filename="cv.pdf"):
    objects = []
    
    # Obj 1: Catalog
    objects.append("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n")
    # Obj 2: Pages
    objects.append("2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n")
    # Obj 3: Page
    objects.append("3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n")
    # Obj 4: Font Bold
    objects.append("4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n")
    # Obj 5: Font Regular
    objects.append("5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n")
    
    # Stream content
    stream_lines = [
        "BT",
        "/F1 22 Tf 50 790 Td (MARIA HAYET PUTHI) Tj",
        "/F2 10 Tf 0 -18 Td (Dhaka, Bangladesh | Phone: +880 1609651151 | Email: mariaputhi014@gmail.com) Tj",
        "0 -14 Td (GitHub: https://github.com/mariaputhi014-max) Tj",
        "",
        "/F1 12 Tf 0 -26 Td (CAREER OBJECTIVE) Tj",
        "/F2 9.5 Tf 0 -15 Td (Final-year Computer Science and Engineering student at American International University-Bangladesh) Tj",
        "0 -13 Td (with practical experience in full-stack web development, database design, and AI-assisted software) Tj",
        "0 -13 Td (development workflows. Passionate about building scalable, real-world web applications.) Tj",
        "",
        "/F1 12 Tf 0 -24 Td (EDUCATION) Tj",
        "/F1 10 Tf 0 -15 Td (Bachelor of Science in Computer Science and Engineering) Tj",
        "/F2 9.5 Tf 0 -13 Td (American International University-Bangladesh (AIUB) | 2023 - 2027 (Expected) | CGPA: 3.61 / 4.00) Tj",
        "0 -12 Td (Relevant Coursework: Data Structures & Algorithms, OOP, Database Systems, Web Technologies,) Tj",
        "0 -12 Td (Software Engineering, Computer Networks) Tj",
        "/F1 10 Tf 0 -15 Td (Higher Secondary Certificate (HSC)) Tj",
        "/F2 9.5 Tf 0 -13 Td (Baliakandi Government College, Dhaka | 2021 | GPA: 5.00 / 5.00) Tj",
        "/F1 10 Tf 0 -15 Td (Secondary School Certificate (SSC)) Tj",
        "/F2 9.5 Tf 0 -13 Td (Balikandi Pilot Govt. Girls High School, Dhaka | 2019 | GPA: 5.00 / 5.00) Tj",
        "",
        "/F1 12 Tf 0 -24 Td (TECHNICAL SKILLS) Tj",
        "/F1 9.5 Tf 0 -15 Td (Programming Languages: ) Tj /F2 9.5 Tf 135 0 Td (Python, JavaScript) Tj",
        "/F1 9.5 Tf -135 -13 Td (Frontend Development: ) Tj /F2 9.5 Tf 135 0 Td (HTML5, CSS3, React.js) Tj",
        "/F1 9.5 Tf -135 -13 Td (Backend Development: ) Tj /F2 9.5 Tf 135 0 Td (Node.js, Python) Tj",
        "/F1 9.5 Tf -135 -13 Td (Database Management: ) Tj /F2 9.5 Tf 135 0 Td (MySQL, Supabase) Tj",
        "/F1 9.5 Tf -135 -13 Td (Development Tools: ) Tj /F2 9.5 Tf 135 0 Td (Git, GitHub, VS Code) Tj",
        "/F1 9.5 Tf -135 -13 Td (AI-Assisted Development: ) Tj /F2 9.5 Tf 135 0 Td (ChatGPT, Claude (code generation, debugging, documentation)) Tj",
        "",
        "/F1 12 Tf -135 -24 Td (FEATURED PROJECTS) Tj",
        "/F1 10 Tf 0 -15 Td (1. ShareMeal - Food Donation and Distribution Platform) Tj",
        "/F2 9 Tf 0 -13 Td (Individual Full-Stack Project | Tech: HTML, CSS, React, Node.js, MySQL) Tj",
        "0 -12 Td (- Designed & developed complete web platform connecting food donors, NGOs, and volunteers.) Tj",
        "0 -11 Td (- Built role-based dashboards for 4 user types: Admin, Donor, NGO, Volunteer.) Tj",
        "0 -11 Td (- Designed MySQL database schema to handle donation records, user roles, and distribution logs.) Tj",
        "0 -11 Td (- Implemented responsive React frontend and RESTful Node.js backend logic.) Tj",
        "",
        "/F1 10 Tf 0 -16 Td (2. Skill Binimoy - Skill Sharing Platform) Tj",
        "/F2 9 Tf 0 -13 Td (Academic Course Project | Tech: React, Python, Supabase, JavaScript) Tj",
        "0 -12 Td (- Developed a community skill-exchange application for users to share and acquire expertise.) Tj",
        "0 -11 Td (- Built intuitive interactive React frontend; integrated Python backend with Supabase.) Tj",
        "0 -11 Td (- Handled real-time data synchronization, live updates, and user authentication.) Tj",
        "",
        "/F1 12 Tf 0 -24 Td (KEY STRENGTHS & LANGUAGES) Tj",
        "/F2 9.5 Tf 0 -14 Td (- Strong foundation in full-stack web development with end-to-end project execution.) Tj",
        "0 -12 Td (- Practical, hands-on experience integrating AI tools (ChatGPT, Claude) for efficient development.) Tj",
        "0 -12 Td (- Version control proficiency with Git & GitHub workflow.) Tj",
        "0 -12 Td (- Languages: Bangla (Native), English (Fluent)) Tj",
        "ET"
    ]
    
    stream_content = "\n".join(stream_lines).encode("latin1")
    stream_obj = f"6 0 obj\n<< /Length {len(stream_content)} >>\nstream\n".encode("latin1") + stream_content + b"\nendstream\nendobj\n"
    
    header = b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n"
    
    body = b""
    offsets = []
    
    current_offset = len(header)
    for obj_str in objects:
        offsets.append(current_offset)
        b_obj = obj_str.encode("latin1")
        body += b_obj
        current_offset += len(b_obj)
        
    offsets.append(current_offset)
    body += stream_obj
    current_offset += len(stream_obj)
    
    xref_offset = current_offset
    xref = f"xref\n0 {len(offsets) + 1}\n0000000000 65535 f \n"
    for o in offsets:
        xref += f"{o:010d} 00000 n \n"
        
    trailer = f"trailer\n<< /Size {len(offsets) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n"
    
    full_pdf = header + body + xref.encode("latin1") + trailer.encode("latin1")
    
    with open(filename, "wb") as f:
        f.write(full_pdf)
    print(f"Generated {filename} successfully ({len(full_pdf)} bytes)")

if __name__ == "__main__":
    create_pdf()

