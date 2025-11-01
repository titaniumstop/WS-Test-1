// This is a copy of the main web game logic
// Kept identical to root game.js for Netlify publishing from /web

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

const state = {
    score: 0,
    lives: 3,
    gameOver: false,
    dots: [],
    walls: [],
    player: {
        // Start on a guaranteed open tile
        x: 1 * TILE_SIZE + TILE_SIZE/2,
        y: 1 * TILE_SIZE + TILE_SIZE/2,
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
        { x: 14 * TILE_SIZE + TILE_SIZE/2, y: 11 * TILE_SIZE + TILE_SIZE/2, dx: GHOST_SPEED, dy: 0, color: '#FF0000', mode: 'chase' },
        { x: 13 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: -GHOST_SPEED, dy: 0, color: '#FFA500', mode: 'chase' },
        { x: 14 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: 0, dy: GHOST_SPEED, color: '#00FFFF', mode: 'chase' },
        { x: 15 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: 0, dy: -GHOST_SPEED, color: '#FF69B4', mode: 'chase' }
    ],
    lastTime: 0,
    grid: [...GRID.map(row => [...row])] // Deep copy of the grid
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameOverDiv = document.getElementById('gameOver');

function init() {
    initializeDots();
    // Start RAF loop
    window.requestAnimationFrame(gameLoop);
    // Fallback update/render interval in case RAF is throttled
    if (!window.__pacmanInterval) {
        window.__pacmanInterval = setInterval(() => {
            if (!state.gameOver) {
                update(16);
                render();
            }
        }, 1000 / 30);
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function initializeDots() {
    state.dots = [];
    for (let y = 0; y < state.grid.length; y++) {
        for (let x = 0; x < state.grid[y].length; x++) {
            if (state.grid[y][x] === 0) {
                state.dots.push({ x: x * TILE_SIZE + TILE_SIZE/2, y: y * TILE_SIZE + TILE_SIZE/2, isPowerPellet: false });
            }
        }
    }
    state.dots[0].isPowerPellet = true;
    state.dots[state.dots.length - 1].isPowerPellet = true;
    state.dots[Math.floor(state.dots.length / 2)].isPowerPellet = true;
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
    updatePlayer();
    updateGhosts();
    checkCollisions();
    state.player.mouthAngle += state.player.mouthSpeed * state.player.mouthDirection;
    if (state.player.mouthAngle > 0.2 || state.player.mouthAngle < 0) {
        state.player.mouthDirection *= -1;
    }
}

function updatePlayer() {
    if (state.player.nextDir) {
        const { x, y } = state.player;
        const nextX = Math.floor((x + state.player.nextDir.dx * TILE_SIZE) / TILE_SIZE);
        const nextY = Math.floor((y + state.player.nextDir.dy * TILE_SIZE) / TILE_SIZE);
        if (nextX >= 0 && nextX < state.grid[0].length && nextY >= 0 && nextY < state.grid.length && state.grid[nextY][nextX] !== 1) {
            state.player.dx = state.player.nextDir.dx * state.player.speed;
            state.player.dy = state.player.nextDir.dy * state.player.speed;
            state.player.nextDir = null;
        }
    }
    const newX = state.player.x + state.player.dx;
    const newY = state.player.y + state.player.dy;
    const gridX = Math.floor(newX / TILE_SIZE);
    const gridY = Math.floor(newY / TILE_SIZE);
    if (canMoveTo(gridX, gridY)) {
        state.player.x = newX;
        state.player.y = newY;
    } else {
        state.player.dx = 0;
        state.player.dy = 0;
    }
    if (state.player.x < 0) state.player.x = canvas.width - 1;
    if (state.player.x >= canvas.width) state.player.x = 1;
    const playerGridX = Math.floor(state.player.x / TILE_SIZE);
    const playerGridY = Math.floor(state.player.y / TILE_SIZE);
    state.dots = state.dots.filter(dot => {
        const dotGridX = Math.floor(dot.x / TILE_SIZE);
        const dotGridY = Math.floor(dot.y / TILE_SIZE);
        if (dotGridX === playerGridX && dotGridY === playerGridY) {
            if (dot.isPowerPellet) {
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
    if (state.dots.length === 0) {
        gameOver(true);
    }
}

function updateGhosts() {
    const atCenter = (x, y) => {
        const cx = (x - TILE_SIZE / 2) % TILE_SIZE;
        const cy = (y - TILE_SIZE / 2) % TILE_SIZE;
        return Math.abs(cx) < 0.5 && Math.abs(cy) < 0.5;
    };

    state.ghosts.forEach(ghost => {
        // Change direction only when near tile center
        if (atCenter(ghost.x, ghost.y)) {
            const gx = Math.floor(ghost.x / TILE_SIZE);
            const gy = Math.floor(ghost.y / TILE_SIZE);
            const cur = { dx: Math.sign(ghost.dx), dy: Math.sign(ghost.dy) };
            const reverse = { dx: -cur.dx, dy: -cur.dy };
            const choices = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];
            // Valid paths excluding immediate reversal
            let valid = choices.filter(d => !(d.dx === reverse.dx && d.dy === reverse.dy))
                .filter(d => canMoveTo(gx + d.dx, gy + d.dy));
            if (valid.length === 0) {
                // Allow reverse if no other option
                if (canMoveTo(gx + reverse.dx, gy + reverse.dy)) {
                    valid = [reverse];
                }
            }
            if (valid.length > 0) {
                const pick = valid[Math.floor(Math.random() * valid.length)];
                const spd = (ghost.mode === 'frightened' ? GHOST_SPEED * 0.5 : GHOST_SPEED);
                ghost.dx = pick.dx * spd;
                ghost.dy = pick.dy * spd;
            }
        }

        // If next step would enter a wall, stop and re-choose direction
        const nextGX = Math.floor((ghost.x + ghost.dx) / TILE_SIZE);
        const nextGY = Math.floor((ghost.y + ghost.dy) / TILE_SIZE);
        if (!canMoveTo(nextGX, nextGY)) {
            // Snap to center of current tile
            const cx = Math.floor(ghost.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
            const cy = Math.floor(ghost.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
            ghost.x = cx;
            ghost.y = cy;
            // Choose a new direction now
            const gx = Math.floor(ghost.x / TILE_SIZE);
            const gy = Math.floor(ghost.y / TILE_SIZE);
            const cur = { dx: Math.sign(ghost.dx), dy: Math.sign(ghost.dy) };
            const reverse = { dx: -cur.dx, dy: -cur.dy };
            const options = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];
            let valid2 = options.filter(d => !(d.dx === reverse.dx && d.dy === reverse.dy))
                .filter(d => canMoveTo(gx + d.dx, gy + d.dy));
            if (valid2.length === 0 && canMoveTo(gx + reverse.dx, gy + reverse.dy)) {
                valid2 = [reverse];
            }
            if (valid2.length > 0) {
                const pick = valid2[Math.floor(Math.random() * valid2.length)];
                const spd = (ghost.mode === 'frightened' ? GHOST_SPEED * 0.5 : GHOST_SPEED);
                ghost.dx = pick.dx * spd;
                ghost.dy = pick.dy * spd;
            } else {
                ghost.dx = 0;
                ghost.dy = 0;
            }
        } else {
            // Move ghost
            ghost.x += ghost.dx;
            ghost.y += ghost.dy;
        }

        // Tunnel through sides
        if (ghost.x < 0) ghost.x = canvas.width - 1;
        if (ghost.x >= canvas.width) ghost.x = 1;

        // Keep aligned to corridor: when moving horizontally, snap Y to tile center; vertically, snap X
        const centerX = Math.floor(ghost.x / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        const centerY = Math.floor(ghost.y / TILE_SIZE) * TILE_SIZE + TILE_SIZE / 2;
        if (Math.abs(ghost.dx) > Math.abs(ghost.dy)) {
            ghost.y = centerY;
        } else if (Math.abs(ghost.dy) > Math.abs(ghost.dx)) {
            ghost.x = centerX;
        }
    });
}

function checkCollisions() {
    state.ghosts.forEach(ghost => {
        const dx = state.player.x - ghost.x;
        const dy = state.player.y - ghost.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < state.player.radius + TILE_SIZE/2) {
            if (ghost.mode === 'frightened') {
                ghost.x = 14 * TILE_SIZE;
                ghost.y = 11 * TILE_SIZE;
                state.score += 200;
            } else {
                state.lives--;
                if (state.lives <= 0) {
                    gameOver(false);
                } else {
                    resetPositions();
                }
            }
        }
    });
}

function resetPositions() {
    // Reset to the same guaranteed open tile
    state.player.x = 1 * TILE_SIZE + TILE_SIZE/2;
    state.player.y = 1 * TILE_SIZE + TILE_SIZE/2;
    state.player.dx = 0;
    state.player.dy = 0;
    state.ghosts = [
        { x: 14 * TILE_SIZE + TILE_SIZE/2, y: 11 * TILE_SIZE + TILE_SIZE/2, dx: GHOST_SPEED, dy: 0, color: '#FF0000', mode: 'chase' },
        { x: 13 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: -GHOST_SPEED, dy: 0, color: '#FFA500', mode: 'chase' },
        { x: 14 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: 0, dy: GHOST_SPEED, color: '#00FFFF', mode: 'chase' },
        { x: 15 * TILE_SIZE + TILE_SIZE/2, y: 14 * TILE_SIZE + TILE_SIZE/2, dx: 0, dy: -GHOST_SPEED, color: '#FF69B4', mode: 'chase' }
    ];
}

function gameOver(won) {
    state.gameOver = true;
    gameOverDiv.textContent = won ? 'YOU WIN!' : 'GAME OVER';
    gameOverDiv.style.display = 'block';
}

function canMoveTo(x, y) {
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
            dy = -1; break;
        case 'ArrowDown':
            dy = 1; break;
        case 'ArrowLeft':
            dx = -1; break;
        case 'ArrowRight':
            dx = 1; break;
        default:
            return;
    }
    state.player.nextDir = { dx, dy };
}

function handleKeyUp(e) {}

function render() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawWalls();
    drawDots();
    drawPlayer();
    drawGhosts();
    drawHUD();
}

function drawWalls() {
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
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        } else {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
        }
    });
}

function drawPlayer() {
    ctx.save();
    ctx.translate(state.player.x, state.player.y);
    let angle = 0;
    if (state.player.dx > 0) angle = 0;
    else if (state.player.dx < 0) angle = Math.PI;
    else if (state.player.dy > 0) angle = Math.PI / 2;
    else if (state.player.dy < 0) angle = -Math.PI / 2;
    ctx.rotate(angle);
    const mouthAngle = (state.player.dx === 0 && state.player.dy === 0) ? 0.2 : state.player.mouthAngle;
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
        ctx.fillStyle = ghost.mode === 'frightened' ? '#0000FF' : ghost.color;
        const ghostRadius = TILE_SIZE / 2 - 2;
        const x = ghost.x;
        const y = ghost.y;
        ctx.beginPath();
        ctx.arc(x, y - ghostRadius, ghostRadius, Math.PI, 0, false);
        for (let i = 0; i < 3; i++) {
            ctx.lineTo(x - ghostRadius + i * ghostRadius, y);
            ctx.lineTo(x - ghostRadius + (i + 0.5) * ghostRadius, y + ghostRadius / 2);
        }
        ctx.lineTo(x + ghostRadius, y);
        ctx.closePath();
        ctx.fill();
        const eyeRadius = ghostRadius * 0.3;
        const leftEyeX = x - ghostRadius * 0.3;
        const rightEyeX = x + ghostRadius * 0.3;
        const eyeY = y - ghostRadius * 0.2;
        ctx.fillStyle = '#FFF';
        ctx.beginPath();
        ctx.arc(leftEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(rightEyeX, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000';
        const pupilOffset = ghostRadius * 0.15;
        let pupilX, pupilY = eyeY;
        if (ghost.dx > 0) pupilX = leftEyeX + pupilOffset;
        else if (ghost.dx < 0) pupilX = leftEyeX - pupilOffset;
        else pupilX = leftEyeX;
        if (ghost.dy > 0) pupilY = eyeY + pupilOffset;
        else if (ghost.dy < 0) pupilY = eyeY - pupilOffset;
        ctx.beginPath();
        ctx.arc(pupilX, pupilY, eyeRadius * 0.5, 0, Math.PI * 2);
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
    ctx.fillStyle = '#FFF';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${state.score}`, 10, 20);
    
    // Draw lives
    ctx.textAlign = 'right';
    ctx.fillText(`Lives: ${state.lives}`, canvas.width - 10, 20);
    
    // Debug info: player tile and velocity
    const pgx = Math.floor(state.player.x / TILE_SIZE);
    const pgy = Math.floor(state.player.y / TILE_SIZE);
    ctx.textAlign = 'center';
    ctx.fillText(`Tile: (${pgx},${pgy})  Vel: (${state.player.dx.toFixed(1)},${state.player.dy.toFixed(1)})`, canvas.width / 2, 20);
}
