import { Routes } from "@nestjs/core";
import { CoursesModule } from "./modules/courses/courses.module";
import { StudentsModule } from "./modules/students/students.module";

export const routes : Routes = [
    {
        path : 'courses',
        module : CoursesModule
    },
    {
        path : 'students',
        module : StudentsModule
    }
]