# PowerShell script to standardize fonts across all TypeScript/TSX files
# Removes VT323 and Press Start 2P inline styles, using Poppins as default

Write-Host "🎨 PharmLife Font Consistency Fixer" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# Define file patterns to process
$files = @(
    "src\stages\Typing\Typing.tsx",
    "src\stages\Receiving\Receiving.tsx",
    "src\stages\Receiving\ReceivingEnhanced.tsx",
    "src\stages\Dispensing\Dispensing.tsx",
    "src\screens\About.tsx",
    "src\screens\YearSelection.tsx",
    "src\components\Button.tsx",
    "src\components\Modal.tsx",
    "src\components\HUD.tsx"
)

$replacements = @(
    # Remove VT323 font family styles
    @{
        Pattern = "style=\{\{\s*fontFamily:\s*['""]'VT323',\s*monospace['""],?\s*(?:fontSize:\s*['""]?\w+['""]?,?\s*)?\}\}"
        Replacement = ""
        Description = "Removing VT323 inline font styles"
    },
    @{
        Pattern = "\s*fontFamily:\s*['""]'VT323',\s*monospace['""],?"
        Replacement = ""
        Description = "Removing VT323 from style objects"
    },
    # Remove Press Start 2P font family styles (except for game titles)
    @{
        Pattern = "style=\{\{\s*fontFamily:\s*['""]'Press Start 2P',\s*monospace['""],?\s*(?:fontSize:\s*['""]?\w+['""]?,?\s*)?(?:lineHeight:\s*['""]?[\d\.]+['""]?,?\s*)?\}\}"
        Replacement = ""
        Description = "Removing Press Start 2P inline font styles"
    },
    @{
        Pattern = "\s*fontFamily:\s*['""]'Press Start 2P',\s*monospace['""],?"
        Replacement = ""
        Description = "Removing Press Start 2P from style objects"
    }
)

foreach ($file in $files) {
    $filePath = Join-Path $PSScriptRoot $file
    
    if (Test-Path $filePath) {
        Write-Host "📝 Processing: $file" -ForegroundColor Yellow
        $content = Get-Content $filePath -Raw
        $originalContent = $content
        
        foreach ($replacement in $replacements) {
            if ($content -match $replacement.Pattern) {
                $content = $content -replace $replacement.Pattern, $replacement.Replacement
                Write-Host "  ✓ $($replacement.Description)" -ForegroundColor Green
            }
        }
        
        # Clean up empty style attributes
        $content = $content -replace 'style=\{\{\s*\}\}', ''
        $content = $content -replace 'style=\{\{\s*,\s*\}\}', ''
        
        if ($content -ne $originalContent) {
            Set-Content $filePath -Value $content -NoNewline
            Write-Host "  ✅ Updated successfully" -ForegroundColor Green
        } else {
            Write-Host "  ℹ️  No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ⚠️  File not found: $file" -ForegroundColor Red
    }
    Write-Host ""
}

Write-Host "✨ Font standardization complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "- All inline VT323 fonts removed (using Poppins default)" -ForegroundColor White
Write-Host "- Press Start 2P styles removed from body text" -ForegroundColor White
Write-Host "- Use 'font-pixel' class for retro game titles only" -ForegroundColor White
Write-Host "- Default Poppins font will be used throughout" -ForegroundColor White
