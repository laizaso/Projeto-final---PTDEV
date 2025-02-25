import { SetMetadata } from "@nestjs/common"; //verifica permiçoes 
import { Role } from "@prisma/client";

export const ROLES_KEY = 'roles';


export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles); // define Roles com decorator para poder chamar Role que tem dois valores