# Simple Footer Cleanup Script
# This script removes ALL footer content and redeploys clean

param(
    [switch]$DryRun,
    [string]$TargetDirectory = "D:\work\Tar\PROJECTS\CALCULATOR\_public_html",
    [switch]$Backup = $true
)

Write-Host "Simple Footer Cleanup Script" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan

# Clean Newsletter Bar Content
$newsletterBarContent = @'
<!-- Newsletter Bar -->
<div class="newsletter-bar" x-data="newsletterForm()">
    <div class="newsletter-container">
        <div class="newsletter-content">
            <div class="newsletter-info">
                <h3>&#127881; Join Our Calculator Community!</h3>
                <p>Get updates on new fun calculators and practical tools</p>
            </div>
            <form class="newsletter-form" @submit.prevent="submitNewsletter()" x-show="!showSuccess">
                <input 
                    type="email" 
                    class="newsletter-input"
                    placeholder="Enter your email for calculator updates"
                    x-model="email"
                    required
                >
                <button 
                    type="submit" 
                    class="newsletter-submit"
                    :disabled="isSubmitting"
                >
                    <span x-show="isSubmitting" class="loading-spinner"></span>
                    <span x-text="isSubmitting ? 'Subscribing...' : '&#128640; Subscribe'"></span>
                </button>
            </form>
            <div x-show="showSuccess" class="newsletter-success" style="display: none;">
                <p style="color: var(--accent-light); font-weight: 600;">
                    &#9989; Awesome! You'll get updates on the coolest new calculators!
                </p>
            </div>
        </div>
    </div>
</div>
'@

# Clean Footer Content
$footerContent = @'
<!-- Footer -->
<footer class="footer">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-section">
                <h4>&#127919; About Docket.One</h4>
                <p>Making life easier (and more fun) with calculators that actually matter. From figuring out if you should buy a car or just Uber everywhere, to calculating your caffeine half-life, we've got the tools for modern life.</p>
                <p>Practical meets playful. Because adulting is hard enough.</p>
            </div>

            <div class="footer-section">
                <h4>&#127914; Calculator Categories</h4>
                <ul class="footer-links">
                    <li><a href="/pages/BigKidMath/"><span class="calculator-emoji">&#129518;</span> BigKidMath - Adult Life Tools</a></li>
                    <li><a href="/pages/CipherLab/"><span class="calculator-emoji">&#128272;</span> CipherLab - Secret Codes & Security</a></li>
                    <li><a href="/pages/GeekGalaxy/"><span class="calculator-emoji">&#128640;</span> GeekGalaxy - Sci-Fi & Fantasy Fun</a></li>
                    <li><a href="/pages/LifeHacks/"><span class="calculator-emoji">&#9889;</span> LifeHacks - Productivity & Wellness</a></li>
                    <li><a href="/pages/Math_Magik/"><span class="calculator-emoji">&#127917;</span> Math Magik - Mathematical Wizardry</a></li>
                    <li><a href="/pages/Otaku_Ops/"><span class="calculator-emoji">&#127999;</span> Otaku Ops - Anime & Culture</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>&#128172; Support & Info</h4>
                <ul class="footer-links">
                    <li><a href="/help"><span class="calculator-emoji">&#10067;</span> Help & FAQ</a></li>
                    <li><a href="/privacy"><span class="calculator-emoji">&#128274;</span> Privacy Policy</a></li>
                    <li><a href="/terms"><span class="calculator-emoji">&#128203;</span> Terms of Service</a></li>
                    <li><a href="/accessibility"><span class="calculator-emoji">&#9855;</span> Accessibility</a></li>
                    <li><a href="/contact"><span class="calculator-emoji">&#128231;</span> Contact Us</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <button 
                    class="request-calculator-btn"
                    @click="showModal = true"
                >
                    &#128161; Request a Calculator
                </button>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-logo">&#129518; Docket.One</div>
            <div class="footer-copyright">
                © 2025 Docket.One. All rights reserved. Making calculations fun since... well, recently!
            </div>
            <div class="social-links">
                <a href="#" class="social-link" aria-label="Twitter">&#120143;</a>
                <a href="#" class="social-link" aria-label="LinkedIn">&#128188;</a>
                <a href="#" class="social-link" aria-label="GitHub">&#128025;</a>
                <a href="#" class="social-link" aria-label="Email">&#128231;</a>
            </div>
        </div>
    </div>
</footer>
'@

# Clean Request Modal Content
$requestModalContent = @'
<!-- Request Modal -->
<div 
    x-data="calculatorRequestForm()"
    x-show="showModal"
    x-cloak
    class="modal-overlay"
    @click.self="closeModal()"
    style="display: none;"
>
    <div class="modal-content">
        <div x-show="!showConfirmation">
            <div class="modal-header">
                <h2 class="modal-title">&#128161; Request a Fun Calculator</h2>
                <p class="modal-subtitle">Got an idea for a calculator that would make life easier or more fun? We want to hear it!</p>
                <button class="modal-close" @click="closeModal()">&#10005;</button>
            </div>
            <div class="modal-body">
                <form @submit.prevent="submitRequest()">
                    <div class="form-group">
                        <label class="form-label" for="userName">Your Name *</label>
                        <input type="text" id="userName" class="form-input" x-model="formData.name" required placeholder="What should we call you?">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="userEmail">Email Address *</label>
                        <input type="email" id="userEmail" class="form-input" x-model="formData.email" required placeholder="your@email.com">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="requestType">What Kind of Request? *</label>
                        <select id="requestType" class="form-input form-select" x-model="formData.type" required>
                            <option value="">Choose your request type</option>
                            <option value="new-calculator">&#127358; Brand New Calculator</option>
                            <option value="enhancement">&#9889; Improve Existing Calculator</option>
                            <option value="category">&#127914; New Category Idea</option>
                            <option value="feature">&#10024; Cool New Feature</option>
                            <option value="other">&#129300; Something Else Entirely</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="calculatorTitle">Calculator Name/Title *</label>
                        <input type="text" id="calculatorTitle" class="form-input" x-model="formData.title" required placeholder="e.g., 'Should I Call In Sick Calculator'">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="description">Tell Us About Your Idea! *</label>
                        <textarea id="description" class="form-input form-textarea" x-model="formData.description" required placeholder="Describe your calculator idea!"></textarea>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" @click="closeModal()">Maybe Later</button>
                        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                            <span x-show="isSubmitting" class="loading-spinner"></span>
                            <span x-text="isSubmitting ? 'Sending...' : '&#128640; Send My Idea'"></span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
        <div x-show="showConfirmation" class="confirmation-modal" style="display: none;">
            <div class="modal-header">
                <button class="modal-close" @click="closeModal()">&#10005;</button>
            </div>
            <div class="modal-body">
                <div class="success-icon">&#127881;</div>
                <h3 class="confirmation-title">Awesome! We Got Your Idea!</h3>
                <p class="confirmation-message">
                    Thanks for sharing your calculator idea with us! We're excited to check it out and see if we can make it happen. 
                    <br><br>
                    <strong>What happens next?</strong><br>
                    • You'll get a confirmation email shortly<br>
                    • Our team will review your idea<br>
                    • If we build it, you'll be the first to know!<br>
                    • We might even name you as the inspiration &#128522;
                </p>
                <button class="btn btn-primary" @click="closeModal()" style="width: 100%;">
                    &#127919; Close & Keep Calculating!
                </button>
            </div>
        </div>
    </div>
</div>
'@

# Find all HTML files
$htmlFiles = @()
$mainIndexFile = Join-Path $TargetDirectory "index.html"
if (Test-Path $mainIndexFile) {
    $htmlFiles += Get-Item $mainIndexFile
}

$pagesDir = Join-Path $TargetDirectory "pages"
if (Test-Path $pagesDir) {
    $calculatorFiles = Get-ChildItem -Path $pagesDir -Recurse -Filter "*.html" | Where-Object {
        $_.FullName -notmatch "backup|test|temp" -and
        $_.Directory.Name -in @("BigKidMath", "CipherLab", "GeekGalaxy", "LifeHacks", "Math_Magik", "Otaku_Ops")
    }
    $htmlFiles += $calculatorFiles
}

Write-Host "Found $($htmlFiles.Count) HTML files to clean:" -ForegroundColor Green

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
        
        # Create backup
        if ($Backup -and -not $DryRun) {
            $backupPath = $file.FullName + ".simple-backup-" + (Get-Date -Format "yyyyMMdd-HHmmss")
            Copy-Item $file.FullName $backupPath
            Write-Host "  BACKUP: Created backup" -ForegroundColor Gray
        }
        
        # Read file
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $originalContent = $content
        
        # Find the last meaningful content before any footer
        $contentLines = $content -split "`n"
        $cleanLines = @()
        $inFooterSection = $false
        
        foreach ($line in $contentLines) {
            # Check if we're entering footer section
            if ($line -match "Newsletter Bar|newsletter-bar|<footer|modal-overlay|calculatorRequestForm") {
                $inFooterSection = $true
                continue
            }
            
            # If we hit </body> without being in footer, we need to stop before it
            if ($line -match "</body>" -and -not $inFooterSection) {
                break
            }
            
            # If we're not in footer section, keep the line
            if (-not $inFooterSection) {
                $cleanLines += $line
            }
        }
        
        # Rebuild content
        $content = $cleanLines -join "`n"
        
        # Make sure we end properly (without </body> for now)
        $content = $content.TrimEnd()
        
        # Ensure CSS and JS links
        $isMainPage = $file.Name -eq "index.html" -and $file.Directory.FullName -eq $TargetDirectory
        if ($isMainPage) {
            $cssLink = '    <link rel="stylesheet" href="common/footer/premium-footer.css">'
            $jsLink = '    <script src="common/footer/premium-footer.js"></script>'
        } else {
            $cssLink = '    <link rel="stylesheet" href="../../common/footer/premium-footer.css">'
            $jsLink = '    <script src="../../common/footer/premium-footer.js"></script>'
        }
        
        if ($content -notmatch "premium-footer\.css") {
            $content = $content -replace '</head>', "$cssLink`n</head>"
            Write-Host "  ADD: CSS link" -ForegroundColor Green
        }
        
        if ($content -notmatch "premium-footer\.js") {
            $content = $content -replace '</head>', "$jsLink`n</head>"
            Write-Host "  ADD: JS link" -ForegroundColor Green
        }
        
        # Ensure Alpine.js and Inter font
        if ($content -notmatch "alpinejs") {
            $alpineScript = '    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>'
            $content = $content -replace '</head>', "$alpineScript`n</head>"
            Write-Host "  ADD: Alpine.js CDN" -ForegroundColor Green
        }
        
        if ($content -notmatch "fonts\.googleapis\.com.*Inter") {
            $fontLink = '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
            $content = $content -replace '</head>', "$fontLink`n</head>"
            Write-Host "  ADD: Inter font" -ForegroundColor Green
        }
        
        # Ensure body has Alpine.js data
        if ($content -match '<body[^>]*>') {
            $bodyTag = $matches[0]
            if ($bodyTag -notmatch 'x-data') {
                $newBodyTag = $bodyTag -replace '<body', '<body x-data="{ showModal: false }"'
                $content = $content -replace [regex]::Escape($bodyTag), $newBodyTag
                Write-Host "  UPDATE: Body tag with Alpine.js data" -ForegroundColor Green
            }
        }
        
        # Add clean footer and close body
        $cleanFooterContent = "`n$newsletterBarContent`n`n$footerContent`n`n$requestModalContent`n`n</body>`n</html>"
        $content += $cleanFooterContent
        Write-Host "  ADD: Clean footer" -ForegroundColor Green
        
        # Save file
        if (-not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  SUCCESS: File cleaned!" -ForegroundColor Green
            $processedCount++
        } else {
            Write-Host "  PREVIEW: Would clean this file (DRY RUN)" -ForegroundColor Yellow
            $processedCount++
        }
        
    } catch {
        Write-Host "  ERROR: $($_.Exception.Message)" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host ""
Write-Host "SIMPLE CLEANUP SUMMARY" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan
Write-Host "Files processed: $processedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor Red

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a DRY RUN - no files were actually modified" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Simple cleanup complete!" -ForegroundColor Green
    Write-Host "Footer should now be clean and working!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
