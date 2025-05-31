# Footer Emoji Fix Script for Docket.One
# This script fixes corrupted emoji encoding in deployed footer files

param(
    [switch]$DryRun,
    [string]$TargetDirectory = "D:\work\Tar\PROJECTS\CALCULATOR\_public_html"
)

Write-Host "Docket.One Footer Emoji Fix Script" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Define paths
$footerDir = Join-Path $TargetDirectory "common\footer"
$newsletterBarFile = Join-Path $footerDir "newsletter-bar.html"
$footerFile = Join-Path $footerDir "footer.html"
$requestModalFile = Join-Path $footerDir "request-modal.html"

# Read the corrected footer components
$newsletterBarContent = Get-Content $newsletterBarFile -Raw
$footerContent = Get-Content $footerFile -Raw
$requestModalContent = Get-Content $requestModalFile -Raw

# Find all HTML files that have footer content
$htmlFiles = @()

# Add the main homepage
$mainIndexFile = Join-Path $TargetDirectory "index.html"
if (Test-Path $mainIndexFile) {
    $htmlFiles += Get-Item $mainIndexFile
}

# Add all calculator pages
$pagesDir = Join-Path $TargetDirectory "pages"
$calculatorFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.html" | Where-Object {
    $_.FullName -notmatch "backup|test|temp" -and
    $_.Directory.Name -in @("BigKidMath", "CipherLab", "GeekGalaxy", "LifeHacks", "Math_Magik", "Otaku_Ops")
}
$htmlFiles += $calculatorFiles

Write-Host "Found $($htmlFiles.Count) HTML files to fix:" -ForegroundColor Green
foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Replace($TargetDirectory, "").TrimStart('\')
    Write-Host "  FILE: $relativePath" -ForegroundColor Gray
}

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press Enter to continue or Ctrl+C to cancel..."
Read-Host

$processedCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    try {
        Write-Host ""
        Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
        
        # Read the current file
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        
        # Check if file has footer content with corrupted emojis
        if ($content -notmatch "newsletter-bar" -and $content -notmatch "premium-footer") {
            Write-Host "  SKIP: No footer content found" -ForegroundColor Yellow
            continue
        }
        
        $modified = $false
        
        # Remove all existing footer content between <!-- Newsletter Bar --> and </body>
        if ($content -match '<!-- Newsletter Bar -->.*?</body>') {
            Write-Host "  REMOVE: Old footer content" -ForegroundColor Red
            
            # Remove everything from Newsletter Bar comment to </body>
            $content = $content -replace '<!-- Newsletter Bar -->.*?</body>', '</body>'
            
            # Add the corrected footer components
            $newFooterContent = "`n    <!-- Newsletter Bar -->`n$newsletterBarContent`n`n    <!-- Footer -->`n$footerContent`n`n    <!-- Request Modal -->`n$requestModalContent`n`n</body>"
            $content = $content -replace '</body>', $newFooterContent
            
            $modified = $true
            Write-Host "  ADD: Corrected footer content" -ForegroundColor Green
        }
        
        # Save the modified file
        if ($modified -and -not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  SUCCESS: File fixed!" -ForegroundColor Green
            $processedCount++
        } elseif ($modified -and $DryRun) {
            Write-Host "  PREVIEW: Would fix this file (DRY RUN)" -ForegroundColor Yellow
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
Write-Host "FIX SUMMARY" -ForegroundColor Cyan
Write-Host "===========" -ForegroundColor Cyan
Write-Host "Files fixed: $processedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor Red

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a DRY RUN - no files were actually modified" -ForegroundColor Yellow
    Write-Host "Run again without -DryRun to apply fixes" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Footer emoji fix complete!" -ForegroundColor Green
    Write-Host "All emojis should now display correctly!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
