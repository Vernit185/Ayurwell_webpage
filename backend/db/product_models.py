from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, Text, JSON, Table
from sqlalchemy.orm import relationship
from backend.db.database import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

# Association table for many-to-many relationship between Products and Herbs
product_ingredients = Table(
    'product_ingredients', Base.metadata,
    Column('product_id', String, ForeignKey('products.id'), primary_key=True),
    Column('herb_id', String, ForeignKey('herbs.id'), primary_key=True)
)

class Herb(Base):
    __tablename__ = "herbs"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    canonical_name = Column(String, unique=True, index=True)
    
    # Stored as JSON lists
    diseases_supported = Column(JSON, default=list)
    symptoms_supported = Column(JSON, default=list)
    contraindications = Column(JSON, default=list)

    # Relationships
    aliases = relationship("HerbAlias", back_populates="herb", cascade="all, delete-orphan")
    products = relationship("Product", secondary=product_ingredients, back_populates="ingredients")


class HerbAlias(Base):
    __tablename__ = "herb_aliases"

    alias_name = Column(String, primary_key=True, index=True)
    herb_id = Column(String, ForeignKey("herbs.id"))

    herb = relationship("Herb", back_populates="aliases")


class Product(Base):
    __tablename__ = "products"

    id = Column(String, primary_key=True, default=generate_uuid, index=True)
    product_name = Column(String, index=True)
    brand = Column(String, index=True)
    description = Column(Text)
    price = Column(Float, nullable=True)
    rating = Column(Float, default=0.0)
    availability_status = Column(Boolean, default=True)
    amazon_url = Column(String, nullable=True)
    flipkart_url = Column(String, nullable=True)
    image_url = Column(String, nullable=True)

    # Note: Medical relevance is dynamically derived via the ingredients graph,
    # avoiding hardcoded fields for symptoms/diseases here.
    
    # Relationships
    ingredients = relationship("Herb", secondary=product_ingredients, back_populates="products")
