import { Routes } from "@nestjs/core";
import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";
import { UserModule } from "./modules/users/user.module";

export const routes : Routes = [
    {
        path : 'courses',
        module : CoursesModule
    },
    {
        path : 'students',
        module : StudentsModule
    },
    {
        path : 'users',
        module : UserModule
    }
]