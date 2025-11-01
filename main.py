import math
import random
import sys

import pygame

TILE_SIZE = 16
PACMAN_SPEED = 2.0
GHOST_SPEED = 1.5
FPS = 60

GRID = [
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
]

WIDTH = len(GRID[0]) * TILE_SIZE
HEIGHT = len(GRID) * TILE_SIZE

YELLOW = (255, 255, 0)
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
BLUE = (0, 0, 255)
WALL_BLUE = (0, 60, 255)
RED = (255, 0, 0)
PINK = (255, 105, 180)
CYAN = (0, 255, 255)
ORANGE = (255, 165, 0)

def is_open_tile(cx: int, cy: int) -> bool:
    if cy < 0 or cy >= len(GRID) or cx < 0 or cx >= len(GRID[0]):
        return False
    return GRID[cy][cx] == 0

class Player:
    def __init__(self):
        # Start Pac-Man on a guaranteed open tile (1, 1)
        # GRID[1][1] == 0 in this layout
        self.x = 1 * TILE_SIZE + TILE_SIZE / 2
        self.y = 1 * TILE_SIZE + TILE_SIZE / 2
        self.dx = 0.0
        self.dy = 0.0
        self.next_dir = None
        self.radius = TILE_SIZE / 2 - 2
        self.speed = PACMAN_SPEED
        self.mouth_angle = 0.0
        self.mouth_dir = 1
        self.mouth_speed = 0.10

    def update(self):
        if self.next_dir is not None:
            ndx, ndy = self.next_dir
            nx = int((self.x + ndx * TILE_SIZE) // TILE_SIZE)
            ny = int((self.y + ndy * TILE_SIZE) // TILE_SIZE)
            if can_move_to(nx, ny):
                self.dx = ndx * self.speed
                self.dy = ndy * self.speed
                self.next_dir = None
        new_x = self.x + self.dx
        new_y = self.y + self.dy
        gx = int(new_x // TILE_SIZE)
        gy = int(new_y // TILE_SIZE)
        if can_move_to(gx, gy):
            self.x = new_x
            self.y = new_y
        else:
            self.dx = 0.0
            self.dy = 0.0
        if self.x < 0:
            self.x = WIDTH - 1
        if self.x >= WIDTH:
            self.x = 1
        self.mouth_angle += self.mouth_speed * self.mouth_dir
        if self.mouth_angle > 0.2 or self.mouth_angle < 0:
            self.mouth_dir *= -1

    def draw(self, surf):
        angle = 0.0
        if self.dx > 0:
            angle = 0.0
        elif self.dx < 0:
            angle = math.pi
        elif self.dy > 0:
            angle = math.pi / 2
        elif self.dy < 0:
            angle = -math.pi / 2
        mouth = 0.2 if (self.dx == 0 and self.dy == 0) else self.mouth_angle
        cx, cy = int(self.x), int(self.y)
        pygame.draw.circle(surf, YELLOW, (cx, cy), int(self.radius))
        mx = int(cx + math.cos(angle) * self.radius)
        my = int(cy + math.sin(angle) * self.radius)
        left_angle = angle + mouth
        right_angle = angle - mouth
        lx = int(cx + math.cos(left_angle) * self.radius)
        ly = int(cy + math.sin(left_angle) * self.radius)
        rx = int(cx + math.cos(right_angle) * self.radius)
        ry = int(cy + math.sin(right_angle) * self.radius)
        pygame.draw.polygon(surf, BLACK, [(cx, cy), (lx, ly), (mx, my), (rx, ry)])

class Ghost:
    def __init__(self, x, y, color):
        # Center on tile like the player
        self.x = x
        self.y = y
        self.dir = (1, 0)  # start moving right
        self.color = color
        self.mode = 'chase'

    def _at_tile_center(self):
        # Consider near-center if within 1 pixel of the exact center
        cx = (self.x - TILE_SIZE / 2) % TILE_SIZE
        cy = (self.y - TILE_SIZE / 2) % TILE_SIZE
        return abs(cx) < 1.0 and abs(cy) < 1.0

    def update(self):
        # Change direction only near center of current tile
        if self._at_tile_center():
            gx = int(self.x // TILE_SIZE)
            gy = int(self.y // TILE_SIZE)
            options = [(1,0),(-1,0),(0,1),(0,-1)]
            # Do not reverse unless no other option
            rev = (-self.dir[0], -self.dir[1])
            valid = []
            for ddx, ddy in options:
                if (ddx, ddy) == rev:
                    continue
                nx, ny = gx + ddx, gy + ddy
                if can_move_to(nx, ny):
                    valid.append((ddx, ddy))
            if not valid:
                # allow reverse if stuck
                nx, ny = gx + rev[0], gy + rev[1]
                if can_move_to(nx, ny):
                    valid = [rev]
            if valid:
                self.dir = random.choice(valid)
        speed = GHOST_SPEED * (0.5 if self.mode == 'frightened' else 1.0)
        self.x += self.dir[0] * speed
        self.y += self.dir[1] * speed
        if self.x < 0:
            self.x = WIDTH - 1
        if self.x >= WIDTH:
            self.x = 1

    def draw(self, surf):
        color = BLUE if self.mode == 'frightened' else self.color
        r = TILE_SIZE // 2 - 2
        x = int(self.x)
        y = int(self.y)
        body_rect = pygame.Rect(x - r, y - r, 2 * r, 2 * r)
        pygame.draw.rect(surf, color, (x - r, y - r, 2 * r, r))
        pygame.draw.circle(surf, color, (x - r // 2, y - r), r // 2)
        pygame.draw.circle(surf, color, (x + r // 2, y - r), r // 2)
        for i in range(3):
            wx = x - r + i * (2 * r // 3)
            wy = y + r - 2
            pygame.draw.polygon(surf, color, [(wx, wy), (wx + r // 3, y + r), (wx + 2 * r // 3, wy)])
        eye_r = int(r * 0.3)
        eye_y = y - int(r * 0.2)
        left_eye_x = x - int(r * 0.3)
        right_eye_x = x + int(r * 0.3)
        pygame.draw.circle(surf, WHITE, (left_eye_x, eye_y), eye_r)
        pygame.draw.circle(surf, WHITE, (right_eye_x, eye_y), eye_r)
        pupil_off = int(r * 0.15)
        dx, dy = self.dir
        px = left_eye_x + (pupil_off if dx > 0 else -pupil_off if dx < 0 else 0)
        py = eye_y + (pupil_off if dy > 0 else -pupil_off if dy < 0 else 0)
        pygame.draw.circle(surf, BLACK, (px, py), max(1, eye_r // 2))
        px = right_eye_x + (pupil_off if dx > 0 else -pupil_off if dx < 0 else 0)
        py = eye_y + (pupil_off if dy > 0 else -pupil_off if dy < 0 else 0)
        pygame.draw.circle(surf, BLACK, (px, py), max(1, eye_r // 2))

class Game:
    def __init__(self):
        pygame.init()
        pygame.display.set_caption("Pac-Man Style Game (Python)")
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        self.clock = pygame.time.Clock()
        self.font = pygame.font.SysFont("Arial", 16)
        self.big_font = pygame.font.SysFont("Arial", 48)
        self.reset()

    def reset(self):
        self.grid = [row[:] for row in GRID]
        self.player = Player()
        # Choose four unique open spawn tiles for ghosts, away from player, centered
        def choose_ghost_spawns():
            w, h = len(GRID[0]), len(GRID)
            px, py = 1, 1
            open_tiles = []
            for y in range(h):
                for x in range(w):
                    if GRID[y][x] == 0 and not (x == px and y == py):
                        # keep ones at least 4 tiles away from player
                        if abs(x - px) + abs(y - py) >= 8:
                            open_tiles.append((x, y))
            if len(open_tiles) < 4:
                # fallback to any open tiles
                open_tiles = [(x, y) for y in range(h) for x in range(w) if GRID[y][x] == 0 and not (x == px and y == py)]
            # Prefer tiles near center
            cx, cy = w // 2, h // 2
            open_tiles.sort(key=lambda t: abs(t[0] - cx) + abs(t[1] - cy))
            # Take first 20 candidates then sample 4 unique for spread
            candidates = open_tiles[:max(4, min(20, len(open_tiles)))]
            if len(candidates) >= 4:
                picks = random.sample(candidates, 4)
            else:
                picks = candidates
                while len(picks) < 4 and open_tiles:
                    nxt = open_tiles.pop()
                    if nxt not in picks:
                        picks.append(nxt)
            return picks[:4]

        spawns = choose_ghost_spawns()
        self.ghosts = []
        colors = [RED, ORANGE, CYAN, PINK]
        for (gx, gy), color in zip(spawns, colors):
            self.ghosts.append(Ghost(gx * TILE_SIZE + TILE_SIZE / 2, gy * TILE_SIZE + TILE_SIZE / 2, color))
        self.score = 0
        self.lives = 3
        self.game_over = False
        self.win = False
        self.dots = []
        for y in range(len(self.grid)):
            for x in range(len(self.grid[0])):
                if self.grid[y][x] == 0:
                    self.dots.append({
                        'x': x * TILE_SIZE + TILE_SIZE // 2,
                        'y': y * TILE_SIZE + TILE_SIZE // 2,
                        'pp': False
                    })
        if self.dots:
            self.dots[0]['pp'] = True
            self.dots[len(self.dots)//2]['pp'] = True
            self.dots[-1]['pp'] = True

    def handle_input(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit(0)
            if event.type == pygame.KEYDOWN:
                if self.game_over and event.key == pygame.K_r:
                    self.reset()
                    self.game_over = False
                    self.win = False
                if event.key == pygame.K_UP:
                    self.player.next_dir = (0, -1)
                elif event.key == pygame.K_DOWN:
                    self.player.next_dir = (0, 1)
                elif event.key == pygame.K_LEFT:
                    self.player.next_dir = (-1, 0)
                elif event.key == pygame.K_RIGHT:
                    self.player.next_dir = (1, 0)

    def update(self):
        if self.game_over:
            return
        self.player.update()
        for g in self.ghosts:
            g.update()
        pgx = int(self.player.x // TILE_SIZE)
        pgy = int(self.player.y // TILE_SIZE)
        new_dots = []
        for d in self.dots:
            dgx = d['x'] // TILE_SIZE
            dgy = d['y'] // TILE_SIZE
            if dgx == pgx and dgy == pgy:
                if d['pp']:
                    for g in self.ghosts:
                        g.mode = 'frightened'
                    pygame.time.set_timer(pygame.USEREVENT + 1, 5000, True)
                self.score += 50 if d['pp'] else 10
            else:
                new_dots.append(d)
        self.dots = new_dots
        for g in self.ghosts:
            dx = self.player.x - g.x
            dy = self.player.y - g.y
            if math.hypot(dx, dy) < self.player.radius + TILE_SIZE / 2:
                if g.mode == 'frightened':
                    g.x = 14 * TILE_SIZE
                    g.y = 11 * TILE_SIZE
                    self.score += 200
                else:
                    self.lives -= 1
                    if self.lives <= 0:
                        self.game_over = True
                        self.win = False
                    else:
                        # Soft reset of positions using the same spawn logic
                        self.player = Player()
                        # Reuse spawn chooser
                        def choose_ghost_spawns_soft():
                            w, h = len(GRID[0]), len(GRID)
                            px, py = 1, 1
                            open_tiles = [(x, y) for y in range(h) for x in range(w) if GRID[y][x] == 0 and not (x == px and y == py)]
                            cx, cy = w // 2, h // 2
                            open_tiles.sort(key=lambda t: abs(t[0] - cx) + abs(t[1] - cy))
                            return open_tiles[:4] if len(open_tiles) >= 4 else open_tiles
                        spawns2 = choose_ghost_spawns_soft()
                        colors = [RED, ORANGE, CYAN, PINK]
                        self.ghosts = []
                        for (gx, gy), color in zip(spawns2, colors):
                            self.ghosts.append(Ghost(gx * TILE_SIZE + TILE_SIZE / 2, gy * TILE_SIZE + TILE_SIZE / 2, color))
        if not self.dots:
            self.game_over = True
            self.win = True
        for event in pygame.event.get(pygame.USEREVENT + 1):
            for g in self.ghosts:
                g.mode = 'chase'

    def draw(self):
        self.screen.fill(BLACK)
        for y in range(len(self.grid)):
            for x in range(len(self.grid[0])):
                if self.grid[y][x] == 1:
                    pygame.draw.rect(self.screen, WALL_BLUE, (x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE))
        for d in self.dots:
            if d['pp']:
                pygame.draw.circle(self.screen, WHITE, (d['x'], d['y']), 8)
            else:
                pygame.draw.circle(self.screen, WHITE, (d['x'], d['y']), 3)
        for g in self.ghosts:
            g.draw(self.screen)
        self.player.draw(self.screen)
        score_surf = self.font.render(f"Score: {self.score}", True, WHITE)
        lives_surf = self.font.render(f"Lives: {self.lives}", True, WHITE)
        self.screen.blit(score_surf, (8, 4))
        self.screen.blit(lives_surf, (WIDTH - lives_surf.get_width() - 8, 4))
        if self.game_over:
            text = "YOU WIN!" if self.win else "GAME OVER"
            go_surf = self.big_font.render(text, True, YELLOW)
            hint = self.font.render("Press R to restart", True, WHITE)
            self.screen.blit(go_surf, (WIDTH // 2 - go_surf.get_width() // 2, HEIGHT // 2 - go_surf.get_height()))
            self.screen.blit(hint, (WIDTH // 2 - hint.get_width() // 2, HEIGHT // 2 + 8))
        pygame.display.flip()

    def run(self):
        while True:
            self.clock.tick(FPS)
            self.handle_input()
            self.update()
            self.draw()


def can_move_to(x, y):
    if y == 11 and (x < 0 or x >= len(GRID[0])):
        return True
    if x < 0 or x >= len(GRID[0]) or y < 0 or y >= len(GRID):
        return False
    return GRID[y][x] != 1


if __name__ == "__main__":
    Game().run()
