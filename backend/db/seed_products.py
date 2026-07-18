import os
import sys

# Add the parent directory to sys.path so we can import backend modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../')))

from backend.db.database import SessionLocal, engine
from backend.db.product_models import Base, Herb, HerbAlias, Product

def seed_database():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if we already have data
    if db.query(Herb).first():
        print("Database already seeded.")
        db.close()
        return

    print("Seeding Herbs and Aliases...")
    
    # 1. Yashtimadhu (Licorice)
    herb1 = Herb(
        canonical_name="Yashtimadhu",
        diseases_supported=["Amlapitta", "Hyperacidity", "Cough", "Common Cold"],
        symptoms_supported=["burning sensation", "heartburn", "sore throat", "cough"],
        contraindications=["Hypertension", "Pregnancy"]
    )
    
    alias1_1 = HerbAlias(alias_name="Licorice", herb=herb1)
    alias1_2 = HerbAlias(alias_name="Mulethi", herb=herb1)
    
    # 2. Tulsi (Holy Basil)
    herb2 = Herb(
        canonical_name="Tulsi",
        diseases_supported=["Common Cold", "Asthma", "Fever"],
        symptoms_supported=["cough", "congestion", "fever"],
        contraindications=[]
    )
    
    alias2_1 = HerbAlias(alias_name="Holy Basil", herb=herb2)
    
    # 3. Amla (Indian Gooseberry)
    herb3 = Herb(
        canonical_name="Amla",
        diseases_supported=["Amlapitta", "Hyperacidity", "Indigestion"],
        symptoms_supported=["burning sensation", "weak immunity"],
        contraindications=[]
    )
    
    alias3_1 = HerbAlias(alias_name="Indian Gooseberry", herb=herb3)
    alias3_2 = HerbAlias(alias_name="Amalaki", herb=herb3)

    db.add_all([herb1, herb2, herb3])
    db.commit()

    print("Seeding Products...")
    
    product1 = Product(
        product_name="Dabur Honitus Cough Syrup",
        brand="Dabur",
        description="Effective relief from cough and throat irritation.",
        price=120.0,
        rating=4.5,
        amazon_url="https://amazon.in/honitus",
        image_url="https://m.media-amazon.com/images/I/71R2H2r-D4L._SL1500_.jpg",
        ingredients=[herb1, herb2] # Yashtimadhu, Tulsi
    )
    
    product2 = Product(
        product_name="Himalaya Gasex Tablets",
        brand="Himalaya",
        description="Relieves indigestion, gas, and acidity.",
        price=150.0,
        rating=4.2,
        flipkart_url="https://flipkart.com/gasex",
        image_url="https://m.media-amazon.com/images/I/61k9P69yO4L._SL1500_.jpg",
        ingredients=[herb3] # Amla
    )

    product3 = Product(
        product_name="Patanjali Amla Juice",
        brand="Patanjali",
        description="Pure Amla juice for digestion and immunity.",
        price=110.0,
        rating=4.0,
        amazon_url="https://amazon.in/amla",
        image_url="https://m.media-amazon.com/images/I/71h3K+2n3yL._SL1500_.jpg",
        ingredients=[herb3] # Amla
    )

    product4 = Product(
        product_name="Kapiva Ashwagandha Gummies",
        brand="Kapiva",
        description="Reduces stress and boosts energy.",
        price=399.0,
        rating=4.6,
        amazon_url="https://amazon.in/kapiva-ashwagandha",
        image_url="https://m.media-amazon.com/images/I/61b7b7vA5sL._SL1500_.jpg",
        ingredients=[] # No specific herb mapped for now
    )

    product5 = Product(
        product_name="Baidyanath Chyawanprash",
        brand="Baidyanath",
        description="Immunity booster with 52 herbs.",
        price=320.0,
        rating=4.7,
        amazon_url="https://amazon.in/baidyanath-chyawanprash",
        image_url="https://m.media-amazon.com/images/I/71S8pT4w41L._SL1500_.jpg",
        ingredients=[herb3, herb2] # Amla, Tulsi
    )

    product6 = Product(
        product_name="Zandu Balm",
        brand="Zandu",
        description="Fast relief from headache and body ache.",
        price=45.0,
        rating=4.8,
        amazon_url="https://amazon.in/zandu-balm",
        image_url="https://m.media-amazon.com/images/I/61M5A0Z5-hL._SL1500_.jpg",
        ingredients=[]
    )

    product7 = Product(
        product_name="Dabur Chyawanprash",
        brand="Dabur",
        description="Boosts immunity and protects against infections.",
        price=345.0,
        rating=4.6,
        amazon_url="https://amazon.in/dabur-chyawanprash",
        image_url="https://m.media-amazon.com/images/I/71pE1y2oR9L._SL1500_.jpg",
        ingredients=[herb3] # Amla
    )

    product8 = Product(
        product_name="Himalaya Ashvagandha",
        brand="Himalaya",
        description="Pure herb extract for stress wellness.",
        price=180.0,
        rating=4.4,
        amazon_url="https://amazon.in/himalaya-ashvagandha",
        image_url="https://m.media-amazon.com/images/I/71Q3kH2g-6L._SL1500_.jpg",
        ingredients=[]
    )

    product9 = Product(
        product_name="Patanjali Divya Ashwagandha Churna",
        brand="Patanjali",
        description="Relieves stress and increases vitality.",
        price=95.0,
        rating=4.1,
        amazon_url="https://amazon.in/patanjali-ashwagandha",
        image_url="https://m.media-amazon.com/images/I/71-2QnU6pYL._SL1500_.jpg",
        ingredients=[]
    )

    product10 = Product(
        product_name="Zandu Pancharishta",
        brand="Zandu",
        description="Complete digestive care and appetite booster.",
        price=135.0,
        rating=4.3,
        amazon_url="https://amazon.in/zandu-pancharishta",
        image_url="https://m.media-amazon.com/images/I/71R1rJp2OJL._SL1500_.jpg",
        ingredients=[herb1, herb3]
    )

    db.add_all([product1, product2, product3, product4, product5, product6, product7, product8, product9, product10])
    db.commit()
    db.close()
    
    print("Seeding complete!")

if __name__ == "__main__":
    seed_database()
