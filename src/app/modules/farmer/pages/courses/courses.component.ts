import { Component, OnInit } from '@angular/core';
import { CourseService } from 'src/app/shared/services/course/course.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit {
  courses: any = [];

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.getCourses();
  }

  getCourses = () => {
    this.courseService.getAllCourses().subscribe((data: any) => {
      this.courses = data.sort((a: any, b: any) => b.courseId - a.courseId);
    });
  };
}
