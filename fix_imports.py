import os
import re

def fix_imports(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.js', '.jsx')):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Fix cn imports
                new_content = content.replace('../../utils/cn', '../../utils')
                new_content = new_content.replace('../utils/cn', '../utils')
                
                # Fix colors imports
                new_content = new_content.replace('../../src/theme/colors', '../../src/constants/Colors')
                new_content = new_content.replace('../src/theme/colors', '../src/constants/Colors')
                new_content = new_content.replace('../../theme/colors', '../../constants/Colors')
                new_content = new_content.replace('../theme/colors', '../constants/Colors')
                
                if content != new_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")

if __name__ == "__main__":
    current_dir = os.getcwd()
    fix_imports(os.path.join(current_dir, 'src'))
    # fix_imports(os.path.join(current_dir, 'app')) # app folder doesn't exist based on list_dir, but I'll keep it commented just in case or check if it exists. 
    # Wait, looking at list_dir of root, 'app' folder IS NOT listed. The user might have meant 'app.json' or something, or it's a standard expo router folder that is missing?
    # actually list_dir showed: .expo, .git, .gitignore, ... src, docs, e2e. NO 'app' folder. 
    # So I will just run it on 'src'.
    print("Finished fixing imports.")
