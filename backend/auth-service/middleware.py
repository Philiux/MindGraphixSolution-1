from fastapi import HTTPException, status, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from database import get_db
import auth
import crud

def get_current_user(
    token: str = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    """
    Middleware pour obtenir l'utilisateur courant à partir du token
    """
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

def has_permission(permission_name: str):
    """
    Décorateur pour vérifier si l'utilisateur a une permission spécifique
    """
    def permission_checker(
        current_user = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        # Vérifier si l'utilisateur est superuser (accès complet)
        if current_user.is_superuser:
            return current_user
        
        # Vérifier les permissions de l'utilisateur
        user_permissions = crud.get_user_permissions(db, current_user.id)
        permission_names = [perm.name for perm in user_permissions]
        
        if permission_name not in permission_names:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission_name}' requise"
            )
        
        return current_user
    
    return permission_checker

def has_any_permission(permission_names: List[str]):
    """
    Décorateur pour vérifier si l'utilisateur a au moins une des permissions
    """
    def permission_checker(
        current_user = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        if current_user.is_superuser:
            return current_user
        
        user_permissions = crud.get_user_permissions(db, current_user.id)
        user_permission_names = [perm.name for perm in user_permissions]
        
        if not any(perm in user_permission_names for perm in permission_names):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Au moins une des permissions suivantes est requise: {permission_names}"
            )
        
        return current_user
    
    return permission_checker

def has_all_permissions(permission_names: List[str]):
    """
    Décorateur pour vérifier si l'utilisateur a toutes les permissions
    """
    def permission_checker(
        current_user = Depends(get_current_user),
        db: Session = Depends(get_db)
    ):
        if current_user.is_superuser:
            return current_user
        
        user_permissions = crud.get_user_permissions(db, current_user.id)
        user_permission_names = [perm.name for perm in user_permissions]
        
        if not all(perm in user_permission_names for perm in permission_names):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Toutes les permissions suivantes sont requises: {permission_names}"
            )
        
        return current_user
    
    return permission_checker
