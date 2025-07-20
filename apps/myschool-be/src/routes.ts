import { Routes } from "@nestjs/core";
import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";
import { UserModule } from "./modules/users/user.module";
import { PermissionModule } from "./modules/permission/permission.module";
import { FileModule } from "./modules/file/file.module";

export const routes : Routes = [
    {
        path : 'users',
        module : UserModule
    },
    {
        path : 'courses',
        module : CoursesModule
    },
    {
        path : 'students',
        module : StudentsModule
    },
    {
        path : 'permissions',
        module : PermissionModule
    },
    {
        path : 'files',
        module : FileModule
    }
]