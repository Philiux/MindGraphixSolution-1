from pydantic import BaseModel
from typing import Optional

class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: Optional[float] = None
    category: str

class Service(ServiceBase):
    id: int

    class Config:
        orm_mode = True
