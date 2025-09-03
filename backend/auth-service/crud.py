from sqlalchemy.orm import Session
import models
import schemas
from auth import get_password_hash, verify_password

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user:
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user

# Fonctions pour la gestion des rôles et permissions
def get_permission_by_name(db: Session, name: str):
    return db.query(models.Permission).filter(models.Permission.name == name).first()

def get_permission(db: Session, permission_id: int):
    return db.query(models.Permission).filter(models.Permission.id == permission_id).first()

def get_permissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Permission).offset(skip).limit(limit).all()

def create_permission(db: Session, permission: schemas.PermissionCreate):
    db_permission = models.Permission(
        name=permission.name,
        description=permission.description
    )
    db.add(db_permission)
    db.commit()
    db.refresh(db_permission)
    return db_permission

def get_role_by_name(db: Session, name: str):
    return db.query(models.Role).filter(models.Role.name == name).first()

def get_role(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_roles(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Role).offset(skip).limit(limit).all()

def create_role(db: Session, role: schemas.RoleCreate):
    db_role = models.Role(
        name=role.name,
        description=role.description,
        is_default=role.is_default
    )
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def add_permission_to_role(db: Session, role_id: int, permission_id: int):
    role = get_role(db, role_id)
    permission = get_permission(db, permission_id)
    if role and permission:
        role.permissions.append(permission)
        db.commit()
        db.refresh(role)
    return role

def add_role_to_user(db: Session, user_id: int, role_id: int):
    user = get_user(db, user_id)
    role = get_role(db, role_id)
    if user and role:
        user.roles.append(role)
        db.commit()
        db.refresh(user)
    return user

def get_user_roles(db: Session, user_id: int):
    user = get_user(db, user_id)
    return user.roles if user else []

def get_user_permissions(db: Session, user_id: int):
    user = get_user(db, user_id)
    if not user:
        return []
    
    # Récupérer toutes les permissions de tous les rôles de l'utilisateur
    permissions = []
    for role in user.roles:
        permissions.extend(role.permissions)
    
    # Éliminer les doublons
    unique_permissions = list({perm.id: perm for perm in permissions}.values())
    return unique_permissions

def user_has_permission(db: Session, user_id: int, permission_name: str):
    permissions = get_user_permissions(db, user_id)
    return any(perm.name == permission_name for perm in permissions)

def user_has_role(db: Session, user_id: int, role_name: str):
    roles = get_user_roles(db, user_id)
    return any(role.name == role_name for role in roles)
