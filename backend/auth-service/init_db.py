from database import SessionLocal, engine
import models
import crud
import schemas

def init_database():
    db = SessionLocal()
    
    try:
        # Créer les tables
        models.Base.metadata.create_all(bind=engine)
        
        # Permissions de base
        permissions_data = [
            {"name": "view_users", "description": "Voir les utilisateurs"},
            {"name": "manage_users", "description": "Gérer les utilisateurs"},
            {"name": "view_roles", "description": "Voir les rôles"},
            {"name": "manage_roles", "description": "Gérer les rôles"},
            {"name": "view_permissions", "description": "Voir les permissions"},
            {"name": "manage_permissions", "description": "Gérer les permissions"},
            {"name": "view_projects", "description": "Voir les projets"},
            {"name": "manage_projects", "description": "Gérer les projets"},
            {"name": "view_services", "description": "Voir les services"},
            {"name": "manage_services", "description": "Gérer les services"},
            {"name": "view_contacts", "description": "Voir les contacts"},
            {"name": "manage_contacts", "description": "Gérer les contacts"}
        ]
        
        # Créer les permissions
        for perm_data in permissions_data:
            if not crud.get_permission_by_name(db, perm_data["name"]):
                permission = schemas.PermissionCreate(**perm_data)
                crud.create_permission(db, permission)
        
        # Rôles de base
        roles_data = [
            {
                "name": "admin",
                "description": "Administrateur système avec tous les droits",
                "is_default": False,
                "permissions": [
                    "view_users", "manage_users",
                    "view_roles", "manage_roles",
                    "view_permissions", "manage_permissions",
                    "view_projects", "manage_projects",
                    "view_services", "manage_services",
                    "view_contacts", "manage_contacts"
                ]
            },
            {
                "name": "manager",
                "description": "Manager avec droits de gestion",
                "is_default": False,
                "permissions": [
                    "view_users", "view_roles", "view_permissions",
                    "view_projects", "manage_projects",
                    "view_services", "manage_services",
                    "view_contacts", "manage_contacts"
                ]
            },
            {
                "name": "user",
                "description": "Utilisateur standard",
                "is_default": True,
                "permissions": [
                    "view_projects", "view_services", "view_contacts"
                ]
            }
        ]
        
        # Créer les rôles et leurs permissions
        for role_data in roles_data:
            if not crud.get_role_by_name(db, role_data["name"]):
                role_create = schemas.RoleCreate(
                    name=role_data["name"],
                    description=role_data["description"],
                    is_default=role_data["is_default"]
                )
                role = crud.create_role(db, role_create)
                
                # Ajouter les permissions au rôle
                for perm_name in role_data["permissions"]:
                    permission = crud.get_permission_by_name(db, perm_name)
                    if permission:
                        crud.add_permission_to_role(db, role.id, permission.id)
        
        print("✅ Base de données initialisée avec succès!")
        print("📋 Permissions créées:", len(permissions_data))
        print("👥 Rôles créés:", len(roles_data))
        
    except Exception as e:
        print(f"❌ Erreur lors de l'initialisation: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
