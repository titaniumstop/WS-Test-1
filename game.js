// Game constants
const TILE_SIZE = 16;
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const GRID = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,0,1,1,1,0,0,1,1,1,0,1,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,0,1,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,0,1,1,1,1,0,1,0,0,0,0,0,0,1,0,1,1,1,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
    [1,1,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,0,1,1,1,1],
    [0,0,0,0,0,1,0,1,1,0,0,0,0,0,0,0,0,0,0,1,1,0,1,0,0,0,0,0],
    [1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Game state
const state = {
    score: 0,
    lives: 3,
    gameOver: false,
    dots: [],
    walls: [],
    player: {
        x: 14 * TILE_SIZE + TILE_SIZE/2,
        y: 23 * TILE_SIZE + TILE_SIZE/2,
        dx: 0,
        dy: 0,
        nextDir: null,
        radius: TILE_SIZE/2 - 2,
        speed: PACMAN_SPEED,
        mouthAngle: 0,
        mouthDirection: 1,
        mouthSpeed: 0.1
    },
    ghosts: [
        { x: 14 * TILE_SIZE, y: 11 * TILE_SIZE, dx: GHOST_SPEED, dy: 0, color: '#FF0000', mode: 'chase' },
        { x: 13 * TILE_SIZE, y: 14 * TILE_SIZE, dx: -GHOST_SPEED, dy: 0, color: '#FFA500', mode: 'chase' },
        { x: 14 * TILE_SIZE, y: 14 * TILE_SIZE, dx: 0, dy: 0, color: '#00FFFF', mode: 'chase' },
        { x: 15 * TILE_SIZE, y: 14 * TILE_SIZE, dx: 0, dy: 0, color: '#FF69B4', mode: 'chase' }
    ],
    lastTime: 0,
    grid: [...GRID.map(row => [...row])] // Deep copy of the grid
};

// Canvas setup
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');

// Initialize game
document.addEventListener('DOMContentLoaded', () => {
    initializeDots();
    window.requestAnimationFrame(gameLoop);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
});

function initializeDots() {
    state.dots = [];
    for (let y = 0; y < state.grid.length; y++) {
        for (let x = 0; x < state.grid[y].length; x++) {
            if (state.grid[y][x] === 0) {
                state.dots.push({ x: x * TILE_SIZE + TILE_SIZE/2, y: y * TILE_SIZE + TILE_SIZE/2, isPowerPellet: false });
            }
        }
    }
    // Add power pellets
    state.dots[0].isPowerPellet = true;  // Top-left
    state.dots[state.dots.length - 1].isPowerPellet = true;  // Top-right
    state.dots[Math.floor(state.dots.length / 2)].isPowerPellet = true;  // Middle
}

function gameLoop(timestamp) {
    const deltaTime = timestamp - state.lastTime;
    state.lastTime = timestamp;

    update(deltaTime);
    render();
    
    if (!state.gameOver) {
        window.requestAnimationFrame(gameLoop);
    }
}

function update(deltaTime) {
    if (state.gameOver) return;

    // Update player
    updatePlayer();
    updateGhosts();
    checkCollisions();
    
    // Update animation
    state.player.mouthAngle += state.player.mouthSpeed * state.player.mouthDirection;
    if (state.player.mouthAngle > 0.2 || state.player.mouthAngle < 0) {
        state.player.mouthDirection *= -1;
    }
}

function updatePlayer() {
    // Try to change direction if there's a queued direction
    if (state.player.nextDir) {
        const { x, y } = state.player;
        const nextX = Math.floor((x + state.player.nextDir.dx * TILE_SIZE) / TILE_SIZE);
        const nextY = Math.floor((y + state.player.nextDir.dy * TILE_SIZE) / TILE_SIZE);
        
        if (nextX >= 0 && nextX < state.grid[0].length && 
            nextY >= 0 && nextY < state.grid.length && 
            state.grid[nextY][nextX] !== 1) {
            state.player.dx = state.player.nextDir.dx * state.player.speed;
            state.player.dy = state.player.nextDir.dy * state.player.speed;
            state.player.nextDir = null;
        }
    }

    // Move player
    const newX = state.player.x + state.player.dx;
    const newY = state.player.y + state.player.dy;

    // Check wall collisions
    const gridX = Math.floor(newX / TILE_SIZE);
    const gridY = Math.floor(newY / TILE_SIZE);
    
    if (canMoveTo(gridX, gridY)) {
        state.player.x = newX;
        state.player.y = newY;
    } else {
        // Stop movement if hitting a wall
        state.player.dx = 0;
        state.player.dy = 0;
    }

    // Tunnel through sides
    if (state.player.x < 0) state.player.x = canvas.width - 1;
    if (state.player.x >= canvas.width) state.player.x = 1;

    // Collect dots
    const playerGridX = Math.floor(state.player.x / TILE_SIZE);
    const playerGridY = Math.floor(state.player.y / TILE_SIZE);
    
    state.dots = state.dots.filter(dot => {
        const dotGridX = Math.floor(dot.x / TILE_SIZE);
        const dotGridY = Math.floor(dot.y / TILE_SIZE);
        
        if (dotGridX === playerGridX && dotGridY === playerGridY) {
            if (dot.isPowerPellet) {
                // Power pellet logic (make ghosts vulnerable)
                state.ghosts.forEach(ghost => ghost.mode = 'frightened');
                setTimeout(() => {
                    state.ghosts.forEach(ghost => ghost.mode = 'chase');
                }, 5000);
            }
            state.score += dot.isPowerPellet ? 50 : 10;
            return false;
        }
        return true;
    });

    // Check win condition
    if (state.dots.length === 0) {
        gameOver(true);
    }
}

function updateGhosts() {
    state.ghosts.forEach(ghost => {
        // Simple AI: Move randomly but prefer current direction
        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        // Filter out directions that would hit walls
        const validDirs = directions.filter(dir => {
            const nextX = Math.floor((ghost.x + dir.dx * TILE_SIZE) / TILE_SIZE);
            const nextY = Math.floor((ghost.y + dir.dy * TILE_SIZE) / TILE_SIZE);
            return canMoveTo(nextX, nextY);
        });

        // Choose a random valid direction
        if (validDirs.length > 0) {
            const dir = validDirs[Math.floor(Math.random() * validDirs.length)];
            ghost.dx = dir.dx * (ghost.mode === 'frightened' ? GHOST_SPEED * 0.5 : GHOST_SPEED);
            ghost.dy = dir.dy * (ghost.mode === 'frightened' ? GHOST_SPEED * 0.5 : GHOST_SPEED);
        }

        // Move ghost
        ghost.x += ghost.dx;
        ghost.y += ghost.dy;

        // Tunnel through sides
        if (ghost.x < 0) ghost.x = canvas.width - 1;
        if (ghost.x >= canvas.width) ghost.x = 1;
    });
}

function checkCollisions() {
    // Check ghost collisions
    state.ghosts.forEach(ghost => {
        const dx = state.player.x - ghost.x;
        const dy = state.player.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < state.player.radius + TILE_SIZE/2) {
            if (ghost.mode === 'frightened') {
                // Eat the ghost
                ghost.x = 14 * TILE_SIZE;
                ghost.y = 11 * TILE_SIZE;
                state.score += 200;
            } else {
                // Player dies
                state.lives--;
                if (state.lives <= 0) {
                    gameOver(false);
                } else {
                    // Reset positions
                    resetPositions();
                }
            }
        }
    });
}

function resetPositions() {
    state.player.x = 14 * TILE_SIZE + TILE_SIZE/2;
    state.player.y = 23 * TILE_SIZE + TILE_SIZE/2;
    state.player.dx = 0;
    state.player.dy = 0;
    
    state.ghosts = [
        { x: 14 * TILE_SIZE, y: 11 * TILE_SIZE, dx: GHOST_SPEED, dy: 0, color: '#FF0000', mode: 'chase' },
        { x: 13 * TILE_SIZE, y: 14 * TILE_SIZE, dx: -GHOST_SPEED, dy: 0, color: '#FFA500', mode: 'chase' },
        { x: 14 * TILE_SIZE, y: 14 * TILE_SIZE, dx: 0, dy: 0, color: '#00FFFF', mode: 'chase' },
        { x: 15 * TILE_SIZE, y: 14 * TILE_SIZE, dx: 0, dy: 0, color: '#FF69B4', mode: 'chase' }
    ];
}

function gameOver(won) {
    state.gameOver = true;
    gameOverDiv.textContent = won ? 'YOU WIN!' : 'GAME OVER';
    gameOverDiv.style.display = 'block';
}

function canMoveTo(x, y) {
    // Allow moving through the tunnel
    if (y === 11 && (x < 0 || x >= state.grid[0].length)) {
        return true;
    }
    
    if (x < 0 || x >= state.grid[0].length || y < 0 || y >= state.grid.length) {
        return false;
    }
    
    return state.grid[y][x] !== 1;
}

function handleKeyDown(e) {
    if (state.gameOver && e.key.toLowerCase() === 'r') {
        // Reset game
        state.gameOver = false;
        state.score = 0;
        state.lives = 3;
        state.grid = [...GRID.map(row => [...row])];
        initializeDots();
        resetPositions();
        gameOverDiv.style.display = 'none';
        window.requestAnimationFrame(gameLoop);
        return;
    }

    let dx = 0, dy = 0;
    
    switch(e.key) {
        case 'ArrowUp':
            dy = -1;
            break;
        case 'ArrowDown':
            dy = 1;
            break;
        case 'ArrowLeft':
            dx = -1;
            break;
        case 'ArrowRight':
            dx = 1;
            break;
        default:
            return; // Ignore other keys
    }
    
    // Queue the direction change
    state.player.nextDir = { dx, dy };
}

function handleKeyUp(e) {
    // This can be used to handle key releases if needed
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid (for debugging)
    // drawGrid();
    
    // Draw dots
    drawDots();
    
    // Draw player
    drawPlayer();
    
    // Draw ghosts
    drawGhosts();
    
    // Draw HUD
    drawHUD();
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    // Vertical lines
    for (let x = 0; x <= canvas.width; x += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= canvas.height; y += TILE_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // Draw walls
    ctx.fillStyle = '#00f';
    for (let y = 0; y < state.grid.length; y++) {
        for (let x = 0; x < state.grid[y].length; x++) {
            if (state.grid[y][x] === 1) {
                ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    }
}

function drawDots() {
    ctx.fillStyle = '#fff';
    state.dots.forEach(dot => {
        if (dot.isPowerPellet) {
            // Draw power pellet
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        } else {
            // Draw regular dot
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    });
}

function drawPlayer() {
    // Draw Pac-Man
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    
    // Determine rotation based on direction
    let angle = 0;
    if (state.player.dx > 0) angle = 0;
    else if (state.player.dx < 0) angle = Math.PI;
    else if (state.player.dy > 0) angle = Math.PI / 2;
    else if (state.player.dy < 0) angle = -Math.PI / 2;
    
    ctx.rotate(angle);
    
    // Only animate mouth if moving
    const mouthAngle = (state.player.dx === 0 && state.player.dy === 0) ? 0.2 : state.player.mouthAngle;
    
    // Draw Pac-Man
    ctx.beginPath();
    ctx.arc(0, 0, state.player.radius, mouthAngle, -mouthAngle, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    
    ctx.fillStyle = '#FF0';
    ctx.fill();
    
    ctx.restore();
}

function drawGhosts() {
    state.ghosts.forEach(ghost => {
        // Draw ghost body
        ctx.fillStyle = ghost.mode === 'frightened' ? '#0000FF' : ghost.color;
        
        // Draw ghost body (rounded rectangle)
        const ghostRadius = TILE_SIZE / 2 - 2;
        const x = ghost.x;
        const y = ghost.y;
        
        ctx.beginPath();
        // Top semi-circle
        ctx.arc(x, y - ghostRadius, ghostRadius, Math.PI, 0, false);
        // Bottom wavy part
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(x - ghostRadius + i * ghostRadius, y);
            ctx.lineTo(x - ghostRadius + (i + 0.5) * ghostRadius, y + ghostRadius / 2);
        }
        ctx.lineTo(x + ghostRadius, y);
        // Close the path
        ctx.closePath();
        ctx.fill();
        
        // Draw ghost eyes
        const eyeRadius = ghostRadius * 0.3;
        const leftEyeX = x - ghostRadius * 0.3;
        const rightEyeX = x + ghostRadius * 0.3;
        const eyeY = y - ghostRadius * 0.2;
        
        // White of the eyes
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        
        // Pupils
        ctx.fillStyle = '#000';
        const pupilOffset = ghostRadius * 0.15;
        let pupilX, pupilY = eyeY;
        
        // Left pupil
        if (ghost.dx > 0) pupilX = leftEyeX + pupilOffset;
        else if (ghost.dx < 0) pupilX = leftEyeX - pupilOffset;
        else pupilX = leftEyeX;
        
        if (ghost.dy > 0) pupilY = eyeY + pupilOffset;
        else if (ghost.dy < 0) pupilY = eyeY - pupilOffset;
        
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
        
        // Right pupil
        if (ghost.dx > 0) pupilX = rightEyeX + pupilOffset;
        else if (ghost.dx < 0) pupilX = rightEyeX - pupilOffset;
        else pupilX = rightEyeX;
        
        if (ghost.dy > 0) pupilY = eyeY + pupilOffset;
        else if (ghost.dy < 0) pupilY = eyeY - pupilOffset;
        
        ctx.moveTo(pupilX + eyeRadius * 0.5, pupilY);
        ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawHUD() {
    // Draw score
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, 10, 20);
    
    // Draw lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${state.lives}`, canvas.width - 10, 20);
    
    // Draw FPS (for debugging)
    // const fps = Math.round(1000 / (performance.now() - lastFrameTime));
    // ctx.textAlign = 'center';
    // ctx.fillText(`FPS: ${fps}`, canvas.width / 2, 20);
}
