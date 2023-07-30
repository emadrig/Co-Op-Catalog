from django.db import models
from django.conf import settings
import random

def setup_game_board():
    board = [[' ']*10 for _ in range(10)]

    def place_ship(board, ship, ship_char):
        placed = False
        while not placed:
            orientation = random.choice(['H', 'V'])
            if orientation == 'H':
                start_x = random.randint(1, 10 - ship - 2)
                start_y = random.randint(1, 10 - 2)
                # check ship and surrounding area
                if all(board[start_y + dy][start_x + dx] == ' ' for dy in range(-1, 2) for dx in range(-1, ship + 2)):
                    for i in range(ship):
                        board[start_y][start_x+i] = ship_char
                    placed = True
            elif orientation == 'V':
                start_x = random.randint(1, 10 - 2)
                start_y = random.randint(1, 10 - ship - 2)
                # check ship and surrounding area
                if all(board[start_y + dy][start_x + dx] == ' ' for dy in range(-1, ship + 2) for dx in range(-1, 2)):
                    for i in range(ship):
                        board[start_y+i][start_x] = ship_char
                    placed = True
        return board


    # board = [[' ']*10 for _ in range(10)]
    board = place_ship(board, 5, 'A')
    board = place_ship(board, 4, 'B')
    board = place_ship(board, 3, 'C')
    board = place_ship(board, 3, 'D')
    board = place_ship(board, 2, 'E')

    return board

def get_initial_counts():
    return {
        'A': 0,
        'B': 1,
        'C': 2,
        'D': 2,
        'E': 3,
        'sunk': 0
    }


class Game(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    rules = models.TextField()
    picture_1 = models.CharField(max_length=100, default='')
    picture_2 = models.CharField(max_length=100, default='')
    picture_3 = models.CharField(max_length=100, default='')
    picture_4 = models.CharField(max_length=100, default='')
    multiplayer = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PlayerHighScore(models.Model):
    score = models.IntegerField(default=1)

    game = models.ForeignKey(
        Game,
        related_name="player_high_score",
        on_delete=models.CASCADE
    )

    player = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='player_high_score',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return str(self.id)


class TicTacToeMatch(models.Model):
    state = models.CharField(max_length=10, default="nnnnnnnnn0")


class BattleshipMatch(models.Model):
    player_one_board = models.JSONField(default=setup_game_board)
    player_two_board = models.JSONField(default=setup_game_board)
    player_one_count = models.JSONField(default=get_initial_counts)
    player_two_count = models.JSONField(default=get_initial_counts)
    current_player = models.IntegerField(default=1)
    winner = models.BooleanField(default=False)
