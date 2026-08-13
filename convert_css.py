import os

with open('src/style.css', 'r', encoding='utf-8') as f:
    content = f.read()

scss_content = ".legacy-home {\n" + content + "\n}\n"

with open('src/pages/Home.scss', 'w', encoding='utf-8') as f:
    f.write(scss_content)

print("Converted style.css to Home.scss")
