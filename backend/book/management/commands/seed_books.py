from django.core.management.base import BaseCommand
from book.models import Book


class Command(BaseCommand):
    help = 'Seeds the database with sample books'

    def handle(self, *args, **kwargs):
        # Clear existing books
        Book.objects.all().delete()
        self.stdout.write(self.style.WARNING('Cleared existing books'))

        # Default picture URL for all books
        default_picture = "https://i.pinimg.com/736x/2b/6d/8b/2b6d8bf536d247fe87df9fd48bb7e2a8.jpg"

        books_data = [
            # Science Fiction
            {
                'title': 'Dune',
                'author': 'Frank Herbert',
                'genre': 'science_fiction',
                'description': 'On the desert planet Arrakis—also called Dune—young Paul Atreides becomes embroiled in political intrigue, resource control, and a prophecy about the future of humanity. The desert\'s precious "spice" is key to interstellar travel, and Paul\'s destiny may reshape the fate of his people.',
                'available_copies': 5,
                'picture_url': default_picture,
            },
            {
                'title': 'Neuromancer',
                'author': 'William Gibson',
                'genre': 'science_fiction',
                'description': 'Case, a washed-up computer hacker, is hired by a mysterious employer to pull off the ultimate hack. With an ex-soldier-turned-bodyguard, he navigates a dangerous world of AI, virtual reality, and corporate conspiracies.',
                'available_copies': 3,
                'picture_url': default_picture,
            },
            {
                'title': 'Childhood\'s End',
                'author': 'Arthur C. Clarke',
                'genre': 'science_fiction',
                'description': 'Earth is peacefully taken over by alien Overlords offering a utopia. But as decades pass, humanity\'s identity and culture begin to change—and not necessarily for the better.',
                'available_copies': 4,
                'picture_url': default_picture,
            },
            {
                'title': 'Ringworld',
                'author': 'Larry Niven',
                'genre': 'science_fiction',
                'description': 'Louis Wu and a team embark on a mission to explore the Ringworld—a gigantic artificial ring orbiting a star. It\'s a marvel of engineering with its own civilizations and dangers.',
                'available_copies': 2,
                'picture_url': default_picture,
            },
            {
                'title': 'The Splinter in the Sky',
                'author': 'Kemi Ashing-Giwa',
                'genre': 'science_fiction',
                'description': 'A debut novel about a young woman who, after surviving a spaceship crash, is forced to navigate politics, identity, and secrets in a fractured space empire.',
                'available_copies': 3,
                'picture_url': default_picture,
            },

            # Fantasy
            {
                'title': 'The Lord of the Rings',
                'author': 'J.R.R. Tolkien',
                'genre': 'fantasy',
                'description': 'Frodo Baggins inherits a powerful ring that can dominate Middle-earth. He, along with a fellowship of unlikely heroes, must journey to Mount Doom to destroy it and stop the Dark Lord Sauron.',
                'available_copies': 6,
                'picture_url': default_picture,
            },
            {
                'title': 'The Shadow and Bone Trilogy',
                'author': 'Leigh Bardugo',
                'genre': 'fantasy',
                'description': 'In a war-torn land, Alina Starkov discovers she has a rare power that could be the key to saving her country. She\'s taken to the royal court, but dark forces conspire around her.',
                'available_copies': 4,
                'picture_url': default_picture,
            },
            {
                'title': 'The Book of Love',
                'author': 'Kelly Link',
                'genre': 'fantasy',
                'description': 'Four teenagers return from the dead in a coastal Massachusetts town—and must navigate both the mystery of their resurrection and magical challenges to remain among the living.',
                'available_copies': 3,
                'picture_url': default_picture,
            },
            {
                'title': 'The Hobbit',
                'author': 'J.R.R. Tolkien',
                'genre': 'fantasy',
                'description': 'Bilbo Baggins, a humble hobbit, is swept into an epic adventure to help a group of dwarves reclaim their homeland from a dragon. Along the way, he discovers courage, friendship, and a magical ring.',
                'available_copies': 5,
                'picture_url': default_picture,
            },
            {
                'title': 'The Name of the Wind',
                'author': 'Patrick Rothfuss',
                'genre': 'fantasy',
                'description': 'Kvothe, a legendary figure, tells the story of his life—from his childhood in a traveling troupe, through tragedy, to his time at a magical university—seeking knowledge and vengeance.',
                'available_copies': 4,
                'picture_url': default_picture,
            },

            # Horror
            {
                'title': 'Dracula',
                'author': 'Bram Stoker',
                'genre': 'horror',
                'description': 'Told through letters and journal entries, the novel follows Jonathan Harker\'s journey to Dracula\'s castle. Once Dracula arrives in England, a group led by Van Helsing must confront the vampire\'s evil.',
                'available_copies': 3,
                'picture_url': default_picture,
            },
            {
                'title': 'Frankenstein',
                'author': 'Mary Shelley',
                'genre': 'horror',
                'description': 'Victor Frankenstein creates life from dead tissue—but his creation is monstrous and rejected. The creature, intelligent and anguished, seeks understanding and revenge.',
                'available_copies': 4,
                'picture_url': default_picture,
            },
            {
                'title': 'The Haunting of Hill House',
                'author': 'Shirley Jackson',
                'genre': 'horror',
                'description': 'Four people stay in the famously haunted Hill House to study supernatural phenomena. The house\'s sinister presence and psychological tension blur the lines between reality and ghostly terror.',
                'available_copies': 2,
                'picture_url': default_picture,
            },
            {
                'title': 'It',
                'author': 'Stephen King',
                'genre': 'horror',
                'description': 'In the town of Derry, a shape-shifting entity takes the form of a creepy clown and preys on children. A group of friends must confront their fears—both supernatural and personal—to stop it.',
                'available_copies': 5,
                'picture_url': default_picture,
            },
            {
                'title': 'Mexican Gothic',
                'author': 'Silvia Moreno-Garcia',
                'genre': 'horror',
                'description': 'In 1950s Mexico, Noemí goes to check on her cousin in a creepy, decaying mansion. She uncovers dark secrets, unsettling experiments, and a terrifying family legacy.',
                'available_copies': 3,
                'picture_url': default_picture,
            },

            # Romance
            {
                'title': 'Pride and Prejudice',
                'author': 'Jane Austen',
                'genre': 'romance',
                'description': 'Elizabeth Bennet and Mr. Darcy initially clash due to their pride and prejudices, but as they learn more about each other and themselves, their relationship deepens in surprising ways.',
                'available_copies': 6,
                'picture_url': default_picture,
            },
            {
                'title': 'The Beauty That Remains',
                'author': 'Ashley Woodfolk',
                'genre': 'romance',
                'description': 'After two teens lose their older brothers, they find each other through music and grief; their bond helps them heal and rediscover hope.',
                'available_copies': 3,
                'picture_url': default_picture,
            },
            {
                'title': 'Stone Cold Touch',
                'author': 'Jennifer L. Armentrout',
                'genre': 'romance',
                'description': 'A girl with a supernatural secret meets a mysterious guy who can literally freeze her with his touch. Their relationship becomes dangerous, heart-pounding, and full of magic.',
                'available_copies': 4,
                'picture_url': default_picture,
            },
            {
                'title': 'The Coldest Touch',
                'author': 'Isabel Sterling',
                'genre': 'romance',
                'description': 'A human woman must navigate her way through a hidden world of gods, beasts, and curses—especially when she\'s drawn to a being who might freeze her heart in more ways than one.',
                'available_copies': 2,
                'picture_url': default_picture,
            },
            {
                'title': 'Outlander',
                'author': 'Diana Gabaldon',
                'genre': 'romance',
                'description': 'Claire, a WWII nurse, time-travels to 18th-century Scotland where she meets Jamie Fraser. Their love defies the boundaries of time—but danger always lurks.',
                'available_copies': 5,
                'picture_url': default_picture,
            },
        ]

        # Create books
        for book_data in books_data:
            book = Book.objects.create(**book_data)
            self.stdout.write(self.style.SUCCESS(
                f'Created book: {book.title}'))

        self.stdout.write(self.style.SUCCESS(
            f'\nSuccessfully seeded {len(books_data)} books!'))
