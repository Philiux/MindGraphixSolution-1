from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import Optional, List
import os
from dotenv import load_dotenv

from database import SessionLocal, engine
import models
import schemas
import crud
import auth
import middleware

# Charger les variables d'environnement
load_dotenv()

# Créer les tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auth Service",
    description="Service d'authentification pour MindGraphix",
    version="1.0.0"
)

# Dépendance pour obtenir la session de base de données
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.email})
    refresh_token = auth.create_refresh_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

@app.post("/refresh", response_model=schemas.TokenRefresh)
async def refresh_token(
    refresh_token: str,
    db: Session = Depends(get_db)
):
    new_access_token = auth.refresh_access_token(refresh_token)
    if not new_access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token invalide ou expiré",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return {
        "access_token": new_access_token,
        "token_type": "bearer"
    }

# Endpoints pour la gestion des rôles et permissions
@app.post("/permissions", response_model=schemas.Permission)
def create_permission(
    permission: schemas.PermissionCreate,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("manage_permissions"))
):
    db_permission = crud.get_permission_by_name(db, name=permission.name)
    if db_permission:
        raise HTTPException(
            status_code=400,
            detail="Permission déjà existante"
        )
    return crud.create_permission(db=db, permission=permission)

@app.get("/permissions", response_model=List[schemas.Permission])
def read_permissions(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("view_permissions"))
):
    permissions = crud.get_permissions(db, skip=skip, limit=limit)
    return permissions

@app.post("/roles", response_model=schemas.Role)
def create_role(
    role: schemas.RoleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("manage_roles"))
):
    db_role = crud.get_role_by_name(db, name=role.name)
    if db_role:
        raise HTTPException(
            status_code=400,
            detail="Rôle déjà existant"
        )
    return crud.create_role(db=db, role=role)

@app.get("/roles", response_model=List[schemas.Role])
def read_roles(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("view_roles"))
):
    roles = crud.get_roles(db, skip=skip, limit=limit)
    return roles

@app.post("/roles/{role_id}/permissions/{permission_id}")
def add_permission_to_role(
    role_id: int,
    permission_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("manage_roles"))
):
    return crud.add_permission_to_role(db, role_id=role_id, permission_id=permission_id)

@app.post("/users/{user_id}/roles/{role_id}")
def add_role_to_user(
    user_id: int,
    role_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(middleware.has_permission("manage_users"))
):
    return crud.add_role_to_user(db, user_id=user_id, role_id=role_id)

@app.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email déjà enregistré"
        )
    return crud.create_user(db=db, user=user)

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = auth.verify_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token invalide",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = crud.get_user_by_email(db, email=email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouvé"
        )
    return user

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)
