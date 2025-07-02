"""
Service to initialize sample data for the application.
"""
from app.core.database import get_db_connection
from app.core.auth import get_password_hash
import datetime
import sqlite3

async def init_sample_data():
    """Initialize the database with sample users and posts."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create sample users
        sample_users = [
            {
                'username': 'john_doe',
                'email': 'john@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'John Doe',
                'avatar_url': 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
                'bio': 'Software developer and outdoor enthusiast'
            },
            {
                'username': 'emma_wilson',
                'email': 'emma@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'Emma Wilson',
                'avatar_url': 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=40&h=40&fit=crop&crop=face',
                'bio': 'Adventure seeker and nature lover 🏔️'
            },
            {
                'username': 'james_rodriguez',
                'email': 'james@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'James Rodriguez',
                'avatar_url': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                'bio': 'Photographer and travel blogger'
            },
            {
                'username': 'sarah_chen',
                'email': 'sarah@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'Sarah Chen',
                'avatar_url': 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
                'bio': 'Designer and artist'
            },
            {
                'username': 'tech_news',
                'email': 'tech@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'Tech News Daily',
                'avatar_url': 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=40&h=40&fit=crop&crop=face',
                'bio': 'Latest technology news and updates'
            },
            {
                'username': 'lisa_anderson',
                'email': 'lisa@example.com',
                'password': get_password_hash('password123'),
                'full_name': 'Lisa Anderson',
                'avatar_url': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
                'bio': 'Chef and food enthusiast 🍝'
            }
        ]
        
        user_ids = []
        for user in sample_users:
            # Check if user already exists
            cursor.execute("SELECT id FROM users WHERE email = ?", (user['email'],))
            existing_user = cursor.fetchone()
            
            if not existing_user:
                cursor.execute("""
                    INSERT INTO users (username, email, hashed_password, full_name, avatar_url, bio, is_active, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    user['username'],
                    user['email'],
                    user['password'],
                    user['full_name'],
                    user['avatar_url'],
                    user['bio'],
                    True,  # is_active
                    datetime.datetime.utcnow()
                ))
                user_ids.append(cursor.lastrowid)
            else:
                user_ids.append(existing_user[0])
        
        # Create sample posts
        sample_posts = [
            {
                'author_id': user_ids[1],  # Emma Wilson
                'content': "Just finished an amazing hike in the mountains! 🏔️ The view was absolutely breathtaking. Nature never fails to amaze me. Who else loves outdoor adventures?",
                'image_url': 'https://images.unsplash.com/photo-1464822759844-d150baec3e92?w=600&h=400&fit=crop',
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            },
            {
                'author_id': user_ids[4],  # Tech News Daily
                'content': "🚀 Breaking: New AI breakthrough announced! Researchers have developed a new machine learning model that can understand context better than ever before. This could revolutionize how we interact with technology.\n\nWhat are your thoughts on the future of AI?",
                'image_url': None,
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=4)
            },
            {
                'author_id': user_ids[5],  # Lisa Anderson
                'content': "Cooked my first homemade pasta from scratch! 🍝 It was definitely a learning experience, but the result was delicious. Cooking is such a therapeutic activity for me.",
                'image_url': 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=600&h=400&fit=crop',
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=6)
            },
            {
                'author_id': user_ids[2],  # James Rodriguez
                'content': "Captured this stunning sunset during my evening walk. Sometimes the best moments are the unexpected ones. 📸✨",
                'image_url': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=8)
            },
            {
                'author_id': user_ids[3],  # Sarah Chen
                'content': "Working on a new design project today. Love the creative process and bringing ideas to life! What inspires your creativity?",
                'image_url': 'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=400&fit=crop',
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=10)
            }
        ]
        
        post_ids = []
        for post in sample_posts:
            # Check if post content already exists (simple duplicate check)
            cursor.execute("SELECT id FROM posts WHERE content = ? AND author_id = ?", 
                         (post['content'], post['author_id']))
            existing_post = cursor.fetchone()
            
            if not existing_post:
                cursor.execute("""
                    INSERT INTO posts (author_id, content, image_url, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?)
                """, (
                    post['author_id'],
                    post['content'],
                    post['image_url'],
                    post['created_at'],
                    post['created_at']
                ))
                post_ids.append(cursor.lastrowid)
            else:
                post_ids.append(existing_post[0])
        
        # Create sample comments
        sample_comments = [
            {
                'post_id': post_ids[0],  # Emma's hiking post
                'author_id': user_ids[2],  # James Rodriguez
                'content': "Wow, that's an incredible view! Which trail did you take?",
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=1)
            },
            {
                'post_id': post_ids[0],  # Emma's hiking post
                'author_id': user_ids[3],  # Sarah Chen
                'content': "So jealous! I need to plan a hiking trip soon 😍",
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(minutes=30)
            },
            {
                'post_id': post_ids[1],  # Tech News post
                'author_id': user_ids[0],  # John Doe
                'content': "This is fascinating! Can't wait to see how this develops.",
                'created_at': datetime.datetime.utcnow() - datetime.timedelta(hours=3)
            }
        ]
        
        for comment in sample_comments:
            # Check if comment already exists
            cursor.execute("SELECT id FROM comments WHERE content = ? AND post_id = ? AND author_id = ?", 
                         (comment['content'], comment['post_id'], comment['author_id']))
            existing_comment = cursor.fetchone()
            
            if not existing_comment:
                cursor.execute("""
                    INSERT INTO comments (post_id, author_id, content, created_at)
                    VALUES (?, ?, ?, ?)
                """, (
                    comment['post_id'],
                    comment['author_id'],
                    comment['content'],
                    comment['created_at']
                ))
        
        conn.commit()
        print("Sample data initialized successfully!")
        
    except sqlite3.Error as e:
        print(f"Error initializing sample data: {e}")
        conn.rollback()
    finally:
        conn.close()

async def init_sample_stories():
    """Initialize sample stories with multiple images."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create stories table if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS stories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                author_id INTEGER NOT NULL,
                title TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                expires_at DATETIME NOT NULL,
                FOREIGN KEY (author_id) REFERENCES users (id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS story_images (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                story_id INTEGER NOT NULL,
                image_url TEXT NOT NULL,
                caption TEXT,
                order_index INTEGER NOT NULL DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (story_id) REFERENCES stories (id)
            )
        ''')
        
        # Clear existing stories
        cursor.execute("DELETE FROM story_images")
        cursor.execute("DELETE FROM stories")
        
        # Sample stories with multiple images
        sample_stories = [
            {
                'author_id': 2,  # Emma Wilson
                'title': 'Mountain Adventure',
                'expires_at': (datetime.datetime.now() + datetime.timedelta(hours=24)).isoformat(),
                'images': [
                    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1464822759844-d150baec3e92?w=600&h=800&fit=crop'
                ]
            },
            {
                'author_id': 3,  # James Rodriguez
                'title': 'City Photography',
                'expires_at': (datetime.datetime.now() + datetime.timedelta(hours=23)).isoformat(),
                'images': [
                    'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=800&fit=crop'
                ]
            },
            {
                'author_id': 4,  # Sarah Chen
                'title': 'Art & Design',
                'expires_at': (datetime.datetime.now() + datetime.timedelta(hours=22)).isoformat(),
                'images': [
                    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=800&fit=crop',
                    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop'
                ]
            }
        ]
        
        # Insert stories and their images
        for story_data in sample_stories:
            cursor.execute('''
                INSERT INTO stories (author_id, title, expires_at)
                VALUES (?, ?, ?)
            ''', (story_data['author_id'], story_data['title'], story_data['expires_at']))
            
            story_id = cursor.lastrowid
            
            for index, image_url in enumerate(story_data['images']):
                cursor.execute('''
                    INSERT INTO story_images (story_id, image_url, order_index)
                    VALUES (?, ?, ?)
                ''', (story_id, image_url, index))
        
        conn.commit()
        print("Sample stories initialized successfully!")
        
    except sqlite3.Error as e:
        print(f"Error initializing sample stories: {e}")
        conn.rollback()
    finally:
        conn.close()

def reset_database():
    """Reset the database by dropping and recreating tables."""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Drop existing tables
        cursor.execute("DROP TABLE IF EXISTS story_images")
        cursor.execute("DROP TABLE IF EXISTS stories")
        cursor.execute("DROP TABLE IF EXISTS refresh_tokens")
        cursor.execute("DROP TABLE IF EXISTS messages")
        cursor.execute("DROP TABLE IF EXISTS comments")
        cursor.execute("DROP TABLE IF EXISTS posts")
        cursor.execute("DROP TABLE IF EXISTS users")
        
        # Recreate tables
        from app.core.database import create_tables
        create_tables()
        
        conn.commit()
        print("Database reset successfully!")
        
    except sqlite3.Error as e:
        print(f"Error resetting database: {e}")
        conn.rollback()
    finally:
        conn.close()
