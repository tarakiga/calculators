# Premium Footer Auto-Deployment Script for Docket.One
# This script automatically adds the premium footer system to all calculator pages

param(
    [switch]$DryRun,
    [string]$TargetDirectory = "D:\work\Tar\PROJECTS\CALCULATOR\_public_html",
    [switch]$Backup = $true
)

Write-Host "Docket.One Footer Deployment Script" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

# Define paths
$footerDir = Join-Path $TargetDirectory "common\footer"
$newsletterBarFile = Join-Path $footerDir "newsletter-bar.html"
$footerFile = Join-Path $footerDir "footer.html"
$requestModalFile = Join-Path $footerDir "request-modal.html"

# Check if footer files exist
if (-not (Test-Path $newsletterBarFile) -or -not (Test-Path $footerFile) -or -not (Test-Path $requestModalFile)) {
    Write-Host "ERROR: Footer component files not found!" -ForegroundColor Red
    Write-Host "Make sure these files exist:" -ForegroundColor Yellow
    Write-Host "  - $newsletterBarFile"
    Write-Host "  - $footerFile" 
    Write-Host "  - $requestModalFile"
    exit 1
}

# Read footer components
$newsletterBarContent = Get-Content $newsletterBarFile -Raw
$footerContent = Get-Content $footerFile -Raw
$requestModalContent = Get-Content $requestModalFile -Raw

# Find all HTML files to process
$htmlFiles = @()

# 1. Add the main homepage
$mainIndexFile = Join-Path $TargetDirectory "index.html"
if (Test-Path $mainIndexFile) {
    $htmlFiles += Get-Item $mainIndexFile
    Write-Host "Including main homepage: index.html" -ForegroundColor Green
}

# 2. Add all calculator category pages and individual calculators
$pagesDir = Join-Path $TargetDirectory "pages"
$calculatorFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.html" | Where-Object {
    $_.FullName -notmatch "backup|test|temp" -and
    $_.Directory.Name -in @("BigKidMath", "CipherLab", "GeekGalaxy", "LifeHacks", "Math_Magik", "Otaku_Ops")
}
$htmlFiles += $calculatorFiles

Write-Host "Found $($htmlFiles.Count) HTML files to process:" -ForegroundColor Green
foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Replace($TargetDirectory, "").TrimStart('\')
    Write-Host "  FILE: $relativePath" -ForegroundColor Gray
}

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
    Write-Host "Remove -DryRun parameter to actually deploy the footer" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press Enter to continue or Ctrl+C to cancel..."
Read-Host

$processedCount = 0
$skippedCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    try {
        Write-Host ""
        Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
        
        # Read the current file
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Check if footer is already implemented
        if ($content -match "premium-footer\.css" -or $content -match "newsletter-bar") {
            Write-Host "  SKIP: Footer already exists" -ForegroundColor Yellow
            $skippedCount++
            continue
        }
        
        # Create backup if requested
        if ($Backup -and -not $DryRun) {
            $backupPath = $file.FullName + ".backup-" + (Get-Date -Format "yyyyMMdd-HHmmss")
            Copy-Item $file.FullName $backupPath
            Write-Host "  BACKUP: Created backup file" -ForegroundColor Gray
        }
        
        $modified = $false
        
        # Determine the correct relative path for CSS/JS links
        $isMainPage = $file.Name -eq "index.html" -and $file.Directory.FullName -eq $TargetDirectory
        if ($isMainPage) {
            # Main homepage - links are relative to root
            $cssLink = '    <link rel="stylesheet" href="common/footer/premium-footer.css">'
            $jsLink = '    <script src="common/footer/premium-footer.js"></script>'
        } else {
            # Calculator pages - links go up two levels
            $cssLink = '    <link rel="stylesheet" href="../../common/footer/premium-footer.css">'
            $jsLink = '    <script src="../../common/footer/premium-footer.js"></script>'
        }
        
        # 1. Add CSS and JS links to <head>
        if ($content -match '<head>') {
            $headPattern = '(<head>.*?)(</head>)'
            if ($content -match $headPattern) {
                $headContent = $matches[1]
                
                # Add CSS link if not present
                if ($headContent -notmatch "premium-footer\.css") {
                    $headContent = $headContent + "`n$cssLink"
                    $modified = $true
                    Write-Host "  ADD: CSS link" -ForegroundColor Green
                }
                
                # Add JS link if not present  
                if ($headContent -notmatch "premium-footer\.js") {
                    $headContent = $headContent + "`n$jsLink"
                    $modified = $true
                    Write-Host "  ADD: JS link" -ForegroundColor Green
                }
                
                # Replace head section
                $content = $content -replace $headPattern, ($headContent + $matches[2])
            }
        }
        
        # 2. Update <body> tag to include Alpine.js data
        if ($content -match '<body[^>]*>') {
            $bodyTag = $matches[0]
            if ($bodyTag -notmatch 'x-data') {
                $newBodyTag = $bodyTag -replace '<body', '<body x-data="{ showModal: false }"'
                $content = $content -replace [regex]::Escape($bodyTag), $newBodyTag
                $modified = $true
                Write-Host "  UPDATE: Body tag with Alpine.js data" -ForegroundColor Green
            }
        }
        
        # 3. Add footer components before closing </body>
        if ($content -match '</body>') {
            $footerComponents = "`n    <!-- Newsletter Bar -->`n$newsletterBarContent`n`n    <!-- Footer -->`n$footerContent`n`n    <!-- Request Modal -->`n$requestModalContent`n`n</body>"
            $content = $content -replace '</body>', $footerComponents
            $modified = $true
            Write-Host "  ADD: Footer components" -ForegroundColor Green
        }
        
        # 4. Ensure Alpine.js CDN is present
        if ($content -notmatch "alpinejs") {
            $alpineScript = '    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>'
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$alpineScript`n</head>"
                $modified = $true
                Write-Host "  ADD: Alpine.js CDN" -ForegroundColor Green
            }
        }
        
        # 5. Ensure Inter font is present
        if ($content -notmatch "fonts\.googleapis\.com.*Inter") {
            $fontLink = '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$fontLink`n</head>"
                $modified = $true
                Write-Host "  ADD: Inter font" -ForegroundColor Green
            }
        }
        
        # Save the modified file
        if ($modified -and -not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  SUCCESS: File updated!" -ForegroundColor Green
            $processedCount++
        } elseif ($modified -and $DryRun) {
            Write-Host "  PREVIEW: Would update this file (DRY RUN)" -ForegroundColor Yellow
            $processedCount++
        } else {
            Write-Host "  INFO: No changes needed" -ForegroundColor Gray
        }
        
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

# Summary
Write-Host ""
Write-Host "DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Files processed: $processedCount" -ForegroundColor Green
Write-Host "Files skipped: $skippedCount" -ForegroundColor Yellow
Write-Host "Errors: $errorCount" -ForegroundColor Red

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a DRY RUN - no files were actually modified" -ForegroundColor Yellow
    Write-Host "Run again without -DryRun to apply changes" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Footer deployment complete!" -ForegroundColor Green
    Write-Host "Your calculator pages now have the premium footer system!" -ForegroundColor Green
    
    if ($Backup) {
        Write-Host ""
        Write-Host "Backup files created with .backup-YYYYMMDD-HHMMSS extension" -ForegroundColor Gray
        Write-Host "You can restore from backups if needed" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
