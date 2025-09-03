from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    class Config:
        orm_mode = True

# Schémas pour les permissions
class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None

class PermissionCreate(PermissionBase):
    pass

class Permission(PermissionBase):
    id: int
    created_at: str

    class Config:
        orm_mode = True

# Schémas pour les rôles
class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False

class RoleCreate(RoleBase):
    pass

class Role(RoleBase):
    id: int
    created_at: str
    permissions: List[Permission] = []

    class Config:
        orm_mode = True

# Schémas pour les tokens
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class TokenRefresh(BaseModel):
    access_token: str
    token_type: str
