#!/usr/bin/env python3
"""
Automated Theme Refactoring Script
Replaces hardcoded hex colors with Obsidian theme variables across all components.
"""

import os
import re
from pathlib import Path

# Color mapping from hex codes to theme variables
COLOR_MAPPINGS = {
    # Primary colors
    '#10D9A5': 'primary',
    '#0DB88E': 'primary-dark',
    '#5FE8C5': 'primary-light',
    
    # Background colors
    '#0F1E1C': 'background-primary',
    '#1A2E2A': 'background-secondary',
    '#243832': 'background-tertiary',
    '#1C2B3A': 'background-dark',
    
    # Status colors
    '#E74C3C': 'status-missed',
    '#FF8A3D': 'status-next',
    '#F39C12': 'status-warning',
    
    # Text colors
    '#FFFFFF': 'text-primary',
    '#A0AEC0': 'text-secondary',
    '#718096': 'text-tertiary',
    
    # UI colors
    '#2D3748': 'ui-border',
    '#2A3F3B': 'ui-input',
    '#4A5568': 'ui-iconSecondary',
    
    # Common variations
    'white': 'text-primary',
    '#FFF': 'text-primary',
    '#fff': 'text-primary',
}

# Additional patterns for background colors with opacity
BG_OPACITY_PATTERNS = [
    (r'bg-\[#10D9A5\]/(\d+)', r'bg-primary/\1'),
    (r'bg-\[#1A3D2E\]', 'bg-primary/20'),
    (r'bg-\[#3D2F1F\]', 'bg-status-next/20'),
    (r'bg-\[#3D2626\]', 'bg-status-missed/20'),
]

def replace_colors_in_file(file_path):
    """Replace hardcoded colors with theme variables in a single file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes_made = 0
        
        # Replace hex colors in className attributes
        for hex_color, theme_var in COLOR_MAPPINGS.items():
            # Pattern for text-[#HEX] or bg-[#HEX] or border-[#HEX]
            pattern = rf'(text|bg|border)-\[{re.escape(hex_color)}\]'
            replacement = rf'\1-{theme_var}'
            new_content, count = re.subn(pattern, replacement, content, flags=re.IGNORECASE)
            if count > 0:
                content = new_content
                changes_made += count
        
        # Replace special background opacity patterns
        for pattern, replacement in BG_OPACITY_PATTERNS:
            new_content, count = re.subn(pattern, replacement, content)
            if count > 0:
                content = new_content
                changes_made += count
        
        # Replace 'white' in className (but be careful not to replace in strings)
        content = re.sub(r'className="([^"]*)\btext-white\b([^"]*)"', 
                        r'className="\1text-text-primary\2"', content)
        
        # Write back if changes were made
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return changes_made
        
        return 0
    
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return 0

def process_directory(directory):
    """Process all .tsx and .ts files in a directory recursively."""
    total_files = 0
    total_changes = 0
    
    for root, dirs, files in os.walk(directory):
        # Skip node_modules and other irrelevant directories
        dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.expo', 'build', 'dist']]
        
        for file in files:
            if file.endswith(('.tsx', '.ts')) and not file.endswith('.d.ts'):
                file_path = os.path.join(root, file)
                changes = replace_colors_in_file(file_path)
                if changes > 0:
                    total_files += 1
                    total_changes += changes
                    print(f"✓ {file_path}: {changes} replacements")
    
    return total_files, total_changes

if __name__ == "__main__":
    # Get the project root directory
    script_dir = Path(__file__).parent
    project_root = script_dir.parent.parent.parent  # Go up to Medmind root
    src_dir = project_root / "src"
    
    print("=" * 60)
    print("Obsidian Theme Refactoring Script")
    print("=" * 60)
    print(f"Processing directory: {src_dir}")
    print()
    
    files_modified, total_replacements = process_directory(str(src_dir))
    
    print()
    print("=" * 60)
    print(f"✅ Complete!")
    print(f"Files modified: {files_modified}")
    print(f"Total replacements: {total_replacements}")
    print("=" * 60)
