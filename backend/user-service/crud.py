from sqlalchemy.orm import Session
import models
import schemas

def get_user(db: Session, user_id: int):
    return db.query(models.UserProfile).filter(models.UserProfile.user_id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.UserProfile).offset(skip).limit(limit).all()

def create_user_profile(db: Session, user_profile: schemas.UserProfileCreate):
    db_user_profile = models.UserProfile(**user_profile.dict())
    db.add(db_user_profile)
    db.commit()
    db.refresh(db_user_profile)
    return db_user_profile

def update_user(db: Session, user_id: int, user: schemas.UserUpdate):
    # Cette fonction serait normalement connectée au service d'authentification
    # Pour l'instant, c'est un placeholder
    return None

def delete_user(db: Session, user_id: int):
    db_user = get_user(db, user_id)
    if db_user:
        db.delete(db_user)
        db.commit()
        return True
    return False
