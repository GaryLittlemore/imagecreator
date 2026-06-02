// DOM Elements
const playerUpload = document.getElementById('playerUpload');
const badgeUpload = document.getElementById('badgeUpload');
const playerPreview = document.getElementById('playerPreview');
const badgePreview = document.getElementById('badgePreview');
const playerName = document.getElementById('playerName');
const clubName = document.getElementById('clubName');
const sponsor = document.getElementById('sponsor');
const textColor = document.getElementById('textColor');
const fontSize = document.getElementById('fontSize');
const fontSizeValue = document.getElementById('fontSizeValue');
const generateBtn = document.getElementById('generateBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('outputCanvas');
const canvasPlaceholder = document.getElementById('canvasPlaceholder');
const ctx = canvas.getContext('2d');

// State
let playerImage = null;
let badgeImage = null;

// Update font size display
fontSize.addEventListener('input', () => {
    fontSizeValue.textContent = `${fontSize.value}px`;
});

// Handle image uploads
function handleImageUpload(event, previewElement, isPlayer) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            if (isPlayer) {
                playerImage = img;
            } else {
                badgeImage = img;
            }
            previewElement.innerHTML = '';
            previewElement.appendChild(img);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

playerUpload.addEventListener('change', (e) => handleImageUpload(e, playerPreview, true));
badgeUpload.addEventListener('change', (e) => handleImageUpload(e, badgePreview, false));

// Generate the composite image
function generateImage() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fill with dark background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player image if available
    if (playerImage) {
        // Center and fit the player image (cover style)
        const scale = Math.max(canvas.width / playerImage.width, canvas.height / playerImage.height);
        const x = (canvas.width - playerImage.width * scale) / 2;
        const y = (canvas.height - playerImage.height * scale) / 2;
        ctx.drawImage(playerImage, x, y, playerImage.width * scale, playerImage.height * scale);
    }

    // Add a dark overlay for better text readability
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw badge if available (top right corner)
    if (badgeImage) {
        const badgeSize = 150;
        const badgeX = canvas.width - badgeSize - 40;
        const badgeY = 40;
        
        // Draw white circle behind badge
        ctx.beginPath();
        ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2 + 10, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(badgeX + badgeSize/2, badgeY + badgeSize/2, badgeSize/2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(badgeImage, badgeX, badgeY, badgeSize, badgeSize);
        ctx.restore();
    }

    // Configure text
    const font = `600 ${fontSize.value}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    ctx.font = font;
    ctx.fillStyle = textColor.value;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    // Draw text with shadow for readability
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    const startY = canvas.height - 220;
    const lineHeight = parseInt(fontSize.value) * 1.3;

    // Player name
    if (playerName.value) {
        ctx.fillText(playerName.value.toUpperCase(), 40, startY);
    }

    // Club name
    if (clubName.value) {
        ctx.fillText(clubName.value.toUpperCase(), 40, startY + lineHeight);
    }

    // Sponsor
    if (sponsor.value) {
        ctx.fillText(sponsor.value.toUpperCase(), 40, startY + lineHeight * 2);
    }

    // Reset shadow
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Hide placeholder and enable download
    canvasPlaceholder.style.display = 'none';
    downloadBtn.disabled = false;
}

generateBtn.addEventListener('click', generateImage);

// Download the image
downloadBtn.addEventListener('click', function() {
    const link = document.createElement('a');
    link.download = `image-creator-pro-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Set default text values for demo
playerName.value = 'LIONEL MESSI';
clubName.value = 'INTER MIAMI CF';
sponsor.value = 'ADIDAS';

// Generate a default image on load
window.addEventListener('load', () => {
    // Create default player image (gradient placeholder)
    playerImage = new Image();
    playerImage.onload = generateImage;
    playerImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA4MCIgaGVpZ2h0PSIxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iZyIgcng9IjUwJSIgcnk9IjUwJSI+PHN0b3Agc3RvcC1jb2xvcj0iIzNiODJmNiIgb2Zmc2V0PSIwJSIvPjxzdG9wIHN0b3AtY29sb3I9IiM4YjVjZjYiIG9mZnNldD0iMTAwJSIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InVybCgjZykiLz48cGF0aCBkPSJNNTQwIDM0MEw0NDAgNTQwTDU0MCA3NDBMNjQwIDU0MFoiIGZpbGw9IiNmZmYiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==';

    // Create default badge image
    badgeImage = new Image();
    badgeImage.onload = generateImage;
    badgeImage.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI3NSIgY3k9Ijc1IiByPSI2NSIgZmlsbD0iI2ZmZiIvPjxjaXJjbGUgY3g9Ijc1IiBjeT0iNzUiIHI9IjUwIiBmaWxsPSIjM2I4MmY2Ii8+PHBhdGggZD0iTTU1IDEwMEg5NVY1MEg1NVoiIGZpbGw9IiNmZmYiLz48dGV4dCB4PSI3NSIgeT0iNzUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiNmZmYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCI+QkFER0U8L3RleHQ+PC9zdmc+';

    // Update previews
    playerPreview.innerHTML = '<img src="' + playerImage.src + '" alt="Default player">';
    badgePreview.innerHTML = '<img src="' + badgeImage.src + '" alt="Default badge">';
});
