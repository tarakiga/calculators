# Accessibility Fixes for Support Pages
$supportPath = "D:\work\Tar\PROJECTS\CALCULATOR\_public_html\pages\support"
Write-Host "🔧 Fixing accessibility issues in support pages..." -ForegroundColor Cyan

# Define the files to fix
$files = @("help.html", "contact.html", "privacy.html", "terms.html", "accessibility.html")

foreach ($file in $files) {
    $fullPath = Join-Path $supportPath $file
    if (Test-Path $fullPath) {
        Write-Host "Fixing $file..." -ForegroundColor Green
        
        $content = Get-Content $fullPath -Raw -Encoding UTF8
        $originalContent = $content
        
        # Fix 1: Replace low contrast opacity 0.9 with full opacity
        # The header subtitle on gradient background needs better contrast
        $content = $content -replace 'opacity: 0\.9;', 'opacity: 1.0; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);'
        
        # Fix 2: Improve footer opacity for better contrast
        $content = $content -replace 'opacity: 0\.8;', 'opacity: 1.0; color: rgba(255, 255, 255, 0.95);'
        
        # Fix 3: Add focus states where missing (for pages that don't have them)
        if ($content -notmatch ':focus' -and $file -ne "contact.html") {
            # Add focus styles for links
            $focusStyles = @"

        /* Accessibility: Focus States */
        a:focus {
            outline: 2px solid #60a5fa;
            outline-offset: 2px;
            border-radius: 2px;
        }

        button:focus {
            outline: 2px solid #60a5fa;
            outline-offset: 2px;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.3);
        }

        .contact-button:focus {
            outline: 2px solid #ffffff;
            outline-offset: 2px;
            box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.3);
        }
"@
            # Insert before the closing </style> tag
            $content = $content -replace '</style>', "$focusStyles`n    </style>"
        }
        
        if ($content -ne $originalContent) {
            # Create backup
            $backupPath = "$fullPath.backup-accessibility-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
            Copy-Item $fullPath $backupPath
            
            # Save updated content
            $content | Set-Content -Path $fullPath -Encoding UTF8 -NoNewline
            Write-Host "  ✅ Fixed contrast and focus issues" -ForegroundColor DarkGreen
            Write-Host "  💾 Backup: $(Split-Path $backupPath -Leaf)" -ForegroundColor DarkCyan
        } else {
            Write-Host "  ℹ️ No changes needed" -ForegroundColor DarkGray
        }
    }
}

Write-Host "`n✅ Accessibility fixes completed!" -ForegroundColor Green
