import { Routes } from "@nestjs/core";
import { CoursesModule } from "./courses/courses.module";
import { StudentsModule } from "./students/students.module";

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