from random_words import RandomWords, RandomEmails
import random


rw = RandomWords()
re = RandomEmails()

def make_guest():
    username = rw.random_word() + str(random.randint(100, 1000))
    password = rw.random_word() + str(random.randint(100, 1000))
    email = re.randomMail()
    return {
        "username": username,
        "password": password,
        "email": email,
        "first_name": "guest",
        "last_name": "guest",
        "is_guest": True
    }