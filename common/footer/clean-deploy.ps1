# Clean Footer Deployment Script with Proper Emoji Encoding
# This script removes all existing footer content and redeploys with correct encoding

param(
    [switch]$DryRun,
    [string]$TargetDirectory = "D:\work\Tar\PROJECTS\CALCULATOR\_public_html",
    [switch]$Backup = $true
)

Write-Host "Clean Footer Deployment Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan

# Define paths
$footerDir = Join-Path $TargetDirectory "common\footer"

# Newsletter Bar Content (with proper HTML entities)
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

# Footer Content (with proper HTML entities)
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

# Request Modal Content (with proper HTML entities)
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
                        <input 
                            type="text" 
                            id="userName"
                            class="form-input"
                            x-model="formData.name"
                            required
                            placeholder="What should we call you?"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="userEmail">Email Address *</label>
                        <input 
                            type="email" 
                            id="userEmail"
                            class="form-input"
                            x-model="formData.email"
                            required
                            placeholder="your@email.com"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="requestType">What Kind of Request? *</label>
                        <select 
                            id="requestType"
                            class="form-input form-select"
                            x-model="formData.type"
                            required
                        >
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
                        <input 
                            type="text" 
                            id="calculatorTitle"
                            class="form-input"
                            x-model="formData.title"
                            required
                            placeholder="e.g., 'Should I Call In Sick Calculator', 'Pizza vs Ramen Budget Optimizer'"
                        >
                    </div>

                    <div class="form-group">
                        <label class="form-label" for="description">Tell Us About Your Idea! *</label>
                        <textarea 
                            id="description"
                            class="form-input form-textarea"
                            x-model="formData.description"
                            required
                            placeholder="Describe your calculator idea! What would it calculate? What inputs would users enter? What would be the fun/practical output? Be as creative as you want - the weirder, the better!"
                        ></textarea>
                    </div>

                    <div class="form-actions">
                        <button 
                            type="button" 
                            class="btn btn-secondary"
                            @click="closeModal()"
                        >
                            Maybe Later
                        </button>
                        <button 
                            type="submit" 
                            class="btn btn-primary"
                            :disabled="isSubmitting"
                        >
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
                <button 
                    class="btn btn-primary"
                    @click="closeModal()"
                    style="width: 100%;"
                >
                    &#127919; Close & Keep Calculating!
                </button>
            </div>
        </div>
    </div>
</div>
'@

# Find all HTML files to process
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

Write-Host "Found $($htmlFiles.Count) HTML files to clean and redeploy:" -ForegroundColor Green
foreach ($file in $htmlFiles) {
    $relativePath = $file.FullName.Replace($TargetDirectory, "").TrimStart('\')
    Write-Host "  FILE: $relativePath" -ForegroundColor Gray
}

if ($DryRun) {
    Write-Host ""
    Write-Host "DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "This will CLEAN and REDEPLOY footer with proper encoding."
Write-Host "Press Enter to continue or Ctrl+C to cancel..."
Read-Host

$processedCount = 0
$errorCount = 0

foreach ($file in $htmlFiles) {
    try {
        Write-Host ""
        Write-Host "Processing: $($file.Name)" -ForegroundColor Cyan
        
        # Create backup if requested
        if ($Backup -and -not $DryRun) {
            $backupPath = $file.FullName + ".backup-" + (Get-Date -Format "yyyyMMdd-HHmmss")
            Copy-Item $file.FullName $backupPath
            Write-Host "  BACKUP: Created backup file" -ForegroundColor Gray
        }
        
        # Read the current file
        $content = Get-Content $file.FullName -Raw -Encoding UTF8
        $modified = $false
        
        # 1. Remove any existing footer content
        if ($content -match '<!-- Newsletter Bar -->.*?</body>') {
            $content = $content -replace '<!-- Newsletter Bar -->.*?</body>', '</body>'
            Write-Host "  REMOVE: Old footer content" -ForegroundColor Red
            $modified = $true
        }
        
        # 2. Ensure CSS and JS links are present
        $isMainPage = $file.Name -eq "index.html" -and $file.Directory.FullName -eq $TargetDirectory
        if ($isMainPage) {
            $cssLink = '    <link rel="stylesheet" href="common/footer/premium-footer.css">'
            $jsLink = '    <script src="common/footer/premium-footer.js"></script>'
        } else {
            $cssLink = '    <link rel="stylesheet" href="../../common/footer/premium-footer.css">'
            $jsLink = '    <script src="../../common/footer/premium-footer.js"></script>'
        }
        
        # Add CSS and JS if missing
        if ($content -notmatch "premium-footer\.css") {
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$cssLink`n</head>"
                Write-Host "  ADD: CSS link" -ForegroundColor Green
                $modified = $true
            }
        }
        
        if ($content -notmatch "premium-footer\.js") {
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$jsLink`n</head>"
                Write-Host "  ADD: JS link" -ForegroundColor Green
                $modified = $true
            }
        }
        
        # 3. Ensure Alpine.js and Inter font
        if ($content -notmatch "alpinejs") {
            $alpineScript = '    <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>'
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$alpineScript`n</head>"
                Write-Host "  ADD: Alpine.js CDN" -ForegroundColor Green
                $modified = $true
            }
        }
        
        if ($content -notmatch "fonts\.googleapis\.com.*Inter") {
            $fontLink = '    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">'
            if ($content -match '</head>') {
                $content = $content -replace '</head>', "$fontLink`n</head>"
                Write-Host "  ADD: Inter font" -ForegroundColor Green
                $modified = $true
            }
        }
        
        # 4. Ensure body has Alpine.js data
        if ($content -match '<body[^>]*>') {
            $bodyTag = $matches[0]
            if ($bodyTag -notmatch 'x-data') {
                $newBodyTag = $bodyTag -replace '<body', '<body x-data="{ showModal: false }"'
                $content = $content -replace [regex]::Escape($bodyTag), $newBodyTag
                Write-Host "  UPDATE: Body tag with Alpine.js data" -ForegroundColor Green
                $modified = $true
            }
        }
        
        # 5. Add clean footer content
        if ($content -match '</body>') {
            $cleanFooterContent = "`n$newsletterBarContent`n`n$footerContent`n`n$requestModalContent`n`n</body>"
            $content = $content -replace '</body>', $cleanFooterContent
            Write-Host "  ADD: Clean footer with proper encoding" -ForegroundColor Green
            $modified = $true
        }
        
        # Save the file
        if ($modified -and -not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
            Write-Host "  SUCCESS: File cleaned and redeployed!" -ForegroundColor Green
            $processedCount++
        } elseif ($modified -and $DryRun) {
            Write-Host "  PREVIEW: Would clean and redeploy (DRY RUN)" -ForegroundColor Yellow
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
Write-Host "CLEAN DEPLOYMENT SUMMARY" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "Files processed: $processedCount" -ForegroundColor Green
Write-Host "Errors: $errorCount" -ForegroundColor Red

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a DRY RUN - no files were actually modified" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Clean footer deployment complete!" -ForegroundColor Green
    Write-Host "All pages should now have proper emojis and styling!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host
