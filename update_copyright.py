import os

files = [
    r"terms\index.html",
    r"submission\index.html",
    r"privacy\index.html",
    r"index.html",
    r"dmca\index.html",
    r"contact\index.html",
    r"about\index.html"
]

target = "2025 TribleTunes"
replacement = "2026 TribleTunes"

base_dir = r"c:\Users\jassi\tribletunes.com\TribleTunes1"

for file_path in files:
    full_path = os.path.join(base_dir, file_path)
    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if target in content:
            new_content = content.replace(target, replacement)
            with open(full_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {file_path}")
        else:
            print(f"Target not found in {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
